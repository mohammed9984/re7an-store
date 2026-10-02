import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Gift, MapPin, MessageCircle, Package, Sparkles, Truck } from "lucide-react";
import { PAYMENT_METHODS, SHIPPING_METHODS, SITE, type PaymentMethod, type ShippingMethod } from "@/lib/constants";
import { isGreaterCairo } from "@/lib/pricing";
import { getOrderByNumber } from "@/lib/queries";
import { addBusinessDays, formatDate, formatEGP, formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type OrderPageProps = { params: Promise<{ orderNumber: string }> };

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(decodeURIComponent(orderNumber));
  if (!order) notFound();

  const placedAt = new Date(order.createdAt);
  const express = order.shippingMethod === "express";
  const greaterCairo = isGreaterCairo(order.governorate);
  const eta = express
    ? formatShortDate(addBusinessDays(placedAt, 1))
    : greaterCairo
      ? `${formatShortDate(addBusinessDays(placedAt, 1))} – ${formatShortDate(addBusinessDays(placedAt, 2))}`
      : `${formatShortDate(addBusinessDays(placedAt, 2))} – ${formatShortDate(addBusinessDays(placedAt, 4))}`;
  const firstName = order.customerName.split(" ")[0];
  const payment = PAYMENT_METHODS[order.paymentMethod as PaymentMethod];
  const shipping = SHIPPING_METHODS[order.shippingMethod as ShippingMethod];
  const whatsappText = encodeURIComponent(`Hi Re7an! I have a question about my order ${order.orderNumber}.`);
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  const steps = [
    { icon: Sparkles, title: "Order confirmed", text: `Placed ${formatDate(placedAt)}` },
    {
      icon: Gift,
      title: "Prepared at our atelier",
      text: order.giftWrapFee > 0 ? "Hand-wrapped with your gift note" : "Packed with care within 24 hours",
    },
    { icon: Truck, title: "Out for delivery", text: "Our courier will call before arriving" },
    { icon: Package, title: "Delivered", text: `Estimated ${eta}` },
  ];

  return (
    <div className="bg-ivory">
      <section className="border-b border-ink/10 bg-cream">
        <div className="shell flex flex-col items-center py-16 text-center md:py-20">
          <span className="flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-basil text-ivory shadow-[0_20px_40px_-18px_rgba(27,47,38,0.8)]">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" className="animate-draw" />
            </svg>
          </span>
          <p className="mt-8 font-arabic text-2xl text-gold" lang="ar" dir="rtl">
            شكرًا لك
          </p>
          <h1 className="mt-2 animate-fade-up font-display text-5xl font-light md:text-6xl">Thank you, {firstName}!</h1>
          <p className="mt-4 max-w-lg animate-fade-up text-smoke [animation-delay:150ms]">
            Your order <strong className="font-medium text-ink">{order.orderNumber}</strong> is confirmed. We&apos;ll send
            updates to <strong className="font-medium text-ink">{order.phone}</strong>
            {order.email ? ` and ${order.email}` : ""}.
          </p>
          <p className="mt-6 inline-flex animate-fade-up items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm [animation-delay:300ms]">
            <Truck className="h-4 w-4 text-basil" strokeWidth={1.5} /> Estimated delivery: <strong className="font-medium">{eta}</strong>
          </p>
        </div>
      </section>

      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="space-y-10">
          {order.paymentMethod === "instapay" && (
            <div className="rounded-[6px] border border-gold/40 bg-gold/5 p-6">
              <p className="eyebrow text-gold">Action needed · complete your payment</p>
              <p className="mt-3 font-display text-2xl">Transfer {formatEGP(order.total)}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-smoke">InstaPay</dt>
                  <dd className="font-medium">{SITE.instapay}</dd>
                </div>
                <div>
                  <dt className="text-smoke">Vodafone Cash</dt>
                  <dd className="font-medium">{SITE.wallet}</dd>
                </div>
                <div>
                  <dt className="text-smoke">Reference</dt>
                  <dd className="font-medium">{order.orderNumber}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-smoke">
                Send a screenshot on WhatsApp after transferring — we ship as soon as payment is confirmed (usually within an hour).
              </p>
            </div>
          )}
          {order.paymentMethod !== "instapay" && (
            <div className="rounded-[6px] border border-ink/10 bg-white p-6">
              <p className="eyebrow text-gold">Payment on delivery</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed">
                {order.paymentMethod === "cod" ? (
                  <>
                    Please have <strong className="font-medium">{formatEGP(order.total)}</strong> ready in cash when your
                    order arrives.
                  </>
                ) : (
                  <>
                    Our courier will bring a POS machine — pay <strong className="font-medium">{formatEGP(order.total)}</strong>{" "}
                    by Visa, Mastercard or Meeza.
                  </>
                )}
              </p>
            </div>
          )}

          <div>
            <h2 className="font-display text-3xl font-light">What happens next</h2>
            <ol className="mt-6 space-y-0">
              {steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < steps.length - 1 && <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-ink/10" />}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-basil text-ivory" : "bg-cream text-basil"}`}
                  >
                    <step.icon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div className="pt-1.5">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-smoke">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[6px] border border-ink/10 bg-white p-6">
              <p className="flex items-center gap-2 eyebrow text-gold">
                <MapPin className="h-3.5 w-3.5" /> Delivering to
              </p>
              <p className="mt-3 font-medium">{order.customerName}</p>
              <p className="mt-1 text-sm leading-relaxed text-smoke">
                {order.address}
                {order.apartment ? `, ${order.apartment}` : ""}
                <br />
                {order.city}, {order.governorate}
                {order.landmark ? (
                  <>
                    <br />
                    Near {order.landmark}
                  </>
                ) : null}
              </p>
            </div>
            <div className="rounded-[6px] border border-ink/10 bg-white p-6">
              <p className="eyebrow text-gold">Details</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-smoke">Delivery</dt>
                  <dd className="text-right">{shipping?.label ?? order.shippingMethod}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-smoke">Payment</dt>
                  <dd className="text-right">{payment?.label ?? order.paymentMethod}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-smoke">Status</dt>
                  <dd className="text-right capitalize">{order.status.replace("_", " ")}</dd>
                </div>
              </dl>
            </div>
          </div>

          {order.giftMessage && (
            <div className="rounded-[6px] bg-blush p-6">
              <p className="flex items-center gap-2 eyebrow text-gold">
                <Gift className="h-3.5 w-3.5" /> Your gift note
              </p>
              <p className="mt-3 font-display text-xl leading-relaxed italic">“{order.giftMessage}”</p>
            </div>
          )}
        </div>

        <aside>
          <div className="rounded-[6px] border border-ink/10 bg-white p-6 lg:sticky lg:top-36">
            <p className="font-display text-2xl">
              Your order <span className="text-base text-smoke">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
            </p>
            <ul className="mt-4 divide-y divide-ink/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[3px] bg-cream">
                    {item.image && <Image src={item.image} alt={item.productName} fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.productSlug}`} className="font-display text-lg leading-tight hover:text-basil">
                      {item.productName}
                    </Link>
                    <p className="text-xs text-smoke">
                      {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatEGP(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd>{formatEGP(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-basil">
                  <dt>Discount{order.promoCode ? ` (${order.promoCode})` : ""}</dt>
                  <dd>−{formatEGP(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-smoke">Delivery</dt>
                <dd>{order.shippingFee === 0 ? "Free" : formatEGP(order.shippingFee)}</dd>
              </div>
              {order.giftWrapFee > 0 && (
                <div className="flex justify-between">
                  <dt className="text-smoke">Gift wrapping</dt>
                  <dd>{formatEGP(order.giftWrapFee)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
                <dt className="text-xs tracking-[0.2em] uppercase">Total</dt>
                <dd className="font-display text-3xl">{formatEGP(order.total)}</dd>
              </div>
            </dl>
            <div className="mt-6 grid gap-3">
              <Link href="/shop" className="btn btn-primary w-full">
                Continue shopping <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline w-full"
              >
                <MessageCircle className="h-4 w-4" /> Questions? WhatsApp us
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
