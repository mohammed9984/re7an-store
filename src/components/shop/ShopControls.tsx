"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { ChevronDown, LoaderCircle, SlidersHorizontal, X } from "lucide-react";
import {
  CONCENTRATIONS,
  FAMILIES,
  GENDERS,
  PRICE_RANGES,
  SORT_OPTIONS,
  familyLabel,
  genderLabel,
} from "@/lib/constants";
import { useEscape, useLockBody } from "@/lib/hooks";
import type { ShopFacets, ShopFilters } from "@/lib/queries";
import { cn, formatEGP } from "@/lib/utils";

type Changes = Record<string, string | null>;
type CollectionOption = { slug: string; name: string };

type ShopContextValue = {
  filters: ShopFilters;
  pending: boolean;
  update: (changes: Changes) => void;
  clearAll: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

function toParams(f: ShopFilters) {
  const p = new URLSearchParams();
  if (f.collection) p.set("collection", f.collection);
  if (f.genders.length) p.set("gender", f.genders.join(","));
  if (f.families.length) p.set("family", f.families.join(","));
  if (f.concentrations.length) p.set("concentration", f.concentrations.join(","));
  if (f.min !== undefined) p.set("min", String(f.min));
  if (f.max !== undefined) p.set("max", String(f.max));
  if (f.sale) p.set("sale", "1");
  if (f.isNew) p.set("new", "1");
  if (f.q) p.set("q", f.q);
  if (f.sort !== "featured") p.set("sort", f.sort);
  return p;
}

const toggleValue = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export function ShopProvider({ filters, children }: { filters: ShopFilters; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (changes: Changes) => {
      const params = toParams(filters);
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [filters, pathname, router],
  );

  const clearAll = useCallback(() => {
    startTransition(() => router.push(pathname, { scroll: false }));
  }, [pathname, router]);

  const value = useMemo(() => ({ filters, pending, update, clearAll }), [filters, pending, update, clearAll]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function ShopResults({ children }: { children: ReactNode }) {
  const { pending } = useShop();
  return (
    <div
      aria-busy={pending}
      className={cn("transition-opacity duration-300", pending && "pointer-events-none opacity-40")}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Panel ------------------------------ */

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-ink/10 py-5 first:pt-0">
      <summary className="flex items-center justify-between text-[0.72rem] font-medium tracking-[0.22em] uppercase">
        {title}
        <ChevronDown className="h-4 w-4 text-smoke transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-2.5">{children}</div>
    </details>
  );
}

function Option({
  type,
  checked,
  label,
  count,
  onChange,
  name,
}: {
  type: "checkbox" | "radio";
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
  name?: string;
}) {
  return (
    <label className="group flex items-center gap-3 text-sm">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-gold",
          type === "radio" ? "rounded-full" : "rounded-[3px]",
          checked ? "border-basil bg-basil" : "border-ink/25 bg-white group-hover:border-ink/50",
        )}
      >
        {checked &&
          (type === "radio" ? (
            <span className="h-1.5 w-1.5 rounded-full bg-ivory" />
          ) : (
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-ivory" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m2.5 6.2 2.3 2.3 4.7-5" />
            </svg>
          ))}
      </span>
      <span className={cn("flex-1 transition-colors", checked ? "text-ink" : "text-ink/75 group-hover:text-ink")}>
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-smoke tabular-nums">{count}</span>}
    </label>
  );
}

function PriceInputs({
  idPrefix,
  initialMin,
  initialMax,
  onApply,
}: {
  idPrefix: string;
  initialMin?: number;
  initialMax?: number;
  onApply: (min: string, max: string) => void;
}) {
  const [min, setMin] = useState(initialMin?.toString() ?? "");
  const [max, setMax] = useState(initialMax?.toString() ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    onApply(min, max);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 pt-2">
      <label className="sr-only" htmlFor={`${idPrefix}-min`}>
        Minimum price
      </label>
      <input
        id={`${idPrefix}-min`}
        inputMode="numeric"
        value={min}
        onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
        placeholder="Min"
        className="input h-10 min-h-0 px-3 text-sm"
      />
      <span className="text-smoke">–</span>
      <label className="sr-only" htmlFor={`${idPrefix}-max`}>
        Maximum price
      </label>
      <input
        id={`${idPrefix}-max`}
        inputMode="numeric"
        value={max}
        onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
        placeholder="Max"
        className="input h-10 min-h-0 px-3 text-sm"
      />
      <button
        type="submit"
        className="h-10 rounded-[6px] bg-ink px-3 text-xs tracking-[0.14em] uppercase text-ivory hover:bg-basil"
      >
        Go
      </button>
    </form>
  );
}

export function FilterPanel({
  facets,
  collections,
  idPrefix = "f",
}: {
  facets: ShopFacets;
  collections: CollectionOption[];
  idPrefix?: string;
}) {
  const { filters, update } = useShop();

  return (
    <div className="text-ink">
      <FilterGroup title="Collection">
        <Option
          type="radio"
          name={`${idPrefix}-collection`}
          checked={!filters.collection}
          label="All perfumes"
          count={facets.total}
          onChange={() => update({ collection: null })}
        />
        {collections.map((c) => (
          <Option
            key={c.slug}
            type="radio"
            name={`${idPrefix}-collection`}
            checked={filters.collection === c.slug}
            label={c.name}
            count={facets.collections[c.slug] ?? 0}
            onChange={() => update({ collection: c.slug })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="For">
        {GENDERS.map((g) => (
          <Option
            key={g.value}
            type="checkbox"
            checked={filters.genders.includes(g.value)}
            label={g.label}
            count={facets.genders[g.value] ?? 0}
            onChange={() => update({ gender: toggleValue(filters.genders, g.value).join(",") })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Fragrance family">
        {FAMILIES.filter((f) => (facets.families[f.value] ?? 0) > 0).map((f) => (
          <Option
            key={f.value}
            type="checkbox"
            checked={filters.families.includes(f.value)}
            label={f.label}
            count={facets.families[f.value]}
            onChange={() => update({ family: toggleValue(filters.families, f.value).join(",") })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Concentration" defaultOpen={false}>
        {CONCENTRATIONS.filter((c) => (facets.concentrations[c] ?? 0) > 0).map((c) => (
          <Option
            key={c}
            type="checkbox"
            checked={filters.concentrations.includes(c)}
            label={c}
            count={facets.concentrations[c]}
            onChange={() => update({ concentration: toggleValue(filters.concentrations, c).join(",") })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {PRICE_RANGES.map((range) => {
          const checked = filters.min === range.min && filters.max === range.max;
          return (
            <Option
              key={range.label}
              type="radio"
              name={`${idPrefix}-price`}
              checked={checked}
              label={range.label}
              onChange={() =>
                update({ min: range.min?.toString() ?? null, max: range.max?.toString() ?? null })
              }
            />
          );
        })}
        <PriceInputs
          key={`${filters.min ?? ""}-${filters.max ?? ""}`}
          idPrefix={idPrefix}
          initialMin={filters.min}
          initialMax={filters.max}
          onApply={(min, max) => update({ min: min || null, max: max || null })}
        />
      </FilterGroup>

      <FilterGroup title="Offers">
        <Option
          type="checkbox"
          checked={filters.sale}
          label="On sale"
          count={facets.sale}
          onChange={() => update({ sale: filters.sale ? null : "1" })}
        />
        <Option
          type="checkbox"
          checked={filters.isNew}
          label="New arrivals"
          count={facets.isNew}
          onChange={() => update({ new: filters.isNew ? null : "1" })}
        />
      </FilterGroup>
    </div>
  );
}

/* --------------------------- Mobile drawer --------------------------- */

export function MobileFilters({
  facets,
  collections,
  total,
}: {
  facets: ShopFacets;
  collections: CollectionOption[];
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const { pending, filters } = useShop();
  useLockBody(open);
  useEscape(open, () => setOpen(false));

  const activeCount =
    (filters.collection ? 1 : 0) +
    filters.genders.length +
    filters.families.length +
    filters.concentrations.length +
    (filters.min !== undefined || filters.max !== undefined ? 1 : 0) +
    (filters.sale ? 1 : 0) +
    (filters.isNew ? 1 : 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-4 text-[0.72rem] tracking-[0.18em] uppercase lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-basil px-1 text-[0.62rem] text-ivory">
            {activeCount}
          </span>
        )}
      </button>
      <div
        className={cn("fixed inset-0 z-[55] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={cn("absolute inset-0 bg-ink/40 transition-opacity duration-500", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[90%] max-w-sm flex-col bg-ivory shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.21,1)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <p className="font-display text-2xl">Filters</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterPanel facets={facets} collections={collections} idPrefix="m" />
          </div>
          <div className="border-t border-ink/10 p-5">
            <button type="button" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : `Show ${total} ${total === 1 ? "result" : "results"}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ Sorting ----------------------------- */

export function SortSelect() {
  const { filters, update, pending } = useShop();
  return (
    <div className="flex items-center gap-3">
      {pending && <LoaderCircle className="h-4 w-4 animate-spin text-smoke" aria-label="Updating results" />}
      <label htmlFor="sort" className="hidden text-[0.7rem] tracking-[0.2em] uppercase text-smoke sm:block">
        Sort by
      </label>
      <select
        id="sort"
        value={filters.sort}
        onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}
        className="input h-11 min-h-0 w-auto rounded-full py-0 pl-4 text-sm"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* --------------------------- Active filters -------------------------- */

export function ActiveFilters({ collections }: { collections: CollectionOption[] }) {
  const { filters, update, clearAll } = useShop();
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.q) chips.push({ key: "q", label: `“${filters.q}”`, onRemove: () => update({ q: null }) });
  if (filters.collection) {
    const name = collections.find((c) => c.slug === filters.collection)?.name ?? filters.collection;
    chips.push({ key: "collection", label: name, onRemove: () => update({ collection: null }) });
  }
  for (const g of filters.genders) {
    chips.push({
      key: `g-${g}`,
      label: genderLabel(g),
      onRemove: () => update({ gender: filters.genders.filter((x) => x !== g).join(",") }),
    });
  }
  for (const f of filters.families) {
    chips.push({
      key: `f-${f}`,
      label: familyLabel(f),
      onRemove: () => update({ family: filters.families.filter((x) => x !== f).join(",") }),
    });
  }
  for (const c of filters.concentrations) {
    chips.push({
      key: `c-${c}`,
      label: c,
      onRemove: () => update({ concentration: filters.concentrations.filter((x) => x !== c).join(",") }),
    });
  }
  if (filters.min !== undefined || filters.max !== undefined) {
    const label =
      filters.min !== undefined && filters.max !== undefined
        ? `${formatEGP(filters.min)} – ${formatEGP(filters.max)}`
        : filters.min !== undefined
          ? `From ${formatEGP(filters.min)}`
          : `Up to ${formatEGP(filters.max ?? 0)}`;
    chips.push({ key: "price", label, onRemove: () => update({ min: null, max: null }) });
  }
  if (filters.sale) chips.push({ key: "sale", label: "On sale", onRemove: () => update({ sale: null }) });
  if (filters.isNew) chips.push({ key: "new", label: "New arrivals", onRemove: () => update({ new: null }) });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex animate-fade-in items-center gap-1.5 rounded-full bg-cream py-1.5 pl-3.5 pr-2.5 text-xs transition-colors hover:bg-sand"
          aria-label={`Remove filter ${chip.label}`}
        >
          {chip.label}
          <X className="h-3.5 w-3.5 text-smoke" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="ml-1 text-xs tracking-[0.14em] uppercase text-smoke underline-offset-4 hover:text-ink hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
