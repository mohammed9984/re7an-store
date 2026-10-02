import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-10">
        <p className="eyebrow text-gold">Almost yours</p>
        <h1 className="mt-2 font-display text-5xl font-light">Checkout</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
