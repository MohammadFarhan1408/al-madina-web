import { z } from "zod";

// Mirrors the backend order shippingAddress contract (+ optional guest email,
// validated as required for guests in the component).
export const checkoutAddressSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(5, "Enter a valid phone number"),
  address: z.string().min(5, "Enter your delivery address"),
  city: z.string().min(2, "Enter your city"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
});

export type CheckoutAddressForm = z.infer<typeof checkoutAddressSchema>;

const FREE_SHIPPING_THRESHOLD = 250;
const FLAT_SHIPPING = 20;
export const EXPRESS_SURCHARGE = 30;

/** Display-only shipping preview. Backend recomputes authoritatively at order creation. */
export function computeShipping(
  subtotal: number,
  delivery: "standard" | "express",
): number {
  const base =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  return base + (delivery === "express" ? EXPRESS_SURCHARGE : 0);
}
