"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Guest-first: stores product IDs only, persisted to localStorage. Once
// authenticated, session-sync (Phase 2) mirrors these to the backend.
interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  replace: (ids: string[]) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
      replace: (ids) => set({ ids: [...new Set(ids)] }),
      clear: () => set({ ids: [] }),
    }),
    { name: "am_wishlist" },
  ),
);

/** Reactive membership check for a single product. */
export const useIsWishlisted = (id: string) =>
  useWishlistStore((s) => s.ids.includes(id));
