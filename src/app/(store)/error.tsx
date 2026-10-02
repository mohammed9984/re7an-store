"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function StoreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="shell flex flex-col items-center py-28 text-center md:py-36">
      <p className="eyebrow text-gold">Something went wrong</p>
      <h1 className="mt-4 font-display text-4xl font-light md:text-5xl">We couldn&apos;t load this page</h1>
      <p className="mt-4 max-w-md text-smoke">
        Please try again in a moment. If the problem continues, our team is happy to help on WhatsApp.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </section>
  );
}
