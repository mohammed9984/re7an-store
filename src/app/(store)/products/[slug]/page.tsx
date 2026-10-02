import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ReviewsPanel } from "@/components/product/ReviewsPanel";
import { SectionHeading, Stars } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { familyLabel, genderLabel } from "@/lib/constants";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/queries";
import { cn, deliveryWindow, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Perfume not found" };
  return {
    title: `${product.name} · ${product.concentration}`,
    description: `${product.tagline} ${product.description}`.slice(0, 160),
    openGraph: {
      title: `${product.name} — Re7an Perfumes`,
      description: product.tagline,
      images: [{ url: product.images[0] }],
    },
  };
}

const LONGEVITY = ["Light", "Moderate", "Long-lasting", "Very long-lasting", "Exceptional"];
const SILLAGE = ["Intimate", "Soft", "Moderate", "Strong", "Room-filling"];

function howToWear(concentration: string) {
  switch (concentration) {
    case "Perfume Oil":
      return "Dab a single drop on pulse points — wrists, neck and behind the ears. Don't rub; let the oil warm and bloom on skin. Layer it under any Re7an spray for extra depth and longevity.";
    case "Body Mist":
      return "Mist generously over skin and hair after a shower or before school. It's light and alcohol-free, so reapply through the day whenever you want a refresh.";
    case "Gift Set":
      return "Try one scent per day on skin rather than paper, and notice how it evolves over a few hours. Found your favourite? Treat yourself to the full size.";
    default:
      return "Spray 2–4 times on pulse points — neck, wrists and inner elbows — from about 15 cm away. Avoid rubbing your wrists together. For a longer-lasting trail, mist once over clothing or hair.";
  }
}

function Meter({ label, value, scale }: { label: string; value: number; scale: string[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="eyebrow text-smoke">{label}</span>
        <span className="text-sm">{scale[Math.max(0, Math.min(4, value - 1))]}</span>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={cn("h-1.5 rounded-full", i < value ? "bg-basil" : "bg-ink/10")} />
        ))}
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [{ list, distribution }, related] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product, 4),
  ]);

  const isSet = product.concentration === "Gift Set";
  const reviews = list.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    city: r.city,
    rating: r.rating,
    title: r.title,
    body: r.body,
    isVerified: r.isVerified,
    dateLabel: formatDate(r.createdAt),
    timestamp: new Date(r.createdAt).getTime(),
  }));
  const delivery = { greaterCairo: deliveryWindow(1, 2), elsewhere: deliveryWindow(2, 4) };
  const tiers = [
    { label: isSet ? "Featuring" : "Top notes", hint: isSet ? "" : "First impression · 0–30 min", notes: product.topNotes },
    { label: isSet ? "Also inside" : "Heart notes", hint: isSet ? "" : "The character · 30 min–4 h", notes: product.heartNotes },
    { label: isSet ? "Plus" : "Base notes", hint: isSet ? "" : "The lasting trail · 4 h+", notes: product.baseNotes },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Re7an" },
    category: product.concentration,
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingAvg.toFixed(1),
            reviewCount: product.reviewCount,
          },
        }
      : {}),
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: v.size,
      sku: v.sku,
      price: v.price,
      priceCurrency: "EGP",
      availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="shell pb-16 pt-6 md:pt-10">
        <nav aria-label="Breadcrumb" className="text-[0.7rem] tracking-[0.2em] uppercase text-smoke">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?collection=${product.collection.slug}`} className="hover:text-ink">
            {product.collection.name}
          </Link>
          <span className="mx-2 hidden sm:inline">/</span>
          <span className="hidden text-ink sm:inline">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-16 xl:gap-20">
          <ProductGallery images={product.images} name={product.name} />

          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/shop?collection=${product.collection.slug}`}
                className="eyebrow text-gold transition-colors hover:text-basil"
              >
                {product.collection.name}
              </Link>
              {product.isNew && (
                <span className="rounded-full bg-basil px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ivory">
                  New
                </span>
              )}
              {product.isBestseller && (
                <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-gold">
                  Bestseller
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-5xl font-light leading-[0.95] md:text-6xl">{product.name}</h1>
            <p className="mt-2 font-arabic text-2xl text-basil-light" lang="ar" dir="rtl">
              {product.arabicName}
            </p>

            {product.reviewCount > 0 && (
              <a href="#reviews" className="group mt-4 inline-flex items-center gap-2">
                <Stars rating={product.ratingAvg} size={15} />
                <span className="text-sm text-smoke group-hover:text-ink">
                  {product.ratingAvg.toFixed(1)} · {product.reviewCount} reviews
                </span>
              </a>
            )}

            <p className="mt-6 font-display text-2xl leading-snug text-ink/80 italic">{product.tagline}</p>

            <ul className="mt-5 flex flex-wrap gap-2 text-xs">
              {[product.concentration, isSet ? "Curated set" : familyLabel(product.family), genderLabel(product.gender), product.ageGroup].map(
                (chip) => (
                  <li key={chip} className="rounded-full border border-ink/15 px-3 py-1.5 text-ink/75">
                    {chip}
                  </li>
                ),
              )}
            </ul>

            <PurchasePanel
              product={{ id: product.id, slug: product.slug, name: product.name, image: product.images[0] }}
              variants={product.variants.map((v) => ({
                id: v.id,
                size: v.size,
                sizeMl: v.sizeMl,
                price: v.price,
                compareAtPrice: v.compareAtPrice,
                stock: v.stock,
              }))}
              delivery={delivery}
            />

            <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {[
                { title: "The scent", body: <p>{product.description}</p>, open: true },
                {
                  title: isSet ? "What's inside" : "Fragrance notes",
                  body: (
                    <dl className="space-y-3">
                      {tiers.map((t) => (
                        <div key={t.label} className="grid grid-cols-[7.5rem_1fr] gap-3">
                          <dt className="text-ink">{t.label}</dt>
                          <dd>{t.notes.join(" · ")}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                  open: false,
                },
                { title: "How to wear", body: <p>{howToWear(product.concentration)}</p>, open: false },
                {
                  title: "Delivery & returns",
                  body: (
                    <ul className="list-disc space-y-1.5 pl-4">
                      <li>Free delivery on orders over EGP 1,500 — otherwise EGP 65 (Cairo & Giza) or EGP 85.</li>
                      <li>Express next-day delivery in Cairo & Giza for EGP 120.</li>
                      <li>Pay cash or card on delivery, or via InstaPay / Vodafone Cash.</li>
                      <li>Unopened items can be returned within 14 days; one free scent exchange within 7 days.</li>
                    </ul>
                  ),
                  open: false,
                },
              ].map((section) => (
                <details key={section.title} open={section.open} className="group">
                  <summary className="flex items-center justify-between py-5 text-[0.74rem] font-medium tracking-[0.2em] uppercase">
                    {section.title}
                    <ChevronDown className="h-4 w-4 text-smoke transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 text-[0.95rem] leading-relaxed text-smoke">{section.body}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scent profile */}
      <section className="bg-cream">
        <div className="shell grid gap-14 py-20 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow text-gold">{isSet ? "The collection" : "Scent pyramid"}</p>
            <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">
              {isSet ? "Inside the box" : "How it unfolds on skin"}
            </h2>
            <ol className="mt-10 space-y-4">
              {tiers.map((tier, i) => (
                <li
                  key={tier.label}
                  className="rounded-[4px] border border-ink/10 bg-ivory p-5 md:p-6"
                  style={{ marginInline: `${(2 - i) * 4}%` }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-2xl">{tier.label}</p>
                    {tier.hint && <p className="text-xs tracking-wide text-smoke">{tier.hint}</p>}
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tier.notes.map((note) => (
                      <li key={note} className="rounded-full bg-cream px-3.5 py-1.5 text-sm">
                        {note}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-center">
            <div className="space-y-8">
              <Meter label="Longevity" value={product.longevity} scale={LONGEVITY} />
              <Meter label="Sillage" value={product.sillage} scale={SILLAGE} />
              <div>
                <p className="eyebrow text-smoke">Best seasons</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.seasons.map((s) => (
                    <li key={s} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-smoke">Perfect for</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.occasions.map((o) => (
                    <li key={o} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <blockquote className="mt-12 border-l-2 border-gold pl-5 font-display text-xl leading-relaxed text-ink/80 italic">
              {product.story}
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="shell scroll-mt-32 py-20 md:py-24">
        <SectionHeading eyebrow="Reviews" title="What our customers say" align="left" className="mb-12" />
        <ReviewsPanel
          productId={product.id}
          slug={product.slug}
          productName={product.name}
          reviews={reviews}
          distribution={distribution}
          average={product.ratingAvg}
        />
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-ivory">
          <div className="shell py-20 md:py-24">
            <SectionHeading eyebrow="You may also love" title="Complete your collection" arabic="ممكن يعجبك كمان" />
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
