export const SITE = {
  name: "Re7an",
  arabicName: "ريحان",
  tagline: "Perfumes crafted in Cairo, for every generation",
  phone: "+20 100 737 2626",
  whatsapp: "201007372626",
  email: "hello@re7an.com",
  instapay: "re7an@instapay",
  wallet: "010 0737 2626",
  boutique: "14 Brazil St, Zamalek, Cairo",
  hours: "Daily 11:00 – 23:00",
} as const;

export const FREE_SHIPPING_THRESHOLD = 1500;
export const GIFT_WRAP_FEE = 75;

export const GOVERNORATES = [
  { value: "Cairo", arabic: "القاهرة" },
  { value: "Giza", arabic: "الجيزة" },
  { value: "Alexandria", arabic: "الإسكندرية" },
  { value: "Qalyubia", arabic: "القليوبية" },
  { value: "Dakahlia", arabic: "الدقهلية" },
  { value: "Sharqia", arabic: "الشرقية" },
  { value: "Gharbia", arabic: "الغربية" },
  { value: "Monufia", arabic: "المنوفية" },
  { value: "Beheira", arabic: "البحيرة" },
  { value: "Kafr El Sheikh", arabic: "كفر الشيخ" },
  { value: "Damietta", arabic: "دمياط" },
  { value: "Port Said", arabic: "بورسعيد" },
  { value: "Ismailia", arabic: "الإسماعيلية" },
  { value: "Suez", arabic: "السويس" },
  { value: "Faiyum", arabic: "الفيوم" },
  { value: "Beni Suef", arabic: "بني سويف" },
  { value: "Minya", arabic: "المنيا" },
  { value: "Asyut", arabic: "أسيوط" },
  { value: "Sohag", arabic: "سوهاج" },
  { value: "Qena", arabic: "قنا" },
  { value: "Luxor", arabic: "الأقصر" },
  { value: "Aswan", arabic: "أسوان" },
  { value: "Red Sea", arabic: "البحر الأحمر" },
  { value: "New Valley", arabic: "الوادي الجديد" },
  { value: "Matrouh", arabic: "مطروح" },
  { value: "North Sinai", arabic: "شمال سيناء" },
  { value: "South Sinai", arabic: "جنوب سيناء" },
] as const;

export const GOVERNORATE_VALUES = GOVERNORATES.map((g) => g.value) as string[];
export const GREATER_CAIRO = ["Cairo", "Giza"];

export type ShippingMethod = "standard" | "express";
export type PaymentMethod = "cod" | "card_on_delivery" | "instapay";

export const SHIPPING_METHODS: Record<
  ShippingMethod,
  { label: string; description: string; greaterCairoFee: number; otherFee: number; freeEligible: boolean }
> = {
  standard: {
    label: "Standard delivery",
    description: "1–2 business days in Cairo & Giza · 2–4 days elsewhere",
    greaterCairoFee: 65,
    otherFee: 85,
    freeEligible: true,
  },
  express: {
    label: "Express next-day",
    description: "Next business day · Cairo & Giza only",
    greaterCairoFee: 120,
    otherFee: 120,
    freeEligible: false,
  },
};

export const PAYMENT_METHODS: Record<PaymentMethod, { label: string; description: string }> = {
  cod: {
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives. No extra fees.",
  },
  card_on_delivery: {
    label: "Card on delivery",
    description: "Our courier carries a POS machine — Visa, Mastercard & Meeza accepted.",
  },
  instapay: {
    label: "InstaPay / Mobile wallet",
    description: "Transfer via InstaPay or Vodafone Cash. Instructions follow your order.",
  },
};

export type PromoDefinition = {
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  label: string;
};

export const PROMO_CODES: Record<string, PromoDefinition> = {
  WELCOME10: { type: "percent", value: 10, label: "10% off — welcome to Re7an" },
  RE7AN15: { type: "percent", value: 15, minSubtotal: 2500, label: "15% off orders over EGP 2,500" },
  EID200: { type: "fixed", value: 200, minSubtotal: 1500, label: "EGP 200 off orders over EGP 1,500" },
};

export const GENDERS = [
  { value: "women", label: "For Her" },
  { value: "men", label: "For Him" },
  { value: "unisex", label: "Unisex" },
  { value: "kids", label: "Kids & Teens" },
] as const;

export const FAMILIES = [
  { value: "floral", label: "Floral", arabic: "زهري", description: "Rose, jasmine & blossoms" },
  { value: "woody", label: "Woody", arabic: "خشبي", description: "Cedar, vetiver & sandalwood" },
  { value: "oriental", label: "Oriental", arabic: "شرقي", description: "Spice, incense & resins" },
  { value: "oud", label: "Oud", arabic: "عود", description: "Precious agarwood" },
  { value: "amber", label: "Amber", arabic: "عنبر", description: "Warm, golden & glowing" },
  { value: "fresh", label: "Fresh", arabic: "منعش", description: "Citrus, herbs & green notes" },
  { value: "aquatic", label: "Aquatic", arabic: "بحري", description: "Sea salt & cool breezes" },
  { value: "gourmand", label: "Gourmand", arabic: "حلو", description: "Vanilla, praline & fruit" },
  { value: "musky", label: "Musky", arabic: "مسك", description: "Clean skin & soft musks" },
] as const;

export const CONCENTRATIONS = [
  "Extrait de Parfum",
  "Parfum",
  "Eau de Parfum",
  "Eau de Toilette",
  "Perfume Oil",
  "Body Mist",
  "Gift Set",
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestselling", label: "Best selling" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PRICE_RANGES = [
  { label: "Under EGP 800", min: undefined, max: 799 },
  { label: "EGP 800 – 1,200", min: 800, max: 1200 },
  { label: "EGP 1,200 – 2,000", min: 1200, max: 2000 },
  { label: "EGP 2,000 & above", min: 2000, max: undefined },
] as const;

export function familyLabel(value: string) {
  return FAMILIES.find((f) => f.value === value)?.label ?? value.charAt(0).toUpperCase() + value.slice(1);
}

export function genderLabel(value: string) {
  return GENDERS.find((g) => g.value === value)?.label ?? value;
}
