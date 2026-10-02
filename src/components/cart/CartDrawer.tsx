"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Gift, Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import { selectSubtotal, useCart } from "@/lib/cart-store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useEscape, useLockBody } from "@/lib/hooks";
import { cn, formatEGP } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/shop?sort=bestselling", label: "Bestsellers" },
  { href: "/shop?collection=oud-oriental", label: "Oud & Oriental" },
  { href: "/shop?collection=gift-sets", label: "Gift sets" },
];

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const subtotal = useCart(selectSubtotal);
  const closeCart = useCart((s) => s.closeCart);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const pathname = usePathname();

  useLockBody(isOpen);
  useEscape(isOpen, closeCart);

  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const savings = items.reduce(
    (n, i) => n + (i.compareAtPrice && i.compareAtPrice > i.price ? (i.compareAtPrice - i.price) * i.quantity : 0),
    0,
  );

  return (
    <div
      className={cn("fixed inset-0 z-[55]", isOpen ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={closeCart}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-ivory shadow-[-30px_0_60px_-30px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.21,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="font-display text-2xl">Your bag</p>
            <p className="text-xs uppercase tracking-[0.2em] text-smoke">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-ink/10 bg-cream/70 px-6 py-4">
            <p className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-basil" strokeWidth={1.5} />
              {remaining > 0 ? (
                <span>
                  You&apos;re <strong className="font-semibold">{formatEGP(remaining)}</strong> away from free delivery
                </span>
              ) : (
                <span className="text-basil">You&apos;ve unlocked free delivery across Egypt ✨</span>
              )}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-basil-light to-basil transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {!hydrated ? (
            <div className="space-y-4 py-6">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="skeleton h-28 w-22 rounded-[3px]" />
                  <div className="flex-1 space-y-2 pt-2">
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-3 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                <ShoppingBag className="h-8 w-8 text-gold" strokeWidth={1.2} />
              </span>
              <p className="mt-6 font-display text-3xl font-light">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-smoke">
                Discover scents crafted in Cairo — from fresh basil to precious oud.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeCart}
                    className="rounded-full border border-ink/15 px-4 py-2 text-sm transition-colors hover:border-basil hover:bg-basil hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {items.map((item) => (
                <li key={item.variantId} className="flex animate-fade-in gap-4 py-5">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-28 w-[5.5rem] shrink-0 overflow-hidden rounded-[3px] bg-cream"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="88px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-display text-xl leading-tight hover:text-basil"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-smoke">{item.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="-mr-1 -mt-1 rounded-full p-1.5 text-smoke transition-colors hover:bg-ink/5 hover:text-terracotta"
                        aria-label={`Remove ${item.name} ${item.size}`}
                      >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex h-9 items-center rounded-full border border-ink/15">
                        <button
                          type="button"
                          onClick={() =>
                            item.quantity <= 1 ? removeItem(item.variantId) : setQuantity(item.variantId, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= Math.min(10, item.maxQuantity)}
                          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.compareAtPrice && item.compareAtPrice > item.price ? (
                          <s className="block text-xs text-smoke/70">
                            {formatEGP(item.compareAtPrice * item.quantity)}
                          </s>
                        ) : null}
                        <span className="text-[0.95rem] font-medium">{formatEGP(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hydrated && items.length > 0 && (
          <div className="border-t border-ink/10 bg-ivory px-6 pb-6 pt-5">
            <p className="mb-4 flex items-center gap-2 text-xs text-smoke">
              <Gift className="h-4 w-4 text-gold" strokeWidth={1.5} />
              Luxury gift wrapping & a handwritten note available at checkout
            </p>
            {savings > 0 && (
              <div className="mb-1 flex justify-between text-sm text-terracotta">
                <span>You save</span>
                <span>{formatEGP(savings)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-[0.18em]">Subtotal</span>
              <span className="font-display text-2xl">{formatEGP(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-smoke">Delivery and promo codes are applied at checkout.</p>
            <Link href="/checkout" onClick={closeCart} className="btn btn-primary mt-5 w-full">
              Checkout securely <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-smoke hover:text-ink"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
