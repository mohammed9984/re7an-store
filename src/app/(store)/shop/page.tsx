import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ActiveFilters,
  FilterPanel,
  MobileFilters,
  ShopProvider,
  ShopResults,
  SortSelect,
} from "@/components/shop/ShopControls";
import { getCollections, getShopFacets, getShopProducts, parseShopFilters } from "@/lib/queries";

export const dynamic = "force-dynamic";

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const filters = parseShopFilters(await searchParams);
  if (filters.q) return { title: `Search: ${filters.q}` };
  if (filters.collection) {
    const collection = (await getCollections()).find((c) => c.slug === filters.collection);
    if (collection) return { title: `${collection.name} perfumes`, description: collection.description };
  }
  return {
    title: "Shop all perfumes",
    description: "Browse Re7an's full collection of perfumes, oud, attars, kids' mists and gift sets — delivered across Egypt.",
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = parseShopFilters(await searchParams);
  const [products, facets, collections] = await Promise.all([
    getShopProducts(filters),
    getShopFacets(),
    getCollections(),
  ]);
  const collection = collections.find((c) => c.slug === filters.collection);
  const collectionOptions = collections.map((c) => ({ slug: c.slug, name: c.name }));

  const title = filters.q ? `Results for “${filters.q}”` : collection ? collection.name : "The Collection";
  const description = filters.q
    ? `${products.length} ${products.length === 1 ? "perfume matches" : "perfumes match"} your search.`
    : collection
      ? collection.description
      : "Every Re7an fragrance in one place — crafted in Cairo for women, men, teens and kids.";

  return (
    <ShopProvider filters={filters}>
      <section className="relative isolate overflow-hidden bg-basil-dark text-ivory">
        {collection && (
          <>
            <Image
              src={collection.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="animate-ken-burns object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-basil-dark via-basil-dark/70 to-basil-dark/10" />
          </>
        )}
        <div className="shell relative py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-[0.7rem] tracking-[0.2em] uppercase text-ivory/60">
            <Link href="/" className="hover:text-ivory">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-ivory">
              Shop
            </Link>
            {collection && (
              <>
                <span className="mx-2">/</span>
                <span className="text-ivory">{collection.name}</span>
              </>
            )}
          </nav>
          {collection && (
            <p className="mt-6 animate-fade-up font-arabic text-2xl text-gold-light" lang="ar" dir="rtl">
              {collection.arabicName}
            </p>
          )}
          <h1 className="mt-2 animate-fade-up font-display text-5xl font-light leading-none [animation-delay:120ms] md:text-7xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl animate-fade-up leading-relaxed text-ivory/75 [animation-delay:240ms]">
            {description}
          </p>
        </div>
      </section>

      <div className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-[250px_1fr] xl:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <FilterPanel facets={facets} collections={collectionOptions} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
            <div className="flex items-center gap-3">
              <MobileFilters facets={facets} collections={collectionOptions} total={products.length} />
              <p className="text-sm text-smoke">
                <span className="font-medium text-ink">{products.length}</span>{" "}
                {products.length === 1 ? "fragrance" : "fragrances"}
              </p>
            </div>
            <SortSelect />
          </div>
          <div className="py-4 empty:hidden">
            <ActiveFilters collections={collectionOptions} />
          </div>

          <ShopResults>
            {products.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
                {products.map((product, i) => (
                  <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 9) * 60}ms` }}>
                    <ProductCard product={product} priority={i < 3} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-24 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                  <SearchX className="h-8 w-8 text-gold" strokeWidth={1.2} />
                </span>
                <h2 className="mt-6 font-display text-3xl font-light">No perfumes match those filters</h2>
                <p className="mt-2 max-w-sm text-smoke">
                  Try removing a filter, or explore our bestsellers — there&apos;s a scent here for everyone.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/shop" className="btn btn-primary">
                    Clear filters
                  </Link>
                  <Link href="/shop?sort=bestselling" className="btn btn-outline">
                    Bestsellers
                  </Link>
                </div>
              </div>
            )}
          </ShopResults>
        </div>
      </div>
    </ShopProvider>
  );
}
