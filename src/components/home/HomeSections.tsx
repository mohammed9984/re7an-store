import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Citrus,
  Cookie,
  Crown,
  Feather,
  Flame,
  Flower2,
  Quote,
  Sun,
  Trees,
  Waves,
} from "lucide-react";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { ProductCard } from "@/components/product/ProductCard";
import { LeafMark, Price, SectionHeading, Stars } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { FAMILIES } from "@/lib/constants";
import type { CollectionSummary, ProductCardData, ProductDetail } from "@/lib/queries";
import { cn } from "@/lib/utils";

/* ------------------------------- Hero ------------------------------- */

export function Hero({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <section className="relative isolate h-[84svh] max-h-[880px] min-h-[600px] overflow-hidden bg-basil-dark text-ivory">
      <Image
        src="/images/hero.jpg"
        alt="A Re7an perfume bottle with fresh basil and jasmine on a sandstone ledge overlooking the Nile at dusk"
        fill
        priority
        sizes="100vw"
        className="animate-ken-burns object-cover object-[72%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 md:from-black/30" />

      <div className="shell relative flex h-full flex-col justify-end pb-14 md:justify-center md:pb-0">
        <div className="max-w-2xl">
          <p className="eyebrow animate-fade-up text-gold-light [animation-delay:150ms]">
            Maison de parfum · Cairo
          </p>
          <h1 className="mt-5 animate-fade-up font-display text-[3.1rem] font-light leading-[0.95] text-balance [animation-delay:300ms] sm:text-6xl md:text-[5.6rem]">
            Scents that tell <em className="font-normal text-gold-light italic">Egypt&rsquo;s</em> story
          </h1>
          <p
            className="mt-4 animate-fade-up font-arabic text-2xl text-ivory/85 [animation-delay:450ms] md:text-3xl"
            lang="ar"
            dir="rtl"
          >
            عطر يحكي حكايتك
          </p>
          <p className="mt-5 max-w-md animate-fade-up text-[1.02rem] leading-relaxed text-ivory/80 [animation-delay:600ms]">
            Long-lasting perfumes, oud and attars crafted in Cairo — for her, for him and for the little ones.
            Delivered to all 27 governorates.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:750ms]">
            <Link href="/shop" className="btn btn-light">
              Shop the collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/shop?collection=oud-oriental" className="btn btn-outline-light">
              Discover oud
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden animate-fade-in items-center gap-3 rounded-full border border-ivory/20 bg-black/25 px-5 py-2.5 backdrop-blur-md [animation-delay:1100ms] md:flex">
        <Stars rating={rating} size={13} />
        <span className="text-xs tracking-wide text-ivory/85">
          {rating.toFixed(1)} from {reviewCount}+ verified reviews
        </span>
      </div>
      <a
        href="#collections"
        aria-label="Scroll to collections"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 animate-bounce text-ivory/70 md:block"
      >
        <ChevronDown className="h-6 w-6" strokeWidth={1.2} />
      </a>
    </section>
  );
}

/* ------------------------------ Marquee ----------------------------- */

const MARQUEE_ITEMS = [
  "Crafted in Cairo",
  "Long-lasting concentrations",
  "Cash on delivery",
  "Free delivery over EGP 1,500",
  "14-day easy returns",
  "Alcohol-free mists for kids",
  "Delivered to 27 governorates",
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-b border-ink/10 bg-cream py-5" aria-label="Why Re7an">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {MARQUEE_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-10 pr-10 font-display text-xl text-ink/75 italic md:text-2xl">
                {item}
                <LeafMark className="h-4 w-4 text-gold" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Collections --------------------------- */

const BENTO: Record<string, string> = {
  women: "col-span-2 row-span-2 min-h-[420px] lg:min-h-0",
  men: "col-span-1 row-span-1",
  "oud-oriental": "col-span-1 row-span-2 lg:row-span-2",
  unisex: "col-span-1 row-span-1",
  "kids-teens": "col-span-2 lg:col-span-2",
  "gift-sets": "col-span-2 lg:col-span-2",
};

export function CollectionsGrid({ collections }: { collections: CollectionSummary[] }) {
  const order = ["women", "men", "oud-oriental", "unisex", "kids-teens", "gift-sets"];
  const sorted = [...collections].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  return (
    <section id="collections" className="shell scroll-mt-32 py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Featured collections"
          title="A fragrance for every generation"
          arabic="لكل جيل عطره"
          description="From a first teen perfume to a grandfather's oud — explore scents designed for every age, every mood and every occasion."
        />
      </Reveal>
      <div className="mt-14 grid auto-rows-[240px] grid-cols-2 gap-3 md:gap-4 lg:auto-rows-[300px] lg:grid-cols-4">
        {sorted.map((c, i) => (
          <Reveal key={c.slug} delay={i * 90} className={cn("relative", BENTO[c.slug])}>
            <Link
              href={`/shop?collection=${c.slug}`}
              className="group absolute inset-0 block overflow-hidden rounded-[3px] bg-basil-dark"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.21,1)] group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/80" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-ivory md:p-7">
                <p className="font-arabic text-lg text-gold-light" lang="ar" dir="rtl">
                  {c.arabicName}
                </p>
                <h3 className="font-display text-3xl font-light leading-none md:text-4xl">{c.name}</h3>
                <p className="mt-2 hidden text-sm text-ivory/75 sm:block">{c.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.22em] uppercase">
                  {c.productCount} scents
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- Product grid -------------------------- */

export function ProductShowcase({
  eyebrow,
  title,
  arabic,
  products,
  cta,
}: {
  eyebrow: string;
  title: string;
  arabic?: string;
  products: ProductCardData[];
  cta: { href: string; label: string };
}) {
  return (
    <section className="shell py-20 md:py-24">
      <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow={eyebrow} title={title} arabic={arabic} align="left" />
        <Link href={cta.href} className="btn btn-outline shrink-0">
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ProductRail({
  eyebrow,
  title,
  arabic,
  products,
  cta,
}: {
  eyebrow: string;
  title: string;
  arabic?: string;
  products: ProductCardData[];
  cta: { href: string; label: string };
}) {
  return (
    <section className="py-20 md:py-24">
      <Reveal className="shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow={eyebrow} title={title} arabic={arabic} align="left" />
        <Link href={cta.href} className="btn btn-outline shrink-0">
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 md:gap-6 md:px-8 xl:px-12">
        {products.map((p) => (
          <div key={p.id} className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[30%] lg:w-[23%]">
            <ProductCard product={p} />
          </div>
        ))}
        <Link
          href={cta.href}
          className="group flex w-[60%] shrink-0 snap-start flex-col items-center justify-center rounded-[3px] border border-dashed border-ink/20 text-center sm:w-[36%] md:w-[24%] lg:w-[18%]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-basil text-ivory transition-transform duration-500 group-hover:scale-110">
            <ArrowRight className="h-5 w-5" />
          </span>
          <span className="mt-4 font-display text-2xl">{cta.label}</span>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------ Signature spotlight ----------------------- */

export function SignatureSpotlight({ product }: { product: ProductDetail }) {
  const tiers = [
    { label: "Top", notes: product.topNotes },
    { label: "Heart", notes: product.heartNotes },
    { label: "Base", notes: product.baseNotes },
  ];
  return (
    <section className="bg-cream">
      <div className="shell grid items-center gap-12 py-20 md:grid-cols-2 md:py-28 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-3 hidden h-32 w-32 flex-col items-center justify-center rounded-full bg-basil text-center text-ivory shadow-xl ring-8 ring-cream md:flex lg:-right-8">
            <p className="font-display text-4xl leading-none">{product.ratingAvg.toFixed(1)}</p>
            <p className="mt-1 text-[0.6rem] tracking-[0.2em] uppercase text-ivory/75">{product.reviewCount} reviews</p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="eyebrow text-gold">The house signature</p>
          <h2 className="mt-3 font-display text-5xl font-light leading-none md:text-6xl">{product.name}</h2>
          <p className="mt-3 font-arabic text-2xl text-basil-light" lang="ar" dir="rtl">
            {product.arabicName}
          </p>
          <p className="mt-6 font-display text-2xl leading-snug text-ink/80 italic">“{product.tagline}”</p>
          <p className="mt-5 leading-relaxed text-smoke">{product.story}</p>
          <dl className="mt-8 grid grid-cols-3 divide-x divide-ink/10 border-y border-ink/10">
            {tiers.map((tier) => (
              <div key={tier.label} className="px-3 py-5 first:pl-0">
                <dt className="eyebrow text-gold">{tier.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed">{tier.notes.join(", ")}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href={`/products/${product.slug}`} className="btn btn-primary">
              Discover Signature <ArrowRight className="h-4 w-4" />
            </Link>
            <Price price={product.price} compareAt={product.compareAtPrice} from className="text-lg" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- Scent families ------------------------- */

const FAMILY_ICONS = {
  floral: Flower2,
  woody: Trees,
  oriental: Flame,
  oud: Crown,
  amber: Sun,
  fresh: Citrus,
  aquatic: Waves,
  gourmand: Cookie,
  musky: Feather,
} as const;

export function ScentFamilies({ counts }: { counts: Record<string, number> }) {
  return (
    <section id="families" className="shell scroll-mt-32 py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Find your scent"
          title="Shop by fragrance family"
          arabic="اختار عيلة عطرك"
          description="Not sure where to start? Choose the mood you love and we'll show you the scents that match."
        />
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {FAMILIES.map((family, i) => {
          const Icon = FAMILY_ICONS[family.value];
          return (
            <Reveal key={family.value} delay={i * 60}>
              <Link
                href={`/shop?family=${family.value}`}
                className="group flex h-full flex-col items-center rounded-[3px] border border-ink/10 bg-white/40 px-3 py-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-basil hover:bg-basil hover:text-ivory hover:shadow-[0_20px_40px_-24px_rgba(27,47,38,0.7)]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-basil transition-colors duration-500 group-hover:bg-ivory/15 group-hover:text-gold-light">
                  <Icon className="h-6 w-6" strokeWidth={1.3} />
                </span>
                <span className="mt-4 font-display text-xl">{family.label}</span>
                <span className="font-arabic text-sm text-gold group-hover:text-gold-light" lang="ar">
                  {family.arabic}
                </span>
                <span className="mt-2 text-[0.7rem] leading-snug text-smoke group-hover:text-ivory/70">
                  {counts[family.value] ?? 0} scents
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------- Story ------------------------------ */

export function StorySection({ rating }: { rating: number }) {
  const stats = [
    { value: rating.toFixed(1), label: "Average rating" },
    { value: "27", label: "Governorates served" },
    { value: "48h", label: "Typical Cairo delivery" },
    { value: "14", label: "Day easy returns" },
  ];
  return (
    <section id="story" className="scroll-mt-32 overflow-hidden bg-basil-dark text-ivory">
      <div className="shell grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative ml-auto aspect-[3/4] w-[82%] overflow-hidden rounded-[3px]">
            <Image
              src="/images/story.jpg"
              alt="Hands harvesting Egyptian jasmine at dawn"
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-[-8%] left-0 aspect-square w-[46%] overflow-hidden rounded-[3px] border-[6px] border-basil-dark shadow-2xl">
            <Image
              src="/images/stock/8450107.jpg"
              alt="A Re7an perfumer blending essences in the Cairo atelier"
              fill
              sizes="(min-width: 1024px) 20vw, 45vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <p className="eyebrow text-gold-light">Our story</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-[1.05] text-balance md:text-[3.4rem]">
            Born on a Cairo balcony, between basil &amp; jasmine
          </h2>
          <p className="mt-3 font-arabic text-2xl text-gold-light/90" lang="ar" dir="rtl">
            من بلكونة في القاهرة، بين الريحان والياسمين
          </p>
          <div className="mt-6 space-y-4 leading-relaxed text-ivory/75">
            <p>
              Re7an — the Egyptian word for basil — began with a simple belief: Egypt grows some of the most
              precious raw materials in perfumery, from the jasmine of Gharbia to Fayoum roses, so why should
              beautiful perfume feel out of reach?
            </p>
            <p>
              Today our small atelier in Zamalek blends every fragrance by hand, ages it in glass and fills each
              bottle at concentrations that last through an Egyptian summer — at honest prices, for every
              member of the family.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-ivory/15 pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-4xl text-gold-light">{s.value}</span>
                  <span className="mt-1 block text-[0.68rem] tracking-[0.16em] uppercase text-ivory/60">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- Gift banner --------------------------- */

export function GiftBanner() {
  return (
    <section className="shell py-10 md:py-16">
      <Reveal className="grid overflow-hidden rounded-[3px] bg-blush md:grid-cols-2">
        <div className="relative min-h-[340px] md:min-h-[520px]">
          <Image
            src="/images/collections/gifts.jpg"
            alt="A Re7an keepsake gift box with two perfumes and a satin ribbon"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
          <p className="eyebrow text-gold">The art of gifting</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-[1.05] md:text-5xl">
            Wrapped by hand, delivered with love
          </h2>
          <p className="mt-3 font-arabic text-2xl text-basil-light" lang="ar" dir="rtl">
            هدية تفرّح اللي بتحبهم
          </p>
          <p className="mt-5 leading-relaxed text-smoke">
            For Eid, weddings, birthdays or just because — choose a keepsake set or add luxury gift wrapping and
            a handwritten note to any order at checkout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop?collection=gift-sets" className="btn btn-primary">
              Shop gift sets <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products/discovery-set" className="btn btn-outline">
              Discovery set
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------- Testimonials -------------------------- */

type Testimonial = {
  id: number;
  authorName: string;
  city: string | null;
  rating: number;
  title: string;
  body: string;
  productName: string;
  productSlug: string;
  productImage: string;
};

export function Testimonials({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Testimonial[];
  rating: number;
  reviewCount: number;
}) {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow="Loved across Egypt" title="Words from our customers" arabic="آراء عملائنا" />
          <div className="mt-6 flex items-center justify-center gap-3">
            <Stars rating={rating} size={18} />
            <span className="text-sm text-smoke">
              {rating.toFixed(1)} out of 5 · {reviewCount} reviews
            </span>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => {
            const arabic = /[\u0600-\u06FF]/.test(review.body);
            return (
              <Reveal key={review.id} delay={(i % 3) * 100}>
                <figure className="flex h-full flex-col rounded-[3px] bg-ivory p-7 shadow-[0_20px_50px_-35px_rgba(29,26,23,0.4)] md:p-8">
                  <Quote className="h-7 w-7 text-gold-light" strokeWidth={1.2} />
                  <Stars rating={review.rating} size={13} className="mt-4" />
                  <p className="mt-3 font-display text-xl">{review.title}</p>
                  <blockquote
                    className="mt-2 flex-1 leading-relaxed text-ink/75"
                    dir={arabic ? "rtl" : undefined}
                    lang={arabic ? "ar" : undefined}
                  >
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-ink/10 pt-5">
                    <div>
                      <p className="text-sm font-medium">{review.authorName}</p>
                      <p className="text-xs text-smoke">{review.city} · Verified buyer</p>
                    </div>
                    <Link href={`/products/${review.productSlug}`} className="group flex items-center gap-2.5">
                      <span className="text-right text-xs leading-tight text-smoke group-hover:text-basil">
                        {review.productName}
                      </span>
                      <span className="relative h-11 w-9 shrink-0 overflow-hidden rounded-[2px] bg-cream">
                        <Image src={review.productImage} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FAQ ------------------------------- */

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Cairo & Giza: 1–2 business days, or next day with Express. All other governorates: 2–4 business days. Our couriers deliver Saturday to Thursday and always call before arriving.",
  },
  {
    q: "How much does delivery cost?",
    a: "Delivery is free on orders over EGP 1,500. Otherwise it's EGP 65 in Cairo & Giza and EGP 85 to all other governorates. Express next-day delivery in Cairo & Giza is EGP 120.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cash on delivery, card on delivery (Visa, Mastercard and Meeza on the courier's POS machine), and InstaPay or Vodafone Cash transfers. There are never any hidden fees.",
  },
  {
    q: "Can I return or exchange a perfume?",
    a: "Unopened items can be returned within 14 days for a full refund. If a scent isn't right for you, we'll exchange it once within 7 days — even if you've tried it, as long as at least 90% remains.",
  },
  {
    q: "Are the Kids & Teens products safe for sensitive skin?",
    a: "Yes. Our kids' mists are alcohol-free, paraben-free and dermatologically tested. We still recommend a small patch test before first use.",
  },
  {
    q: "How long will my perfume last on skin?",
    a: "Eau de Parfum typically lasts 6–8 hours, Extrait and Parfum 10–12+ hours, perfume oils 12+ hours and body mists 2–4 hours. Each product page shows its longevity and projection.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="shell scroll-mt-32 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="Good to know"
            title="Delivery, payment & returns"
            arabic="أسئلة متكررة"
            align="left"
            description="Still have a question? Our team replies on WhatsApp every day from 11am to 11pm."
          />
        </Reveal>
        <Reveal delay={100} className="divide-y divide-ink/10 border-y border-ink/10">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex items-center justify-between gap-6 py-5 font-display text-xl md:text-2xl">
                {item.q}
                <span className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-ink transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-smoke">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- Newsletter --------------------------- */

export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-basil text-ivory">
      <LeafMark className="pointer-events-none absolute -left-16 -top-20 h-80 w-80 rotate-[-25deg] text-ivory/[0.06]" />
      <LeafMark className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rotate-[30deg] text-ivory/[0.05]" />
      <div className="shell relative grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-gold-light">The Re7an circle</p>
          <h2 className="mt-3 font-display text-4xl font-light leading-tight md:text-5xl">
            10% off your first order
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-ivory/75">
            Be the first to discover new scents, Ramadan &amp; Eid gift edits and members-only private sales.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
