"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, CircleCheck, LoaderCircle, PenLine } from "lucide-react";
import { submitReview, type ReviewFormState } from "@/app/actions";
import { Stars } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export type ReviewView = {
  id: number;
  authorName: string;
  city: string | null;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  dateLabel: string;
  timestamp: number;
};

type Sort = "recent" | "highest" | "lowest";

const ARABIC = /[\u0600-\u06FF]/;

export function ReviewsPanel({
  productId,
  slug,
  productName,
  reviews,
  distribution,
  average,
}: {
  productId: number;
  slug: string;
  productName: string;
  reviews: ReviewView[];
  distribution: { star: number; count: number }[];
  average: number;
}) {
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("recent");
  const [visible, setVisible] = useState(6);
  const [formOpen, setFormOpen] = useState(false);
  const total = reviews.length;

  const list = useMemo(() => {
    const filtered = starFilter ? reviews.filter((r) => r.rating === starFilter) : reviews;
    const sorted = [...filtered];
    if (sort === "recent") sorted.sort((a, b) => b.timestamp - a.timestamp);
    if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating || b.timestamp - a.timestamp);
    if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating || b.timestamp - a.timestamp);
    return sorted;
  }, [reviews, starFilter, sort]);

  return (
    <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
      <div>
        <div className="lg:sticky lg:top-36">
          <p className="font-display text-7xl font-light leading-none">{average.toFixed(1)}</p>
          <Stars rating={average} size={18} className="mt-3" />
          <p className="mt-2 text-sm text-smoke">Based on {total} {total === 1 ? "review" : "reviews"}</p>
          <ul className="mt-6 space-y-2">
            {distribution.map(({ star, count }) => {
              const pct = total ? (count / total) * 100 : 0;
              const active = starFilter === star;
              return (
                <li key={star}>
                  <button
                    type="button"
                    disabled={count === 0}
                    onClick={() => {
                      setStarFilter(active ? null : star);
                      setVisible(6);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded px-1 py-1 text-sm transition-colors disabled:cursor-default disabled:opacity-40",
                      active ? "bg-cream" : "enabled:hover:bg-cream/70",
                    )}
                    aria-pressed={active}
                  >
                    <span className="w-10 text-left tabular-nums">{star} ★</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                      <span
                        className="block h-full rounded-full bg-gold transition-[width] duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-8 text-right text-xs text-smoke tabular-nums">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => setFormOpen((o) => !o)} className="btn btn-outline mt-8 w-full">
            <PenLine className="h-4 w-4" strokeWidth={1.5} /> {formOpen ? "Close form" : "Write a review"}
          </button>
        </div>
      </div>

      <div>
        {formOpen && (
          <ReviewForm
            productId={productId}
            slug={slug}
            productName={productName}
            onDone={() => {
              setSort("recent");
              setStarFilter(null);
            }}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <p className="text-sm text-smoke">
            {starFilter ? `${list.length} × ${starFilter}-star reviews` : `${total} reviews`}
            {starFilter && (
              <button type="button" onClick={() => setStarFilter(null)} className="ml-3 text-ink underline underline-offset-4">
                Show all
              </button>
            )}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-smoke">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="input h-10 min-h-0 w-auto rounded-full py-0 pl-4 text-sm"
            >
              <option value="recent">Most recent</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </label>
        </div>

        {list.length === 0 ? (
          <p className="py-12 text-center text-smoke">No reviews yet — be the first to share your thoughts.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {list.slice(0, visible).map((review) => {
              const arabic = ARABIC.test(review.body);
              return (
                <li key={review.id} className="animate-fade-in py-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Stars rating={review.rating} size={13} />
                    <span className="text-xs text-smoke">{review.dateLabel}</span>
                  </div>
                  <p className="mt-3 font-display text-xl" dir={ARABIC.test(review.title) ? "rtl" : undefined}>
                    {review.title}
                  </p>
                  <p
                    className={cn("mt-2 leading-relaxed text-ink/80", arabic && "text-right")}
                    dir={arabic ? "rtl" : undefined}
                    lang={arabic ? "ar" : undefined}
                  >
                    {review.body}
                  </p>
                  <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-medium text-ink">{review.authorName}</span>
                    {review.city && <span className="text-smoke">{review.city}</span>}
                    {review.isVerified && (
                      <span className="inline-flex items-center gap-1 text-basil">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified buyer
                      </span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        {visible < list.length && (
          <div className="pt-4 text-center">
            <button type="button" onClick={() => setVisible((v) => v + 6)} className="btn btn-outline">
              Show more reviews ({list.length - visible})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewForm({
  productId,
  slug,
  productName,
  onDone,
}: {
  productId: number;
  slug: string;
  productName: string;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(submitReview, { ok: false });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (state.ok && state.submittedAt) {
      formRef.current?.reset();
      doneRef.current();
    }
  }, [state.ok, state.submittedAt]);

  if (state.ok) {
    return (
      <div className="mb-10 flex animate-fade-up items-start gap-3 rounded-[4px] border border-basil/30 bg-basil/5 p-5">
        <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-basil" />
        <div>
          <p className="font-medium text-basil">{state.message}</p>
          <p className="mt-1 text-sm text-smoke">Thanks for helping others discover {productName}.</p>
        </div>
      </div>
    );
  }

  const err = state.errors ?? {};
  const shown = hover || rating;

  return (
    <form ref={formRef} action={formAction} className="mb-10 animate-fade-up rounded-[4px] border border-ink/10 bg-white p-6 md:p-8" noValidate>
      <p className="font-display text-2xl">Review {productName}</p>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-5">
        <span className="field-label">Your rating</span>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(star)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className={cn("h-7 w-7", star <= shown ? "text-gold" : "text-ink/15")} fill="currentColor">
                <path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3L2.9 9.4l6.4-.7L12 2.8z" />
              </svg>
            </button>
          ))}
        </div>
        {err.rating && <p className="mt-1 text-xs text-terracotta">{err.rating}</p>}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="authorName" className="field-label">
            Name
          </label>
          <input id="authorName" name="authorName" className="input" placeholder="e.g. Mariam A." aria-invalid={!!err.authorName} />
          {err.authorName && <p className="mt-1 text-xs text-terracotta">{err.authorName}</p>}
        </div>
        <div>
          <label htmlFor="city" className="field-label">
            City <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="city" name="city" className="input" placeholder="e.g. Alexandria" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="title" className="field-label">
          Headline
        </label>
        <input id="title" name="title" className="input" placeholder="Sum it up in a few words" aria-invalid={!!err.title} />
        {err.title && <p className="mt-1 text-xs text-terracotta">{err.title}</p>}
      </div>
      <div className="mt-4">
        <label htmlFor="body" className="field-label">
          Your review
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          className="input resize-y"
          placeholder="How does it smell, how long does it last, who would you recommend it to?"
          aria-invalid={!!err.body}
        />
        {err.body && <p className="mt-1 text-xs text-terracotta">{err.body}</p>}
      </div>
      {state.message && !state.ok && <p className="mt-4 text-sm text-terracotta">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary mt-6">
        {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Publish review"}
      </button>
    </form>
  );
}
