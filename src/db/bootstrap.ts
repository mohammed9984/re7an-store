import { sql } from "drizzle-orm";
import { db, pool } from "@/db";
import { collections, productVariants, products, reviews } from "@/db/schema";
import { SEED_COLLECTIONS, SEED_PRODUCTS, buildReviews } from "@/db/seed-data";

/**
 * Idempotent DDL mirroring src/db/schema.ts (same constraint names drizzle-kit generates),
 * so a fresh database works out of the box and `drizzle-kit push` reports no drift.
 */
const DDL = `
CREATE TABLE IF NOT EXISTS "collections" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "arabic_name" text NOT NULL,
  "tagline" text NOT NULL,
  "description" text NOT NULL,
  "image" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
CREATE TABLE IF NOT EXISTS "products" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "arabic_name" text NOT NULL,
  "collection_id" integer NOT NULL,
  "gender" text NOT NULL,
  "family" text NOT NULL,
  "concentration" text NOT NULL,
  "age_group" text NOT NULL,
  "tagline" text NOT NULL,
  "description" text NOT NULL,
  "story" text NOT NULL,
  "top_notes" jsonb NOT NULL,
  "heart_notes" jsonb NOT NULL,
  "base_notes" jsonb NOT NULL,
  "images" jsonb NOT NULL,
  "seasons" jsonb NOT NULL,
  "occasions" jsonb NOT NULL,
  "price" integer NOT NULL,
  "compare_at_price" integer,
  "longevity" integer NOT NULL,
  "sillage" integer NOT NULL,
  "is_featured" boolean DEFAULT false NOT NULL,
  "is_bestseller" boolean DEFAULT false NOT NULL,
  "is_new" boolean DEFAULT false NOT NULL,
  "sales_count" integer DEFAULT 0 NOT NULL,
  "rating_avg" real DEFAULT 0 NOT NULL,
  "review_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "products_slug_unique" UNIQUE("slug"),
  CONSTRAINT "products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action
);
CREATE TABLE IF NOT EXISTS "product_variants" (
  "id" serial PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL,
  "size" text NOT NULL,
  "size_ml" integer NOT NULL,
  "price" integer NOT NULL,
  "compare_at_price" integer,
  "sku" text NOT NULL,
  "stock" integer DEFAULT 0 NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "product_variants_sku_unique" UNIQUE("sku"),
  CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action
);
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL,
  "author_name" text NOT NULL,
  "city" text,
  "rating" integer NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "is_verified" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action
);
CREATE TABLE IF NOT EXISTS "orders" (
  "id" serial PRIMARY KEY NOT NULL,
  "order_number" text NOT NULL,
  "status" text DEFAULT 'confirmed' NOT NULL,
  "customer_name" text NOT NULL,
  "phone" text NOT NULL,
  "email" text,
  "governorate" text NOT NULL,
  "city" text NOT NULL,
  "address" text NOT NULL,
  "apartment" text,
  "landmark" text,
  "shipping_method" text NOT NULL,
  "payment_method" text NOT NULL,
  "subtotal" integer NOT NULL,
  "shipping_fee" integer NOT NULL,
  "discount" integer DEFAULT 0 NOT NULL,
  "gift_wrap_fee" integer DEFAULT 0 NOT NULL,
  "total" integer NOT NULL,
  "promo_code" text,
  "gift_message" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "order_id" integer NOT NULL,
  "product_id" integer,
  "variant_id" integer,
  "product_name" text NOT NULL,
  "product_slug" text NOT NULL,
  "size" text NOT NULL,
  "image" text NOT NULL,
  "unit_price" integer NOT NULL,
  "quantity" integer NOT NULL,
  "line_total" integer NOT NULL,
  CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action
);
CREATE TABLE IF NOT EXISTS "subscribers" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
CREATE INDEX IF NOT EXISTS "products_collection_idx" ON "products" USING btree ("collection_id");
CREATE INDEX IF NOT EXISTS "products_family_idx" ON "products" USING btree ("family");
CREATE INDEX IF NOT EXISTS "variants_product_idx" ON "product_variants" USING btree ("product_id");
CREATE INDEX IF NOT EXISTS "reviews_product_idx" ON "reviews" USING btree ("product_id");
CREATE INDEX IF NOT EXISTS "order_items_order_idx" ON "order_items" USING btree ("order_id");
`;

const globalForBootstrap = globalThis as typeof globalThis & {
  __re7anDbReady?: Promise<void> | null;
};

export function ensureDatabase(): Promise<void> {
  if (!globalForBootstrap.__re7anDbReady) {
    globalForBootstrap.__re7anDbReady = setup().catch((error) => {
      globalForBootstrap.__re7anDbReady = null;
      throw error;
    });
  }
  return globalForBootstrap.__re7anDbReady;
}

async function setup() {
  await pool.query(DDL);
  const { rows } = await pool.query<{ count: number }>("select count(*)::int as count from products");
  if ((rows[0]?.count ?? 0) > 0) return;
  await seed();
}

async function seed() {
  await db.transaction(async (tx) => {
    // Serialise concurrent seeders (multiple workers booting at once).
    await tx.execute(sql`select pg_advisory_xact_lock(727274)`);
    const existing = await tx.execute<{ count: number }>(sql`select count(*)::int as count from products`);
    if (Number(existing.rows[0]?.count ?? 0) > 0) return;

    const insertedCollections = await tx
      .insert(collections)
      .values(SEED_COLLECTIONS)
      .returning({ id: collections.id, slug: collections.slug });
    const collectionIds = new Map(insertedCollections.map((c) => [c.slug, c.id]));

    const now = Date.now();
    for (const [index, p] of SEED_PRODUCTS.entries()) {
      const cheapest = p.variants.reduce((a, b) => (a.price <= b.price ? a : b));
      const createdAt = new Date(now - p.daysAgo * 86_400_000);
      const collectionId = collectionIds.get(p.collection);
      if (!collectionId) throw new Error(`Unknown collection ${p.collection}`);

      const [row] = await tx
        .insert(products)
        .values({
          slug: p.slug,
          name: p.name,
          arabicName: p.arabicName,
          collectionId,
          gender: p.gender,
          family: p.family,
          concentration: p.concentration,
          ageGroup: p.ageGroup,
          tagline: p.tagline,
          description: p.description,
          story: p.story,
          topNotes: p.top,
          heartNotes: p.heart,
          baseNotes: p.base,
          images: p.images,
          seasons: p.seasons,
          occasions: p.occasions,
          price: cheapest.price,
          compareAtPrice: cheapest.compareAt ?? null,
          longevity: p.longevity,
          sillage: p.sillage,
          isFeatured: Boolean(p.featured),
          isBestseller: Boolean(p.bestseller),
          isNew: Boolean(p.isNew),
          salesCount: p.sales,
          createdAt,
        })
        .returning({ id: products.id });

      await tx.insert(productVariants).values(
        p.variants.map((v, i) => ({
          productId: row.id,
          size: v.size,
          sizeMl: v.ml,
          price: v.price,
          compareAtPrice: v.compareAt ?? null,
          sku: `RE7-${p.slug.toUpperCase()}-${v.ml}`,
          stock: v.stock,
          sortOrder: i,
        })),
      );

      const productReviews = buildReviews(p, index, createdAt, now);
      if (productReviews.length) {
        await tx.insert(reviews).values(productReviews.map((r) => ({ ...r, productId: row.id })));
      }
    }

    await tx.execute(sql`
      update products p
      set rating_avg = s.avg, review_count = s.cnt
      from (
        select product_id, avg(rating)::real as avg, count(*)::int as cnt
        from reviews group by product_id
      ) s
      where p.id = s.product_id
    `);
  });
}
