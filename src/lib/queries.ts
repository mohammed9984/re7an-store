import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  ne,
  notInArray,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/db";
import { ensureDatabase } from "@/db/bootstrap";
import { collections, orderItems, orders, products, productVariants, reviews } from "@/db/schema";
import { CONCENTRATIONS, FAMILIES, GENDERS, SORT_OPTIONS, type SortValue } from "@/lib/constants";

export type VariantSummary = {
  id: number;
  size: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
};

const cardColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  arabicName: products.arabicName,
  family: products.family,
  concentration: products.concentration,
  gender: products.gender,
  images: products.images,
  price: products.price,
  compareAtPrice: products.compareAtPrice,
  ratingAvg: products.ratingAvg,
  reviewCount: products.reviewCount,
  isNew: products.isNew,
  isBestseller: products.isBestseller,
  collectionName: collections.name,
  collectionSlug: collections.slug,
};

async function attachVariants<T extends { id: number }>(rows: T[]) {
  if (rows.length === 0) return [] as Array<T & { variants: VariantSummary[] }>;
  const variants = await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      size: productVariants.size,
      price: productVariants.price,
      compareAtPrice: productVariants.compareAtPrice,
      stock: productVariants.stock,
    })
    .from(productVariants)
    .where(
      inArray(
        productVariants.productId,
        rows.map((r) => r.id),
      ),
    )
    .orderBy(asc(productVariants.sortOrder));

  const byProduct = new Map<number, VariantSummary[]>();
  for (const { productId, ...variant } of variants) {
    const list = byProduct.get(productId) ?? [];
    list.push(variant);
    byProduct.set(productId, list);
  }
  return rows.map((r) => ({ ...r, variants: byProduct.get(r.id) ?? [] }));
}

async function selectCards(where: SQL | undefined, orderBy: SQL[], limit = 100) {
  await ensureDatabase();
  const rows = await db
    .select(cardColumns)
    .from(products)
    .innerJoin(collections, eq(products.collectionId, collections.id))
    .where(where)
    .orderBy(...orderBy)
    .limit(limit);
  return attachVariants(rows);
}

export type ProductCardData = Awaited<ReturnType<typeof selectCards>>[number];

/* ------------------------------ Shop ------------------------------ */

type RawSearchParams = Record<string, string | string[] | undefined>;

export type ShopFilters = {
  collection?: string;
  genders: string[];
  families: string[];
  concentrations: string[];
  min?: number;
  max?: number;
  sale: boolean;
  isNew: boolean;
  q?: string;
  sort: SortValue;
};

const firstValue = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const listValue = (v: string | string[] | undefined) =>
  firstValue(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const positiveInt = (v: string | string[] | undefined) => {
  const n = Number(firstValue(v));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
};

export function parseShopFilters(sp: RawSearchParams): ShopFilters {
  const sortRaw = firstValue(sp.sort);
  const sort = (SORT_OPTIONS.some((o) => o.value === sortRaw) ? sortRaw : "featured") as SortValue;
  return {
    collection: firstValue(sp.collection) || undefined,
    genders: listValue(sp.gender).filter((g) => GENDERS.some((x) => x.value === g)),
    families: listValue(sp.family).filter((f) => FAMILIES.some((x) => x.value === f)),
    concentrations: listValue(sp.concentration).filter((c) =>
      (CONCENTRATIONS as readonly string[]).includes(c),
    ),
    min: positiveInt(sp.min),
    max: positiveInt(sp.max),
    sale: firstValue(sp.sale) === "1",
    isNew: firstValue(sp.new) === "1",
    q: firstValue(sp.q).trim().slice(0, 60) || undefined,
    sort,
  };
}

function orderFor(sort: SortValue): SQL[] {
  switch (sort) {
    case "price-asc":
      return [asc(products.price), asc(products.id)];
    case "price-desc":
      return [desc(products.price), asc(products.id)];
    case "rating":
      return [desc(products.ratingAvg), desc(products.reviewCount)];
    case "newest":
      return [desc(products.createdAt)];
    case "bestselling":
      return [desc(products.salesCount)];
    default:
      return [desc(products.isFeatured), desc(products.salesCount)];
  }
}

export async function getShopProducts(filters: ShopFilters) {
  const conditions: SQL[] = [];
  if (filters.collection) conditions.push(eq(collections.slug, filters.collection));
  if (filters.genders.length) conditions.push(inArray(products.gender, filters.genders));
  if (filters.families.length) conditions.push(inArray(products.family, filters.families));
  if (filters.concentrations.length) conditions.push(inArray(products.concentration, filters.concentrations));
  if (filters.min !== undefined) conditions.push(gte(products.price, filters.min));
  if (filters.max !== undefined) conditions.push(lte(products.price, filters.max));
  if (filters.sale) conditions.push(isNotNull(products.compareAtPrice));
  if (filters.isNew) conditions.push(eq(products.isNew, true));
  if (filters.q) {
    const term = `%${filters.q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
    const search = or(
      ilike(products.name, term),
      ilike(products.arabicName, term),
      ilike(products.family, term),
      ilike(products.tagline, term),
      ilike(products.concentration, term),
      ilike(collections.name, term),
      sql`${products.topNotes}::text ilike ${term}`,
      sql`${products.heartNotes}::text ilike ${term}`,
      sql`${products.baseNotes}::text ilike ${term}`,
    );
    if (search) conditions.push(search);
  }
  return selectCards(conditions.length ? and(...conditions) : undefined, orderFor(filters.sort));
}

export type ShopFacets = {
  total: number;
  collections: Record<string, number>;
  genders: Record<string, number>;
  families: Record<string, number>;
  concentrations: Record<string, number>;
  sale: number;
  isNew: number;
};

export async function getShopFacets(): Promise<ShopFacets> {
  await ensureDatabase();
  const rows = await db
    .select({
      collectionSlug: collections.slug,
      gender: products.gender,
      family: products.family,
      concentration: products.concentration,
      onSale: sql<boolean>`${products.compareAtPrice} is not null`,
      isNew: products.isNew,
    })
    .from(products)
    .innerJoin(collections, eq(products.collectionId, collections.id));

  const tally = (key: "collectionSlug" | "gender" | "family" | "concentration") =>
    rows.reduce<Record<string, number>>((acc, r) => {
      acc[r[key]] = (acc[r[key]] ?? 0) + 1;
      return acc;
    }, {});

  return {
    total: rows.length,
    collections: tally("collectionSlug"),
    genders: tally("gender"),
    families: tally("family"),
    concentrations: tally("concentration"),
    sale: rows.filter((r) => r.onSale).length,
    isNew: rows.filter((r) => r.isNew).length,
  };
}

/* --------------------------- Collections --------------------------- */

export async function getCollections() {
  await ensureDatabase();
  const rows = await db
    .select({
      id: collections.id,
      slug: collections.slug,
      name: collections.name,
      arabicName: collections.arabicName,
      tagline: collections.tagline,
      description: collections.description,
      image: collections.image,
      productCount: sql<number>`(select count(*)::int from ${products} where ${products.collectionId} = ${collections.id})`,
    })
    .from(collections)
    .orderBy(asc(collections.sortOrder));
  return rows;
}

export type CollectionSummary = Awaited<ReturnType<typeof getCollections>>[number];

/* ------------------------------ Home ------------------------------ */

export function getBestsellers(limit = 8) {
  return selectCards(eq(products.isBestseller, true), [desc(products.salesCount)], limit);
}

export function getNewArrivals(limit = 8) {
  return selectCards(undefined, [desc(products.createdAt)], limit);
}

export async function getTestimonials(limit = 6) {
  await ensureDatabase();
  const rows = await db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      city: reviews.city,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      productId: reviews.productId,
      productName: products.name,
      productSlug: products.slug,
      productImage: sql<string>`${products.images}->>0`,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .where(and(eq(reviews.rating, 5), eq(reviews.isVerified, true), sql`length(${reviews.body}) > 95`))
    .orderBy(desc(products.salesCount), desc(reviews.createdAt))
    .limit(80);

  const seen = new Set<number>();
  const picked: typeof rows = [];
  for (const row of rows) {
    if (seen.has(row.productId)) continue;
    seen.add(row.productId);
    picked.push(row);
    if (picked.length >= limit) break;
  }
  return picked;
}

export async function getStoreStats() {
  await ensureDatabase();
  const [stats] = await db
    .select({
      reviewCount: sql<number>`count(*)::int`,
      averageRating: sql<number>`coalesce(round(avg(${reviews.rating})::numeric, 1), 0)::float`,
    })
    .from(reviews);
  return stats ?? { reviewCount: 0, averageRating: 0 };
}

/* ------------------------- Product detail ------------------------- */

export async function getProductBySlug(slug: string) {
  await ensureDatabase();
  const [row] = await db
    .select({ product: products, collection: collections })
    .from(products)
    .innerJoin(collections, eq(products.collectionId, collections.id))
    .where(eq(products.slug, slug))
    .limit(1);
  if (!row) return null;
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, row.product.id))
    .orderBy(asc(productVariants.sortOrder));
  return { ...row.product, collection: row.collection, variants };
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

export async function getProductReviews(productId: number) {
  const list = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))
    .limit(200);
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => r.rating === star).length,
  }));
  return { list, distribution };
}

export async function getRelatedProducts(product: ProductDetail, limit = 4) {
  const related = await selectCards(
    and(
      ne(products.id, product.id),
      or(eq(products.family, product.family), eq(products.collectionId, product.collectionId)),
    ),
    [desc(products.salesCount)],
    limit,
  );
  if (related.length >= limit) return related;
  const exclude = [product.id, ...related.map((r) => r.id)];
  const filler = await selectCards(notInArray(products.id, exclude), [desc(products.salesCount)], limit - related.length);
  return [...related, ...filler];
}

export async function getAllProductSlugs() {
  await ensureDatabase();
  return db.select({ slug: products.slug, createdAt: products.createdAt }).from(products);
}

/* ----------------------------- Search ----------------------------- */

export async function searchProducts(query: string, limit = 6) {
  const filters = parseShopFilters({ q: query, sort: "bestselling" });
  if (!filters.q) return [];
  const results = await getShopProducts(filters);
  return results.slice(0, limit);
}

/* ------------------------------ Orders ----------------------------- */

export async function getOrderByNumber(orderNumber: string) {
  await ensureDatabase();
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).orderBy(asc(orderItems.id));
  return { ...order, items };
}
