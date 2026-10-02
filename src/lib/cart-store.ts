import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  variantId: number;
  productId: number;
  slug: string;
  name: string;
  size: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  quantity: number;
  maxQuantity: number;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  lastAddedAt: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: number, quantity: number) => void;
  removeItem: (variantId: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const MAX_PER_LINE = 10;

const lineLimit = (maxQuantity: number) => Math.max(1, Math.min(MAX_PER_LINE, maxQuantity));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hydrated: false,
      lastAddedAt: 0,
      addItem: (item, quantity = 1) =>
        set((state) => {
          const limit = lineLimit(item.maxQuantity);
          const existing = state.items.find((i) => i.variantId === item.variantId);
          const items = existing
            ? state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, ...item, quantity: Math.min(limit, i.quantity + quantity) }
                  : i,
              )
            : [...state.items, { ...item, quantity: Math.min(limit, Math.max(1, quantity)) }];
          return { items, isOpen: true, lastAddedAt: Date.now() };
        }),
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.max(1, Math.min(lineLimit(i.maxQuantity), Math.round(quantity))) }
              : i,
          ),
        })),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "re7an-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

export const selectCount = (state: CartState) => state.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (state: CartState) =>
  state.items.reduce((n, i) => n + i.price * i.quantity, 0);
