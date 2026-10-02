import {
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_FEE,
  GREATER_CAIRO,
  PROMO_CODES,
  SHIPPING_METHODS,
  type ShippingMethod,
} from "./constants";

export type PromoEvaluation =
  | { ok: true; code: string; discount: number; label: string }
  | { ok: false; code: string; error: string };

export function evaluatePromo(rawCode: string, subtotal: number): PromoEvaluation {
  const code = rawCode.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  if (!promo) return { ok: false, code, error: "This code isn't valid." };
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return {
      ok: false,
      code,
      error: `Spend EGP ${promo.minSubtotal.toLocaleString("en-US")} or more to use this code.`,
    };
  }
  const discount =
    promo.type === "percent" ? Math.round((subtotal * promo.value) / 100) : Math.min(promo.value, subtotal);
  return { ok: true, code, discount, label: promo.label };
}

export function isGreaterCairo(governorate: string) {
  return GREATER_CAIRO.includes(governorate);
}

/** Returns the delivery fee, or null if the method isn't available for that governorate. */
export function shippingFee(method: ShippingMethod, governorate: string, subtotal: number): number | null {
  const config = SHIPPING_METHODS[method];
  const greaterCairo = isGreaterCairo(governorate);
  if (method === "express" && governorate && !greaterCairo) return null;
  if (config.freeEligible && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return greaterCairo || !governorate ? config.greaterCairoFee : config.otherFee;
}

export type TotalsInput = {
  subtotal: number;
  shippingMethod: ShippingMethod;
  governorate: string;
  promoCode?: string | null;
  giftWrap?: boolean;
};

export function computeTotals(input: TotalsInput) {
  const promo = input.promoCode ? evaluatePromo(input.promoCode, input.subtotal) : null;
  const discount = promo && promo.ok ? promo.discount : 0;
  const fee = shippingFee(input.shippingMethod, input.governorate, input.subtotal);
  const shipping = fee ?? 0;
  const giftWrapFee = input.giftWrap ? GIFT_WRAP_FEE : 0;
  const total = Math.max(0, input.subtotal - discount) + shipping + giftWrapFee;
  return {
    subtotal: input.subtotal,
    discount,
    shipping,
    shippingAvailable: fee !== null,
    giftWrapFee,
    total,
    promo,
  };
}
