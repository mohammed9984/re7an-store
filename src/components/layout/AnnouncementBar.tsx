"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Free delivery across Egypt on orders over EGP 1,500",
  "New here? Use code WELCOME10 for 10% off your first order",
  "Cash on delivery · Card on delivery · InstaPay",
  "Delivering to all 27 governorates — next day in Cairo & Giza",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative z-50 bg-basil-dark text-ivory">
      <div className="shell relative flex h-9 items-center justify-center overflow-hidden">
        {MESSAGES.map((message, i) => (
          <p
            key={message}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-x-4 text-center text-[0.7rem] tracking-[0.18em] uppercase transition-all duration-700",
              i === index ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}
