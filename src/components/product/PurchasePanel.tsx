"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Banknote, Check, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { cn, discountPercent, formatEGP } from "@/lib/utils";

export type PurchaseVariant = {
  id: number;
  size: string;
  sizeMl: number;
  price: number;
  compareAtPrice: number | null;
  stock: number;
};

type Props = {
  product: { id: number; slug: string; name: string; image: string };
  variants: PurchaseVariant[];
  delivery: { greaterCairo: string; elsewhere: string };
};

export function PurchasePanel({ product, variants, delivery }: Props) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const initial =
    variants.find((v) => v.size.startsWith("50") && v.stock > 0) ?? variants.find((v) => v.stock > 0) ?? variants[0];
  const [variantId, setVariantId] = useState(initial?.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const soldOut = !variant || variant.stock <= 0;
  const maxQuantity = variant ? Math.max(1, Math.min(10, variant.stock)) : 1;
  const off = variant ? discountPercent(variant.price, variant.compareAtPrice) : 0;
  const perMl = variant && variant.sizeMl > 0 ? Math.round(variant.price / variant.sizeMl) : 0;

  useEffect(() => {
    const node = ctaRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function selectVariant(id: number) {
    setVariantId(id);
    setQuantity(1);
  }

  function addToBag({ openDrawer = true }: { openDrawer?: boolean } = {}) {
    if (!variant || soldOut) return;
    addItem(
      {
        variantId: variant.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: variant.size,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        image: product.image,
        maxQuantity: variant.stock,
      },
      quantity,
    );
    if (!openDrawer) useCart.getState().closeCart();
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2000);
  }

  function buyNow() {
    addToBag({ openDrawer: false });
    router.push("/checkout");
  }

  if (!variant) return null;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={cn("font-display text-[2.1rem] leading-none", off > 0 && "text-terracotta")}>
          {formatEGP(variant.price)}
        </span>
        {off > 0 && variant.compareAtPrice && (
          <>
            <s className="text-lg text-smoke/70">{formatEGP(variant.compareAtPrice)}</s>
            <span className="rounded-full bg-terracotta/10 px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-terracotta">
              Save {off}%
            </span>
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-smoke">
        {perMl > 0 && variants.length > 0 && !variant.size.includes("×") ? `${formatEGP(perMl)} / ml · ` : ""}
        Taxes included · Free delivery over {formatEGP(FREE_SHIPPING_THRESHOLD)}
      </p>

      <fieldset className="mt-8">
        <legend className="mb-3 flex w-full items-center justify-between text-[0.72rem] font-medium tracking-[0.2em] uppercase">
          <span>Size</span>
          <span className="normal-case tracking-normal text-smoke">{variant.size}</span>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {variants.map((v) => {
            const selected = v.id === variant.id;
            const unavailable = v.stock <= 0;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => selectVariant(v.id)}
                aria-pressed={selected}
                className={cn(
                  "relative flex min-w-[6.5rem] flex-col items-start rounded-[4px] border px-4 py-3 text-left transition-all duration-300",
                  selected
                    ? "border-ink bg-ink text-ivory shadow-[0_10px_24px_-14px_rgba(29,26,23,0.8)]"
                    : "border-ink/15 bg-white hover:border-ink/50",
                  unavailable && !selected && "opacity-60",
                )}
              >
                <span className="text-sm font-medium">{v.size}</span>
                <span className={cn("text-xs", selected ? "text-ivory/70" : "text-smoke")}>
                  {unavailable ? "Sold out" : formatEGP(v.price)}
                </span>
                {unavailable && (
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[4px]">
                    <span className="absolute left-0 top-1/2 h-px w-[120%] -rotate-[20deg] bg-current opacity-25" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-5 flex items-center gap-2 text-sm">
        {soldOut ? (
          <>
            <span className="h-2 w-2 rounded-full bg-smoke" /> This size is sold out — restocking soon
          </>
        ) : variant.stock <= 5 ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
            </span>
            <span className="text-terracotta">Only {variant.stock} left — order soon</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-basil-light" /> In stock · ships within 24 hours
          </>
        )}
      </p>

      <div ref={ctaRef} className="mt-6 flex gap-3">
        <div className="flex h-[3.25rem] items-center rounded-[3px] border border-ink/15 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-full w-11 items-center justify-center hover:bg-ink/5 disabled:opacity-30"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || soldOut}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="flex h-full w-11 items-center justify-center hover:bg-ink/5 disabled:opacity-30"
            aria-label="Increase quantity"
            disabled={quantity >= maxQuantity || soldOut}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => addToBag()}
          disabled={soldOut}
          className={cn("btn flex-1", added ? "bg-basil-light text-ivory" : "btn-primary")}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added to bag
            </>
          ) : soldOut ? (
            "Sold out"
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" strokeWidth={1.6} /> Add to bag · {formatEGP(variant.price * quantity)}
            </>
          )}
        </button>
      </div>
      <button type="button" onClick={buyNow} disabled={soldOut} className="btn btn-outline mt-3 w-full">
        Buy it now
      </button>

      <div className="mt-8 rounded-[4px] border border-ink/10 bg-cream/60 p-5">
        <p className="flex items-start gap-3 text-sm">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-basil" strokeWidth={1.4} />
          <span>
            Order today — arrives <strong className="font-medium">{delivery.greaterCairo}</strong> in Cairo &amp;
            Giza, or <strong className="font-medium">{delivery.elsewhere}</strong> elsewhere in Egypt.
          </span>
        </p>
        <ul className="mt-4 grid gap-3 border-t border-ink/10 pt-4 text-xs text-smoke sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-gold" strokeWidth={1.4} /> Cash or card on delivery
          </li>
          <li className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-gold" strokeWidth={1.4} /> 14-day easy returns
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold" strokeWidth={1.4} /> 100% authentic, made in Egypt
          </li>
        </ul>
      </div>

      {/* Sticky mobile purchase bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-ivory/95 px-4 py-3 backdrop-blur-md transition-transform duration-500 md:hidden",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg leading-tight">{product.name}</p>
            <p className="text-xs text-smoke">
              {variant.size} · {formatEGP(variant.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => addToBag()}
            disabled={soldOut}
            tabIndex={showSticky ? 0 : -1}
            className="btn btn-primary min-h-11 px-5"
          >
            {added ? <Check className="h-4 w-4" /> : soldOut ? "Sold out" : "Add to bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
