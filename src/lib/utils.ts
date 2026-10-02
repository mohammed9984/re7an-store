export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function formatEGP(amount: number) {
  return `EGP ${numberFormat.format(Math.round(amount))}`;
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

const CAIRO_TZ = "Africa/Cairo";

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: CAIRO_TZ,
  }).format(new Date(value));
}

function cairoWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: CAIRO_TZ }).format(date);
}

/** Adds business days, skipping Fridays (no courier deliveries in Egypt on Fridays). */
export function addBusinessDays(from: Date, days: number) {
  const date = new Date(from.getTime());
  let added = 0;
  while (added < days) {
    date.setTime(date.getTime() + 86_400_000);
    if (cairoWeekday(date) !== "Fri") added += 1;
  }
  return date;
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: CAIRO_TZ,
  }).format(date);
}

export function deliveryWindow(minDays: number, maxDays: number, from = new Date()) {
  return `${formatShortDate(addBusinessDays(from, minDays))} – ${formatShortDate(
    addBusinessDays(from, maxDays),
  )}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
