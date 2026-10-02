"use server";

import { randomInt } from "node:crypto";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { ensureDatabase } from "@/db/bootstrap";
import { orderItems, orders, products, productVariants, reviews, subscribers } from "@/db/schema";
import { GOVERNORATE_VALUES } from "@/lib/constants";
import { computeTotals } from "@/lib/pricing";

type FieldErrors = Record<string, string>;

function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ----------------------------- Reviews ----------------------------- */

export type ReviewFormState = { ok: boolean; message?: string; errors?: FieldErrors; submittedAt?: number };

const reviewSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().min(1),
  authorName: z.string().trim().min(2, "Please tell us your name.").max(60, "Name is too long."),
  city: z.string().trim().max(60, "City is too long."),
  rating: z.number().int().min(1, "Please choose a star rating.").max(5),
  title: z.string().trim().min(3, "Add a short headline.").max(80, "Headline is too long."),
  body: z
    .string()
    .trim()
    .min(15, "Tell us a little more — at least 15 characters.")
    .max(1200, "Review is too long."),
});

export async function submitReview(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  // Honeypot: bots fill hidden fields, humans don't.
  if (String(formData.get("website") ?? "").length > 0) {
    return { ok: true, message: "Thank you! Your review has been published.", submittedAt: Date.now() };
  }

  const parsed = reviewSchema.safeParse({
    productId: Number(formData.get("productId")),
    slug: String(formData.get("slug") ?? ""),
    authorName: String(formData.get("authorName") ?? ""),
    city: String(formData.get("city") ?? ""),
    rating: Number(formData.get("rating") ?? 0),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) };

  const data = parsed.data;
  await ensureDatabase();
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, data.productId))
    .limit(1);
  if (!product) return { ok: false, message: "This product no longer exists." };

  await db.insert(reviews).values({
    productId: data.productId,
    authorName: data.authorName,
    city: data.city || null,
    rating: data.rating,
    title: data.title,
    body: data.body,
    isVerified: false,
  });

  await db.execute(sql`
    update products set
      rating_avg = coalesce((select avg(rating)::real from reviews where product_id = ${data.productId}), 0),
      review_count = (select count(*)::int from reviews where product_id = ${data.productId})
    where id = ${data.productId}
  `);

  revalidatePath(`/products/${data.slug}`);
  return { ok: true, message: "Thank you! Your review has been published.", submittedAt: Date.now() };
}

/* ---------------------------- Newsletter --------------------------- */

export type NewsletterState = { ok: boolean; message?: string };

export async function subscribeNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  await ensureDatabase();
  await db.insert(subscribers).values({ email }).onConflictDoNothing();
  return { ok: true, message: "Welcome to the Re7an circle! Use code WELCOME10 for 10% off." };
}

/* ----------------------------- Checkout ---------------------------- */

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Your bag is empty.")
    .max(30),
  customerName: z.string().trim().min(3, "Please enter your full name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?20|0)?1[0125]\d{8}$/, "Enter a valid Egyptian mobile number, e.g. 010 1234 5678."),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || EMAIL_RE.test(v), "Enter a valid email address."),
  governorate: z.string().refine((v) => GOVERNORATE_VALUES.includes(v), "Please choose your governorate."),
  city: z.string().trim().min(2, "Enter your city or area.").max(80),
  address: z.string().trim().min(5, "Enter your street address.").max(200),
  apartment: z.string().trim().max(100),
  landmark: z.string().trim().max(150),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["cod", "card_on_delivery", "instapay"]),
  promoCode: z.string().trim().max(30),
  giftWrap: z.boolean(),
  giftMessage: z.string().trim().max(300, "Gift message is too long."),
  notes: z.string().trim().max(500, "Notes are too long."),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

class CheckoutError extends Error {}

function generateOrderNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[randomInt(alphabet.length)];
  return `R7-${code}`;
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const normalised = {
    ...input,
    phone: String(input.phone ?? "").replace(/[\s()-]/g, ""),
  };
  const parsed = checkoutSchema.safeParse(normalised);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }
  const data = parsed.data;

  // Merge duplicate lines for the same variant.
  const quantities = new Map<number, number>();
  for (const item of data.items) {
    quantities.set(item.variantId, (quantities.get(item.variantId) ?? 0) + item.quantity);
  }
  const variantIds = [...quantities.keys()];

  await ensureDatabase();

  try {
    const orderNumber = await db.transaction(async (tx) => {
      const rows = await tx
        .select({
          variantId: productVariants.id,
          size: productVariants.size,
          price: productVariants.price,
          stock: productVariants.stock,
          productId: products.id,
          name: products.name,
          slug: products.slug,
          images: products.images,
        })
        .from(productVariants)
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(inArray(productVariants.id, variantIds));

      if (rows.length !== variantIds.length) {
        throw new CheckoutError("Some items in your bag are no longer available. Please review your bag.");
      }

      for (const row of rows) {
        const qty = quantities.get(row.variantId) ?? 0;
        if (row.stock < qty) {
          throw new CheckoutError(
            row.stock === 0
              ? `${row.name} (${row.size}) has just sold out. Please remove it from your bag.`
              : `Only ${row.stock} left of ${row.name} (${row.size}). Please lower the quantity.`,
          );
        }
      }

      const subtotal = rows.reduce((sum, row) => sum + row.price * (quantities.get(row.variantId) ?? 0), 0);
      const totals = computeTotals({
        subtotal,
        shippingMethod: data.shippingMethod,
        governorate: data.governorate,
        promoCode: data.promoCode || null,
        giftWrap: data.giftWrap,
      });

      if (!totals.shippingAvailable) {
        throw new CheckoutError("Express delivery is only available in Cairo & Giza.");
      }
      if (totals.promo && !totals.promo.ok) {
        throw new CheckoutError(`Promo code ${totals.promo.code}: ${totals.promo.error}`);
      }

      const number = generateOrderNumber();
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: number,
          status: data.paymentMethod === "instapay" ? "awaiting_payment" : "confirmed",
          customerName: data.customerName,
          phone: data.phone,
          email: data.email || null,
          governorate: data.governorate,
          city: data.city,
          address: data.address,
          apartment: data.apartment || null,
          landmark: data.landmark || null,
          shippingMethod: data.shippingMethod,
          paymentMethod: data.paymentMethod,
          subtotal: totals.subtotal,
          shippingFee: totals.shipping,
          discount: totals.discount,
          giftWrapFee: totals.giftWrapFee,
          total: totals.total,
          promoCode: totals.promo && totals.promo.ok ? totals.promo.code : null,
          giftMessage: data.giftWrap && data.giftMessage ? data.giftMessage : null,
          notes: data.notes || null,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        rows.map((row) => {
          const qty = quantities.get(row.variantId) ?? 0;
          return {
            orderId: order.id,
            productId: row.productId,
            variantId: row.variantId,
            productName: row.name,
            productSlug: row.slug,
            size: row.size,
            image: row.images[0] ?? "",
            unitPrice: row.price,
            quantity: qty,
            lineTotal: row.price * qty,
          };
        }),
      );

      for (const row of rows) {
        const qty = quantities.get(row.variantId) ?? 0;
        const updated = await tx
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} - ${qty}` })
          .where(and(eq(productVariants.id, row.variantId), gte(productVariants.stock, qty)))
          .returning({ id: productVariants.id });
        if (updated.length === 0) {
          throw new CheckoutError(`${row.name} (${row.size}) just sold out. Please update your bag.`);
        }
        await tx
          .update(products)
          .set({ salesCount: sql`${products.salesCount} + ${qty}` })
          .where(eq(products.id, row.productId));
      }

      return number;
    });

    revalidatePath("/shop");
    return { ok: true, orderNumber };
  } catch (error) {
    if (error instanceof CheckoutError) return { ok: false, error: error.message };
    console.error("placeOrder failed", error);
    return { ok: false, error: "We couldn't place your order right now. Please try again in a moment." };
  }
}
