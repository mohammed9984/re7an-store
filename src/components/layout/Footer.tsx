import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/primitives";
import { SITE } from "@/lib/constants";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Shop",
    links: [
      ["All perfumes", "/shop"],
      ["For Her", "/shop?collection=women"],
      ["For Him", "/shop?collection=men"],
      ["Unisex", "/shop?collection=unisex"],
      ["Oud & Oriental", "/shop?collection=oud-oriental"],
      ["Kids & Teens", "/shop?collection=kids-teens"],
      ["Gift sets", "/shop?collection=gift-sets"],
    ],
  },
  {
    title: "Discover",
    links: [
      ["Bestsellers", "/shop?sort=bestselling"],
      ["New arrivals", "/shop?new=1&sort=newest"],
      ["On sale", "/shop?sale=1"],
      ["Our story", "/#story"],
      ["Scent families", "/#families"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Delivery & returns", "/#faq"],
      ["Payment options", "/#faq"],
      ["Track your order", `https://wa.me/${SITE.whatsapp}`],
      ["Contact us", `mailto:${SITE.email}`],
    ],
  },
];

const PAYMENTS = ["Cash on delivery", "Visa", "Mastercard", "Meeza", "InstaPay", "Vodafone Cash"];

function SocialIcon({ name }: { name: "instagram" | "facebook" | "tiktok" }) {
  const paths: Record<typeof name, string> = {
    instagram:
      "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.1c-.1-1.5-.4-2.8-1.5-3.9-1-1-2.4-1.4-3.9-1.5-1.5-.1-6-.1-7.5 0-1.5.1-2.8.4-3.9 1.5S2.8 6.6 2.7 8.1c-.1 1.5-.1 6 0 7.5.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 6 .1 7.5 0 1.5-.1 2.8-.4 3.9-1.5 1-1 1.4-2.4 1.5-3.9.1-1.5.1-6 0-7.5Zm-2 9.2a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4A3 3 0 0 1 5 17.3c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3A3 3 0 0 1 6.7 5c1.2-.5 4-.4 5.3-.4s4.1-.1 5.3.4A3 3 0 0 1 19 6.7c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.3Z",
    facebook:
      "M14 13.5h2.5l1-4H14v-2c0-1 0-2 2-2h1.5V2.1C17.2 2.1 16 2 14.6 2 11.7 2 10 3.7 10 6.8v2.7H7v4h3V22h4v-8.5Z",
    tiktok:
      "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-basil-dark text-ivory/80">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-16 select-none font-arabic text-[16rem] leading-none text-ivory/[0.035] md:text-[22rem]"
      >
        ريحان
      </div>
      <div className="shell relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr] lg:py-20">
        <div className="max-w-sm">
          <Logo align="start" className="text-ivory" />
          <p className="mt-6 text-sm leading-relaxed text-ivory/65">
            An Egyptian perfume house crafting long-lasting fragrances in Cairo — from fresh basil to precious
            oud — for every generation, delivered to every governorate.
          </p>
          <div className="mt-6 flex gap-2">
            {(["instagram", "facebook", "tiktok"] as const).map((name) => (
              <a
                key={name}
                href={`https://www.${name}.com/re7an.eg`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Re7an on ${name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold-light hover:text-gold-light"
              >
                <SocialIcon name={name} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="eyebrow text-gold-light">{column.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {column.links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith("http") || href.startsWith("mailto") ? (
                    <a href={href} className="link-underline hover:text-ivory" target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="link-underline hover:text-ivory">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow text-gold-light">Visit the boutique</p>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.4} />
              {SITE.boutique}
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.4} />
              {SITE.hours}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.4} />
              <a href={`https://wa.me/${SITE.whatsapp}`} className="link-underline hover:text-ivory">
                {SITE.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.4} />
              <a href={`mailto:${SITE.email}`} className="link-underline hover:text-ivory">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-ivory/10">
        <div className="shell flex flex-col gap-4 py-6 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Re7an Perfumes · Crafted in Cairo, Egypt 🇪🇬</p>
          <ul className="flex flex-wrap gap-2">
            {PAYMENTS.map((p) => (
              <li key={p} className="rounded-full border border-ivory/15 px-3 py-1 text-[0.68rem] tracking-wide text-ivory/70">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
