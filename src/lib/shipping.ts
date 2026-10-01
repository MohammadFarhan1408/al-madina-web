// Display-only shipping preview. The API's orders.service computeShipping is
// authoritative; keep these numbers in sync with it by hand.
const FREE_SHIPPING_THRESHOLD = 250;
const FLAT_SHIPPING = 20;
export const EXPRESS_SURCHARGE = 30;

export function computeShipping(
  subtotal: number,
  delivery: "standard" | "express" = "standard",
): number {
  const base = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  return base + (delivery === "express" ? EXPRESS_SURCHARGE : 0);
}
