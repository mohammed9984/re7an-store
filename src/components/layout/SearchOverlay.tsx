"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, Search, X } from "lucide-react";
import { Price } from "@/components/ui/primitives";
import { familyLabel } from "@/lib/constants";
import { useEscape, useLockBody } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type SearchResult = {
  slug: string;
  name: string;
  arabicName: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  family: string;
  concentration: string;
};

const POPULAR = ["Oud", "Rose", "Vanilla", "Musk", "Jasmine", "Fresh", "Amber", "Gift"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState("");

  useLockBody(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const id = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = (await res.json()) as { results?: SearchResult[] };
        setResults(data.results ?? []);
        setSearched(q);
      } catch {
        /* aborted or offline */
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      window.clearTimeout(id);
      controller.abort();
    };
  }, [query]);

  const showResults = query.trim().length >= 2;

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <div
      className={cn("fixed inset-0 z-[60]", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/45 backdrop-blur-sm transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={cn(
          "absolute inset-x-0 top-0 max-h-[92dvh] overflow-y-auto bg-ivory shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.21,1)]",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="shell py-6 md:py-10">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-gold">Search the collection</p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Close search"
            >
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>

          <form onSubmit={submit} className="mt-4 flex items-center gap-3 border-b border-ink/20 pb-3 focus-within:border-basil">
            <Search className="h-6 w-6 shrink-0 text-smoke" strokeWidth={1.3} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “oud”, “rose” or “Cairo Nights”"
              className="w-full bg-transparent font-display text-3xl font-light outline-none placeholder:text-smoke/50 md:text-5xl"
              aria-label="Search perfumes"
              enterKeyHint="search"
            />
            {loading && <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-smoke" />}
          </form>

          {!showResults && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs uppercase tracking-[0.2em] text-smoke">Popular</span>
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-ink/15 px-4 py-1.5 text-sm transition-colors hover:border-basil hover:bg-basil hover:text-ivory"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {showResults && (
            <div className="mt-8">
              {results.length > 0 ? (
                <>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                    {results.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/products/${r.slug}`} onClick={onClose} className="group block">
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-cream">
                            <Image
                              src={r.image}
                              alt={r.name}
                              fill
                              sizes="(min-width: 1024px) 15vw, 45vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <p className="mt-3 font-display text-lg leading-tight">{r.name}</p>
                          <p className="text-xs text-smoke">
                            {familyLabel(r.family)} · {r.concentration}
                          </p>
                          <Price price={r.price} compareAt={r.compareAtPrice} className="mt-1 text-sm" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={submit} className="btn btn-outline mt-8">
                    See all results <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              ) : (
                !loading &&
                searched && (
                  <p className="text-smoke">
                    No perfumes match “{searched}”. Try a note like <em>rose</em>, <em>oud</em> or <em>musk</em>.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
