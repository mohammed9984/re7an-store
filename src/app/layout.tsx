import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, Cormorant_Garamond, Jost } from "next/font/google";
import type { ReactNode } from "react";
import { StoreHydrator } from "@/components/StoreHydrator";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Re7an — Luxury Perfumes Crafted in Cairo",
    template: "%s · Re7an Perfumes",
  },
  description:
    "Long-lasting perfumes, oud and attars crafted in Cairo for women, men, teens and kids. Cash on delivery and free delivery across Egypt on orders over EGP 1,500.",
  keywords: [
    "perfume Egypt",
    "عطور",
    "oud",
    "Cairo perfume",
    "Re7an",
    "ريحان",
    "attar",
    "cash on delivery perfume",
  ],
  openGraph: {
    type: "website",
    siteName: "Re7an Perfumes",
    locale: "en_EG",
    title: "Re7an — Luxury Perfumes Crafted in Cairo",
    description: "Perfumes for every generation, crafted in Cairo. Delivered across all 27 governorates.",
    images: [{ url: "/images/hero.jpg", width: 1792, height: 1008, alt: "Re7an perfume on the Nile at dusk" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1b2f26",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${arefRuqaa.variable}`}>
      <body className="min-h-dvh bg-ivory font-sans text-[15px] text-ink antialiased">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
