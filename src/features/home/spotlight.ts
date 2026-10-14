import { cache } from "react";
import { productsServer } from "@/services/products.server";
import type { Product } from "@/types/catalog";

/**
 * The homepage's featured fragrance (Composition + Editorial sections): the
 * first signature product, else the top best-seller. Cached per request so
 * both sections share one lookup. Null when the catalogue is empty or the API
 * is down — sections then hide rather than show fake content.
 */
export const getSpotlight = cache(async (): Promise<Product | null> => {
  const signature = await productsServer.rail("signature").catch(() => null);
  if (signature?.[0]) return signature[0];
  const best = await productsServer.rail("best-sellers").catch(() => null);
  return best?.[0] ?? null;
});

/**
 * ponytail: the API stores notes as one ordered list (top → base), with no
 * tier field, so the pyramid is cut into thirds. Add notesTop/Heart/Base to the
 * Product model if perfumers need exact tiers.
 */
export function noteTiers(notes: string[]) {
  const top = Math.ceil(notes.length / 3);
  const base = Math.floor(notes.length / 3);
  return [
    { tier: "Top", notes: notes.slice(0, top) },
    { tier: "Heart", notes: notes.slice(top, notes.length - base) },
    { tier: "Base", notes: notes.slice(notes.length - base) },
  ].filter((t) => t.notes.length > 0);
}
