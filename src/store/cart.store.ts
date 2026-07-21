"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/catalog";

// Guest-first cart, persisted to localStorage. Holds full product + qty so the
// cart renders offline; the server RE-PRICES and reconciles at /cart and
// /orders — client totals here are display-only and never authoritative.
export interface CartItem {
  product: Product;
  quantity: number;
  volumeMl?: number; // selected variant size, threaded into cart/order lines
}

const FREE_SHIPPING_THRESHOLD = 250;
const FLAT_SHIPPING = 20;

/** Resolve the price for a line, honouring the selected variant. */
export function linePrice(item: CartItem): number {
  if (item.volumeMl) {
    const v = item.product.variants?.find((x) => x.volumeMl === item.volumeMl);
    if (v) return v.price;
  }
  return item.product.price;
}

function keyOf(productId: string, volumeMl?: number) {
  return `${productId}:${volumeMl ?? ""}`;
}

interface CartState {
  items: CartItem[];
  add: (product: Product, quantity?: number, volumeMl?: number) => void;
  setQuantity: (productId: string, quantity: number, volumeMl?: number) => void;
  remove: (productId: string, volumeMl?: number) => void;
  replace: (items: CartItem[]) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, quantity = 1, volumeMl) =>
        set((s) => {
          const k = keyOf(product.id, volumeMl);
          const existing = s.items.find(
            (i) => keyOf(i.product.id, i.volumeMl) === k,
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                keyOf(i.product.id, i.volumeMl) === k
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...s.items, { product, quantity, volumeMl }] };
        }),
      setQuantity: (productId, quantity, volumeMl) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              keyOf(i.product.id, i.volumeMl) === keyOf(productId, volumeMl)
                ? { ...i, quantity }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      remove: (productId, volumeMl) =>
        set((s) => ({
          items: s.items.filter(
            (i) => keyOf(i.product.id, i.volumeMl) !== keyOf(productId, volumeMl),
          ),
        })),
      replace: (items) => set({ items }),
      clear: () => set({ items: [] }),
    }),
    { name: "am_cart" },
  ),
);

/** Total item count (sum of quantities). */
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

/** Display-only summary — server totals win at checkout. */
export function computeCartSummary(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + linePrice(i) * i.quantity, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  return { subtotal, shipping, total: subtotal + shipping };
}
