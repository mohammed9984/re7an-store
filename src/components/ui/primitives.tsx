import { cn, discountPercent, formatEGP } from "@/lib/utils";

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 2.5c-5.2 3.4-7.4 8-6.6 12.6.6 3.6 3.3 6.4 6.6 6.4s6-2.8 6.6-6.4C19.4 10.5 17.2 5.9 12 2.5Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M12 2.5c-5.2 3.4-7.4 8-6.6 12.6.6 3.6 3.3 6.4 6.6 6.4s6-2.8 6.6-6.4C19.4 10.5 17.2 5.9 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M12 6v15.5M12 11l-3-2.2M12 14.5l3.4-2.6M12 18l-2.8-2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
  align = "center",
}: {
  className?: string;
  compact?: boolean;
  align?: "center" | "start";
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col leading-none",
        align === "center" ? "items-center" : "items-start",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <LeafMark className="h-5 w-5 text-gold" />
        <span className="font-display text-[1.7rem] font-semibold tracking-[0.3em]">RE7AN</span>
      </span>
      {!compact && (
        <span className="mt-1 font-arabic text-[0.82rem] tracking-normal text-gold" lang="ar">
          ريحان · عطور
        </span>
      )}
    </span>
  );
}

function StarGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3L2.9 9.4l6.4-.7L12 2.8z" />
    </svg>
  );
}

export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      <span className="flex gap-[2px] text-ink/15">
        {Array.from({ length: 5 }, (_, i) => (
          <StarGlyph key={i} size={size} />
        ))}
      </span>
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <span className="flex gap-[2px] text-gold">
          {Array.from({ length: 5 }, (_, i) => (
            <StarGlyph key={i} size={size} />
          ))}
        </span>
      </span>
    </span>
  );
}

export function Price({
  price,
  compareAt,
  from = false,
  className,
}: {
  price: number;
  compareAt?: number | null;
  from?: boolean;
  className?: string;
}) {
  const off = discountPercent(price, compareAt);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      {from && <span className="text-[0.7em] uppercase tracking-[0.18em] text-smoke">From</span>}
      <span className={cn("font-medium", off > 0 && "text-terracotta")}>{formatEGP(price)}</span>
      {off > 0 && compareAt ? (
        <s className="text-[0.85em] text-smoke/70">{formatEGP(compareAt)}</s>
      ) : null}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  arabic,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  arabic?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl", className)}>
      {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
      <h2 className="mt-3 font-display text-4xl font-light leading-[1.05] text-balance md:text-[3.25rem]">
        {title}
      </h2>
      {arabic && (
        <p className="mt-2 font-arabic text-xl text-basil-light" lang="ar" dir="rtl">
          {arabic}
        </p>
      )}
      {description && <p className="mt-4 text-[0.98rem] leading-relaxed text-smoke">{description}</p>}
    </div>
  );
}
