import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { Logo } from "@/components/ui/primitives";
import { SITE } from "@/lib/constants";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <header className="border-b border-ink/10 bg-ivory">
        <div className="shell grid h-20 grid-cols-[1fr_auto_1fr] items-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.18em] uppercase text-smoke hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Continue shopping</span>
          </Link>
          <Link href="/" aria-label="Re7an — home">
            <Logo />
          </Link>
          <p className="flex items-center justify-end gap-2 text-[0.7rem] tracking-[0.18em] uppercase text-smoke">
            <Lock className="h-4 w-4 text-basil" /> <span className="hidden sm:inline">Secure checkout</span>
          </p>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-ink/10">
        <div className="shell flex flex-col items-center justify-between gap-2 py-6 text-xs text-smoke sm:flex-row">
          <p>© {new Date().getFullYear()} Re7an Perfumes · Cairo, Egypt</p>
          <p>
            Need help?{" "}
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="text-ink underline underline-offset-4">
              WhatsApp {SITE.phone}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
