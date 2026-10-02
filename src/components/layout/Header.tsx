"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { Logo } from "@/components/ui/primitives";
import { selectCount, useCart } from "@/lib/cart-store";
import { SITE } from "@/lib/constants";
import { useEscape, useLockBody } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop All", collection: null },
  { href: "/shop?collection=women", label: "For Her", collection: "women" },
  { href: "/shop?collection=men", label: "For Him", collection: "men" },
  { href: "/shop?collection=unisex", label: "Unisex", collection: "unisex" },
  { href: "/shop?collection=oud-oriental", label: "Oud & Oriental", collection: "oud-oriental" },
  { href: "/shop?collection=kids-teens", label: "Kids & Teens", collection: "kids-teens" },
  { href: "/shop?collection=gift-sets", label: "Gifts", collection: "gift-sets" },
] as const;

function NavList({
  activeCollection,
  onShop,
  variant,
  onNavigate,
}: {
  activeCollection: string | null;
  onShop: boolean;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  return (
    <>
      {NAV_LINKS.map((link, i) => {
        const active = onShop && (link.collection ? link.collection === activeCollection : !activeCollection);
        return variant === "desktop" ? (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className="link-underline py-1 text-[0.72rem] font-medium tracking-[0.2em] uppercase text-ink/80 transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ) : (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            style={{ animationDelay: `${80 + i * 50}ms` }}
            className={cn(
              "group flex animate-slide-in-right items-center justify-between border-b border-ink/10 py-4 font-display text-[1.7rem] font-light",
              active && "text-basil",
            )}
          >
            {link.label}
            <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>
        );
      })}
    </>
  );
}

function NavLinks(props: { variant: "desktop" | "mobile"; onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <NavList
      {...props}
      onShop={pathname === "/shop"}
      activeCollection={searchParams.get("collection")}
    />
  );
}

function SuspendedNav(props: { variant: "desktop" | "mobile"; onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavList {...props} onShop={false} activeCollection={null} />}>
      <NavLinks {...props} />
    </Suspense>
  );
}

function CartButton() {
  const count = useCart(selectCount);
  const hydrated = useCart((s) => s.hydrated);
  const lastAddedAt = useCart((s) => s.lastAddedAt);
  const openCart = useCart((s) => s.openCart);

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5"
      aria-label={`Open shopping bag${hydrated && count ? `, ${count} items` : ""}`}
    >
      <ShoppingBag className="h-[1.3rem] w-[1.3rem]" strokeWidth={1.4} />
      {hydrated && count > 0 && (
        <span
          key={lastAddedAt}
          className="absolute right-0.5 top-0.5 flex h-[1.15rem] min-w-[1.15rem] animate-bump items-center justify-center rounded-full bg-basil px-1 text-[0.62rem] font-semibold text-ivory"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useLockBody(menuOpen);
  useEscape(menuOpen, () => setMenuOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-500",
          scrolled
            ? "border-ink/10 bg-ivory/90 shadow-[0_10px_30px_-20px_rgba(29,26,23,0.35)] backdrop-blur-md"
            : "border-transparent bg-ivory",
        )}
      >
        <div className="shell grid h-[4.25rem] grid-cols-[1fr_auto_1fr] items-center md:h-20">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/5 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-[0.72rem] tracking-[0.18em] uppercase text-ink/75 hover:bg-ink/5 hover:text-ink"
              aria-label="Search perfumes"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>

          <Link href="/" aria-label="Re7an — home" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-1">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hidden h-11 items-center rounded-full px-3 text-[0.72rem] tracking-[0.18em] uppercase text-ink/75 hover:bg-ink/5 hover:text-ink md:inline-flex"
            >
              Help
            </a>
            <CartButton />
          </div>
        </div>

        <nav aria-label="Main" className="hidden border-t border-ink/[0.06] lg:block">
          <div className="shell flex h-12 items-center justify-center gap-9">
            <SuspendedNav variant="desktop" />
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cn("fixed inset-0 z-50 lg:hidden", menuOpen ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-ivory shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.21,1)]",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-[4.25rem] items-center justify-between border-b border-ink/10 px-5">
            <Logo compact />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-4">
            {menuOpen && <SuspendedNav variant="mobile" onNavigate={() => setMenuOpen(false)} />}
          </nav>
          <div className="space-y-2 border-t border-ink/10 bg-cream px-6 py-6 text-sm text-smoke">
            <p className="eyebrow text-gold">Need help choosing?</p>
            <a href={`https://wa.me/${SITE.whatsapp}`} className="block text-ink" target="_blank" rel="noreferrer">
              WhatsApp {SITE.phone}
            </a>
            <p>{SITE.boutique}</p>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
