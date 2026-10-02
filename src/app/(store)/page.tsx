import {
  CollectionsGrid,
  Faq,
  GiftBanner,
  Hero,
  Marquee,
  Newsletter,
  ProductRail,
  ProductShowcase,
  ScentFamilies,
  SignatureSpotlight,
  StorySection,
  Testimonials,
} from "@/components/home/HomeSections";
import {
  getBestsellers,
  getCollections,
  getNewArrivals,
  getProductBySlug,
  getShopFacets,
  getStoreStats,
  getTestimonials,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [collections, bestsellers, newArrivals, testimonials, stats, signature, facets] = await Promise.all([
    getCollections(),
    getBestsellers(8),
    getNewArrivals(8),
    getTestimonials(6),
    getStoreStats(),
    getProductBySlug("re7an-signature"),
    getShopFacets(),
  ]);

  return (
    <>
      <Hero rating={stats.averageRating} reviewCount={stats.reviewCount} />
      <Marquee />
      <CollectionsGrid collections={collections} />
      <ProductShowcase
        eyebrow="Most loved"
        title="Our bestsellers"
        arabic="الأكثر مبيعًا"
        products={bestsellers}
        cta={{ href: "/shop?sort=bestselling", label: "Shop bestsellers" }}
      />
      {signature && <SignatureSpotlight product={signature} />}
      <ScentFamilies counts={facets.families} />
      <StorySection rating={stats.averageRating} />
      <ProductRail
        eyebrow="Just landed"
        title="New arrivals"
        arabic="وصل حديثًا"
        products={newArrivals}
        cta={{ href: "/shop?sort=newest", label: "View all new" }}
      />
      <GiftBanner />
      <Testimonials reviews={testimonials} rating={stats.averageRating} reviewCount={stats.reviewCount} />
      <Faq />
      <Newsletter />
    </>
  );
}
