"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Restores the persisted bag after mount (avoids SSR hydration mismatches) and syncs across tabs. */
export function StoreHydrator() {
  useEffect(() => {
    let active = true;
    Promise.resolve(useCart.persist.rehydrate()).finally(() => {
      if (active) useCart.setState({ hydrated: true });
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key === "re7an-cart") void useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return null;
}
