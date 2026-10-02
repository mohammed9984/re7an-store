"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEscape, useLockBody } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = images.length;

  useLockBody(lightbox);
  useEscape(lightbox, () => setLightbox(false));

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, count]);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function onTouchStart(event: TouchEvent) {
    touchStart.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStart.current === null) return;
    const dx = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    if (Math.abs(dx) > 40 && count > 1) go(dx < 0 ? 1 : -1);
    touchStart.current = null;
  }

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row lg:sticky lg:top-36">
      {count > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-visible">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-[3px] bg-cream transition-all duration-300 md:w-full",
                i === index ? "ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="group relative flex-1">
        <div
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[3px] bg-cream"
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                i === index ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={i !== index}
            >
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={
                  i === index && zoom
                    ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              >
                <Image
                  src={src}
                  alt={`${name} — image ${i + 1} of ${count}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden">
              {images.map((src, i) => (
                <span
                  key={src}
                  className={cn("h-1.5 rounded-full bg-ivory transition-all", i === index ? "w-5" : "w-1.5 opacity-60")}
                />
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="View fullscreen"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 shadow transition-transform hover:scale-105"
        >
          <Expand className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-ink/95 text-ivory"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} gallery`}
        >
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="text-xs tracking-[0.2em] uppercase text-ivory/70">
              {name} · {index + 1} / {count}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ivory/10"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" strokeWidth={1.3} />
            </button>
          </div>
          <div className="relative flex-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Image
              key={images[index]}
              src={images[index]}
              alt={`${name} — image ${index + 1}`}
              fill
              sizes="100vw"
              className="animate-fade-in object-contain p-4 md:p-10"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20 md:left-6"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={1.3} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20 md:right-6"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={1.3} />
                </button>
              </>
            )}
          </div>
          {count > 1 && (
            <div className="flex justify-center gap-3 p-4 md:p-6">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={cn(
                    "relative h-16 w-13 overflow-hidden rounded-[3px] transition-opacity",
                    i === index ? "ring-1 ring-ivory" : "opacity-50 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="52px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
