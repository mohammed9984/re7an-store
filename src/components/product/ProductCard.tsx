"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Price, Stars } from "@/components/ui/primitives";
import { useCart } from "@/lib/cart-store";
import type { ProductCardData } from "@/lib/queries";
import { cn, discountPercent, formatEGP } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: ProductCardData;
  priority?: boolean;
  className?: string;
}) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const available = product.variants.filter((v) => v.stock > 0);
  const defaultVariant = available.find((v) => v.size.startsWith("50")) ?? available[0];
  const off = discountPercent(product.price, product.compareAtPrice);
  const href = `/products/${product.slug}`;
  const sizes = "(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 48vw";

  function quickAdd() {
    if (!defaultVariant) return;
    addItem({
      variantId: defaultVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: defaultVariant.size,
      price: defaultVariant.price,
      compareAtPrice: defaultVariant.compareAtPrice,
      image: product.images[0],
      maxQuantity: defaultVariant.stock,
    });
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className={cn("group relative", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-cream">
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.21,1)] group-hover:scale-[1.06]"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-terracotta px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.12em] text-ivory uppercase">
              −{off}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-basil px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-ivory uppercase">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="rounded-full bg-ivory/95 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-ink uppercase">
              Bestseller
            </span>
          )}
        </div>

        {defaultVariant ? (
          <>
            <button
              type="button"
              onClick={quickAdd}
              className="absolute inset-x-3 bottom-3 hidden h-11 translate-y-3 items-center justify-center gap-2 rounded-[3px] bg-ivory/95 text-[0.68rem] font-medium tracking-[0.18em] uppercase text-ink opacity-0 shadow-lg backdrop-blur transition-all duration-500 hover:bg-basil hover:text-ivory focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:flex"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 shrink-0" /> Added to bag
                </>
              ) : (
                <span className="truncate px-3">
                  Add {defaultVariant.size} · {formatEGP(defaultVariant.price)}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`Add ${product.name} ${defaultVariant.size} to bag`}
              className={cn(
                "absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors md:hidden",
                added ? "bg-basil text-ivory" : "bg-ivory/95 text-ink",
              )}
            >
              {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </>
        ) : (
          <span className="absolute inset-x-3 bottom-3 rounded-[3px] bg-ink/75 py-2.5 text-center text-[0.68rem] tracking-[0.2em] uppercase text-ivory">
            Sold out
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[0.64rem] font-medium tracking-[0.2em] uppercase text-smoke">
          {product.collectionName} · {product.concentration}
        </p>
        <h3 className="mt-1.5 font-display text-[1.4rem] leading-[1.1]">
          <Link href={href} className="transition-colors hover:text-basil">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 font-arabic text-[0.95rem] text-gold" lang="ar" dir="rtl">
          {product.arabicName}
        </p>
        {product.reviewCount > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Stars rating={product.ratingAvg} size={12} />
            <span className="text-xs text-smoke">
              {product.ratingAvg.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
        <Price
          price={product.price}
          compareAt={product.compareAtPrice}
          from={product.variants.length > 1}
          className="mt-2 text-[0.95rem]"
        />
      </div>
    </article>
  );
}
