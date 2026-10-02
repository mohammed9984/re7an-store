"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Banknote,
  ChevronDown,
  CreditCard,
  Gift,
  LoaderCircle,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Tag,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { placeOrder } from "@/app/actions";
import { selectSubtotal, useCart, type CartItem } from "@/lib/cart-store";
import {
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_FEE,
  GOVERNORATES,
  PAYMENT_METHODS,
  PROMO_CODES,
  SHIPPING_METHODS,
  type PaymentMethod,
  type ShippingMethod,
} from "@/lib/constants";
import { computeTotals, evaluatePromo, isGreaterCairo, shippingFee } from "@/lib/pricing";
import { addBusinessDays, cn, formatEGP, formatShortDate } from "@/lib/utils";

const DETAILS_KEY = "re7an-checkout-details";
const PHONE_RE = /^(\+?20|0)?1[0125]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIELD_ORDER = ["customerName", "phone", "email", "governorate", "city", "address"] as const;
const SAVED_FIELDS = ["customerName", "phone", "email", "governorate", "city", "address", "apartment", "landmark"] as const;

type FormState = {
  customerName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  address: string;
  apartment: string;
  landmark: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  giftWrap: boolean;
  giftMessage: string;
  notes: string;
};

const EMPTY: FormState = {
  customerName: "",
  phone: "",
  email: "",
  governorate: "",
  city: "",
  address: "",
  apartment: "",
  landmark: "",
  shippingMethod: "standard",
  paymentMethod: "cod",
  giftWrap: false,
  giftMessage: "",
  notes: "",
};

const PAYMENT_ICONS: Record<PaymentMethod, ReactNode> = {
  cod: <Banknote className="h-5 w-5 text-gold" strokeWidth={1.4} />,
  card_on_delivery: <CreditCard className="h-5 w-5 text-gold" strokeWidth={1.4} />,
  instapay: <Smartphone className="h-5 w-5 text-gold" strokeWidth={1.4} />,
};

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="border-b border-ink/10 py-8 first:pt-0">
      <h2 className="flex items-center gap-3 font-display text-[1.7rem] leading-none">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-basil font-sans text-xs text-ivory">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="normal-case tracking-normal text-smoke/70">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}

function RadioCard({
  name,
  checked,
  onChange,
  disabled,
  title,
  description,
  right,
  icon,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  title: string;
  description: string;
  right?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative flex gap-4 rounded-[6px] border p-4 transition-all duration-300",
        checked ? "border-basil bg-basil/[0.04] ring-1 ring-basil" : "border-ink/15 bg-white hover:border-ink/40",
        disabled && "cursor-not-allowed opacity-50 hover:border-ink/15",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-gold",
          checked ? "border-basil" : "border-ink/30",
        )}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-basil" />}
      </span>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <span className="flex-1">
        <span className="flex items-start justify-between gap-3 text-sm font-medium">
          <span>{title}</span>
          {right}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-smoke">{description}</span>
      </span>
    </label>
  );
}

function SummaryLines({ items, onRemove }: { items: CartItem[]; onRemove: (variantId: number) => void }) {
  return (
    <ul className="divide-y divide-ink/10">
      {items.map((item) => (
        <li key={item.variantId} className="flex items-center gap-4 py-4">
          <div className="relative h-20 w-16 shrink-0 rounded-[3px] bg-cream">
            <Image src={item.image} alt={item.name} fill sizes="64px" className="rounded-[3px] object-cover" />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[0.65rem] text-ivory">
              {item.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg leading-tight">{item.name}</p>
            <p className="text-xs text-smoke">{item.size}</p>
            <button
              type="button"
              onClick={() => onRemove(item.variantId)}
              className="mt-1 text-[0.68rem] tracking-[0.14em] uppercase text-smoke hover:text-terracotta"
            >
              Remove
            </button>
          </div>
          <span className="text-sm font-medium">{formatEGP(item.price * item.quantity)}</span>
        </li>
      ))}
    </ul>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);
  const removeItem = useCart((s) => s.removeItem);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DETAILS_KEY) ?? "null") as Record<string, unknown> | null;
      if (!saved || typeof saved !== "object") return;
      const restored: Partial<FormState> = {};
      for (const key of SAVED_FIELDS) {
        if (typeof saved[key] === "string") restored[key] = saved[key] as string;
      }
      setForm((f) => ({ ...f, ...restored }));
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  const totals = computeTotals({
    subtotal,
    shippingMethod: form.shippingMethod,
    governorate: form.governorate,
    promoCode,
    giftWrap: form.giftWrap,
  });
  const greaterCairo = isGreaterCairo(form.governorate);
  const expressAvailable = !form.governorate || greaterCairo;
  const promoInvalid = totals.promo && !totals.promo.ok ? totals.promo.error : null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "governorate" && next.shippingMethod === "express" && !isGreaterCairo(String(value))) {
        next.shippingMethod = "standard";
      }
      return next;
    });
    if (errors[key]) {
      setErrors((e) => {
        const rest = { ...e };
        delete rest[key];
        return rest;
      });
    }
  }

  function applyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    const result = evaluatePromo(code, subtotal);
    if (result.ok) {
      setPromoCode(result.code);
      setPromoMessage(null);
      setPromoInput("");
    } else {
      setPromoMessage(result.error);
    }
  }

  function validate() {
    const found: Record<string, string> = {};
    if (form.customerName.trim().length < 3) found.customerName = "Please enter your full name.";
    if (!PHONE_RE.test(form.phone.replace(/[\s()-]/g, "")))
      found.phone = "Enter a valid Egyptian mobile number, e.g. 010 1234 5678.";
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) found.email = "Enter a valid email address.";
    if (!form.governorate) found.governorate = "Please choose your governorate.";
    if (form.city.trim().length < 2) found.city = "Enter your city or area.";
    if (form.address.trim().length < 5) found.address = "Enter your street address.";
    return found;
  }

  function focusFirst(found: Record<string, string>) {
    const first = FIELD_ORDER.find((key) => found[key]);
    if (!first) return;
    const el = document.getElementById(first);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirst(found);
      return;
    }
    if (!totals.shippingAvailable) {
      setFormError("Express delivery is only available in Cairo & Giza.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await placeOrder({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        ...form,
        promoCode: promoInvalid ? "" : (promoCode ?? ""),
      });
      if (result.ok) {
        try {
          const details = Object.fromEntries(SAVED_FIELDS.map((key) => [key, form[key]]));
          localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
        } catch {
          /* storage unavailable */
        }
        setPlaced(true);
        router.push(`/order/${result.orderNumber}`);
        clear();
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.error);
      if (result.fieldErrors) focusFirst(result.fieldErrors);
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]" aria-busy="true">
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-12 rounded-[6px]" />
          ))}
        </div>
        <div className="skeleton hidden h-96 rounded-[6px] lg:block" />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="flex flex-col items-center py-28 text-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-basil" strokeWidth={1.3} />
        <p className="mt-6 font-display text-3xl font-light">Confirming your order…</p>
        <p className="mt-2 text-smoke">Just a moment while we prepare your confirmation.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <ShoppingBag className="h-8 w-8 text-gold" strokeWidth={1.2} />
        </span>
        <h1 className="mt-6 font-display text-4xl font-light">Your bag is empty</h1>
        <p className="mt-2 max-w-sm text-smoke">Add a fragrance or two and come back to check out.</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Explore the collection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const standardEta = greaterCairo || !form.governorate
    ? `${formatShortDate(addBusinessDays(now, 1))} – ${formatShortDate(addBusinessDays(now, 2))}`
    : `${formatShortDate(addBusinessDays(now, 2))} – ${formatShortDate(addBusinessDays(now, 4))}`;
  const expressEta = formatShortDate(addBusinessDays(now, 1));
  const standardFee = shippingFee("standard", form.governorate, subtotal) ?? 0;
  const expressFee = SHIPPING_METHODS.express.greaterCairoFee;

  const summary = (
    <div className="rounded-[6px] border border-ink/10 bg-white p-6">
      <SummaryLines items={items} onRemove={removeItem} />

      <div className="border-t border-ink/10 pt-5">
        {promoCode && !promoInvalid ? (
          <div className="flex items-center justify-between rounded-[6px] bg-basil/[0.06] px-4 py-3 text-sm">
            <span className="flex items-center gap-2 text-basil">
              <Tag className="h-4 w-4" strokeWidth={1.5} />
              <span className="font-medium">{promoCode}</span>
              <span className="text-xs text-smoke">{PROMO_CODES[promoCode]?.label}</span>
            </span>
            <button
              type="button"
              onClick={() => setPromoCode(null)}
              aria-label="Remove promo code"
              className="rounded-full p-1 text-smoke hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div>
            <label htmlFor="promo" className="field-label">
              Promo code
            </label>
            <div className="flex gap-2">
              <input
                id="promo"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value.toUpperCase());
                  setPromoMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPromo();
                  }
                }}
                placeholder="e.g. WELCOME10"
                className="input uppercase"
                aria-invalid={!!(promoMessage || promoInvalid)}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="shrink-0 rounded-[6px] bg-ink px-5 text-xs tracking-[0.16em] uppercase text-ivory transition-colors hover:bg-basil"
              >
                Apply
              </button>
            </div>
            {(promoMessage || promoInvalid) && (
              <p className="mt-1.5 text-xs text-terracotta">{promoMessage ?? promoInvalid}</p>
            )}
          </div>
        )}
      </div>

      <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-smoke">Subtotal</dt>
          <dd>{formatEGP(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-basil">
            <dt>Discount ({promoCode})</dt>
            <dd>−{formatEGP(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-smoke">Delivery</dt>
          <dd>
            {!totals.shippingAvailable
              ? "Unavailable"
              : totals.shipping === 0
                ? <span className="text-basil">Free</span>
                : formatEGP(totals.shipping)}
          </dd>
        </div>
        {totals.giftWrapFee > 0 && (
          <div className="flex justify-between">
            <dt className="text-smoke">Gift wrapping</dt>
            <dd>{formatEGP(totals.giftWrapFee)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
          <dt className="text-xs tracking-[0.2em] uppercase">Total</dt>
          <dd className="font-display text-3xl">{formatEGP(totals.total)}</dd>
        </div>
        <p className="text-xs text-smoke">Prices include VAT. Pay when your order arrives.</p>
      </dl>

      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="mt-4 flex items-center gap-2 rounded-[6px] bg-cream px-4 py-3 text-xs">
          <Truck className="h-4 w-4 shrink-0 text-basil" strokeWidth={1.5} />
          Add {formatEGP(FREE_SHIPPING_THRESHOLD - subtotal)} more for free standard delivery.
        </p>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-14">
      {/* Mobile summary toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-[6px] border border-ink/10 bg-white px-5 py-4"
          aria-expanded={summaryOpen}
        >
          <span className="flex items-center gap-2 text-sm">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            {summaryOpen ? "Hide" : "Show"} order summary
            <ChevronDown className={cn("h-4 w-4 transition-transform", summaryOpen && "rotate-180")} />
          </span>
          <span className="font-display text-xl">{formatEGP(totals.total)}</span>
        </button>
        {summaryOpen && <div className="mt-3 animate-fade-in">{summary}</div>}
      </div>

      <form id="checkout-form" onSubmit={submit} noValidate className="min-w-0">
        {formError && (
          <div role="alert" className="mb-8 rounded-[6px] border border-terracotta/30 bg-terracotta/5 px-5 py-4 text-sm text-terracotta">
            {formError}
          </div>
        )}

        <Section step={1} title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="customerName" label="Full name" error={errors.customerName} className="sm:col-span-2">
              <input
                id="customerName"
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                autoComplete="name"
                placeholder="e.g. Nour Hassan"
                className="input"
                aria-invalid={!!errors.customerName}
                aria-describedby={errors.customerName ? "customerName-error" : undefined}
              />
            </Field>
            <Field id="phone" label="Mobile number" error={errors.phone}>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-smoke">🇪🇬</span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  autoComplete="tel"
                  placeholder="010 1234 5678"
                  className="input pl-11"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
            </Field>
            <Field id="email" label="Email" optional error={errors.email}>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                placeholder="For your receipt"
                className="input"
                aria-invalid={!!errors.email}
              />
            </Field>
          </div>
          <p className="mt-3 text-xs text-smoke">Our courier will call this number before delivery.</p>
        </Section>

        <Section step={2} title="Delivery address">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="governorate" label="Governorate" error={errors.governorate}>
              <select
                id="governorate"
                value={form.governorate}
                onChange={(e) => update("governorate", e.target.value)}
                className="input"
                aria-invalid={!!errors.governorate}
                autoComplete="address-level1"
              >
                <option value="">Select governorate</option>
                {GOVERNORATES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.value} — {g.arabic}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="city" label="City / area" error={errors.city}>
              <input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                autoComplete="address-level2"
                placeholder="e.g. Maadi, Smouha, New Cairo"
                className="input"
                aria-invalid={!!errors.city}
              />
            </Field>
            <Field id="address" label="Street address" error={errors.address} className="sm:col-span-2">
              <input
                id="address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                autoComplete="street-address"
                placeholder="Building number and street name"
                className="input"
                aria-invalid={!!errors.address}
              />
            </Field>
            <Field id="apartment" label="Floor / apartment" optional>
              <input
                id="apartment"
                value={form.apartment}
                onChange={(e) => update("apartment", e.target.value)}
                placeholder="e.g. Floor 4, Apt 12"
                className="input"
              />
            </Field>
            <Field id="landmark" label="Nearest landmark" optional>
              <input
                id="landmark"
                value={form.landmark}
                onChange={(e) => update("landmark", e.target.value)}
                placeholder="e.g. Behind City Stars"
                className="input"
              />
            </Field>
          </div>
        </Section>

        <Section step={3} title="Delivery method">
          <div className="grid gap-3">
            <RadioCard
              name="shipping"
              checked={form.shippingMethod === "standard"}
              onChange={() => update("shippingMethod", "standard")}
              icon={<Truck className="h-5 w-5 text-gold" strokeWidth={1.4} />}
              title={SHIPPING_METHODS.standard.label}
              description={`${SHIPPING_METHODS.standard.description} · Estimated ${standardEta}`}
              right={
                <span className={cn(standardFee === 0 && "text-basil")}>
                  {standardFee === 0 ? "Free" : formatEGP(standardFee)}
                </span>
              }
            />
            <RadioCard
              name="shipping"
              checked={form.shippingMethod === "express"}
              onChange={() => update("shippingMethod", "express")}
              disabled={!expressAvailable}
              icon={<Zap className="h-5 w-5 text-gold" strokeWidth={1.4} />}
              title={SHIPPING_METHODS.express.label}
              description={
                expressAvailable
                  ? `${SHIPPING_METHODS.express.description} · Arrives ${expressEta}`
                  : "Only available for Cairo & Giza addresses"
              }
              right={<span>{formatEGP(expressFee)}</span>}
            />
          </div>
        </Section>

        <Section step={4} title="Payment">
          <div className="grid gap-3">
            {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((method) => (
              <RadioCard
                key={method}
                name="payment"
                checked={form.paymentMethod === method}
                onChange={() => update("paymentMethod", method)}
                icon={PAYMENT_ICONS[method]}
                title={PAYMENT_METHODS[method].label}
                description={PAYMENT_METHODS[method].description}
                right={method === "cod" ? <span className="text-xs text-basil">Most popular</span> : undefined}
              />
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-smoke">
            <Lock className="h-3.5 w-3.5" /> We never ask for card details online — you pay only when your order arrives.
          </p>
        </Section>

        <Section step={5} title="Finishing touches">
          <label className="flex cursor-pointer items-start gap-4 rounded-[6px] border border-ink/15 bg-white p-4 transition-colors hover:border-ink/40">
            <input
              type="checkbox"
              checked={form.giftWrap}
              onChange={(e) => update("giftWrap", e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-basil)]"
            />
            <Gift className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
            <span className="flex-1 text-sm">
              <span className="flex justify-between font-medium">
                Luxury gift wrapping <span>+{formatEGP(GIFT_WRAP_FEE)}</span>
              </span>
              <span className="mt-1 block text-xs text-smoke">
                Cream & gold box, satin ribbon and a handwritten card. Prices are hidden from the parcel.
              </span>
            </span>
          </label>
          {form.giftWrap && (
            <div className="mt-4 animate-fade-in">
              <label htmlFor="giftMessage" className="field-label">
                Gift message
              </label>
              <textarea
                id="giftMessage"
                rows={3}
                maxLength={300}
                value={form.giftMessage}
                onChange={(e) => update("giftMessage", e.target.value)}
                placeholder="Kol sana wenty tayeba ✨ — we'll handwrite it for you"
                className="input resize-none"
              />
              <p className="mt-1 text-right text-xs text-smoke">{form.giftMessage.length}/300</p>
            </div>
          )}
          <div className="mt-5">
            <label htmlFor="notes" className="field-label">
              Delivery notes <span className="normal-case tracking-normal text-smoke/70">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={2}
              maxLength={500}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="e.g. Please call before arriving, deliver after 5pm"
              className="input resize-none"
            />
          </div>
        </Section>

        <div className="pt-8">
          <button type="submit" disabled={submitting} className="btn btn-primary w-full text-[0.78rem]">
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" /> Placing your order…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Place order · {formatEGP(totals.total)}
              </>
            )}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-smoke">
            <ShieldCheck className="h-4 w-4 text-basil" strokeWidth={1.5} />
            By placing your order you agree to our delivery & returns policy.
          </p>
        </div>
      </form>

      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <p className="mb-4 font-display text-2xl">Order summary</p>
          {summary}
          <ul className="mt-6 space-y-3 text-xs text-smoke">
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold" strokeWidth={1.4} /> Delivered to all 27 governorates
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" strokeWidth={1.4} /> 14-day returns · 100% authentic
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
