import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LeafMark } from "@/components/ui/primitives";

export function NotFoundContent() {
  return (
    <section className="shell flex flex-col items-center py-28 text-center md:py-36">
      <LeafMark className="h-12 w-12 animate-fade-in text-gold" />
      <p className="mt-6 font-display text-[7rem] font-light leading-none text-ink/10 md:text-[10rem]">404</p>
      <h1 className="-mt-6 font-display text-4xl font-light md:text-5xl">This scent has evaporated</h1>
      <p className="mt-3 font-arabic text-xl text-basil-light" lang="ar" dir="rtl">
        الصفحة دي مش موجودة
      </p>
      <p className="mt-4 max-w-md text-smoke">
        The page you&apos;re looking for may have moved or no longer exists. Let&apos;s find you something beautiful
        instead.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">
          Explore perfumes <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </section>
  );
}
