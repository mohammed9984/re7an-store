"use client";

import { useActionState } from "react";
import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions";

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletter, {
    ok: false,
  });

  if (state.ok) {
    return (
      <p className="flex animate-fade-up items-center gap-3 rounded-[3px] border border-ivory/25 bg-ivory/10 px-5 py-4 text-ivory">
        <CircleCheck className="h-5 w-5 shrink-0 text-gold-light" />
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="h-[3.25rem] flex-1 rounded-[3px] border border-ivory/25 bg-ivory/10 px-5 text-ivory placeholder:text-ivory/50 focus:border-gold-light focus:outline-none"
        />
        <button type="submit" disabled={pending} className="btn btn-light">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
      {state.message && !state.ok && <p className="mt-2 text-sm text-gold-light">{state.message}</p>}
      <p className="mt-3 text-xs text-ivory/50">No spam — just new scents, Eid edits and private sales. Unsubscribe anytime.</p>
    </form>
  );
}
