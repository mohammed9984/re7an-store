import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  arabicName: text("arabic_name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    arabicName: text("arabic_name").notNull(),
    collectionId: integer("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    gender: text("gender").notNull(),
    family: text("family").notNull(),
    concentration: text("concentration").notNull(),
    ageGroup: text("age_group").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    story: text("story").notNull(),
    topNotes: jsonb("top_notes").$type<string[]>().notNull(),
    heartNotes: jsonb("heart_notes").$type<string[]>().notNull(),
    baseNotes: jsonb("base_notes").$type<string[]>().notNull(),
    images: jsonb("images").$type<string[]>().notNull(),
    seasons: jsonb("seasons").$type<string[]>().notNull(),
    occasions: jsonb("occasions").$type<string[]>().notNull(),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    longevity: integer("longevity").notNull(),
    sillage: integer("sillage").notNull(),
    isFeatured: boolean("is_featured").notNull().default(false),
    isBestseller: boolean("is_bestseller").notNull().default(false),
    isNew: boolean("is_new").notNull().default(false),
    salesCount: integer("sales_count").notNull().default(0),
    ratingAvg: real("rating_avg").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("products_collection_idx").on(t.collectionId),
    index("products_family_idx").on(t.family),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    sizeMl: integer("size_ml").notNull(),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    sku: text("sku").notNull().unique(),
    stock: integer("stock").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("variants_product_idx").on(t.productId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    city: text("city"),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reviews_product_idx").on(t.productId)],
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("confirmed"),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  governorate: text("governorate").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  apartment: text("apartment"),
  landmark: text("landmark"),
  shippingMethod: text("shipping_method").notNull(),
  paymentMethod: text("payment_method").notNull(),
  subtotal: integer("subtotal").notNull(),
  shippingFee: integer("shipping_fee").notNull(),
  discount: integer("discount").notNull().default(0),
  giftWrapFee: integer("gift_wrap_fee").notNull().default(0),
  total: integer("total").notNull(),
  promoCode: text("promo_code"),
  giftMessage: text("gift_message"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    variantId: integer("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    productSlug: text("product_slug").notNull(),
    size: text("size").notNull(),
    image: text("image").notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Collection = typeof collections.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
