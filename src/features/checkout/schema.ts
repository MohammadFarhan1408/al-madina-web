import { z } from "zod";

// Mirrors the backend order shippingAddress contract (+ guest email, required
// only for guests — baked into the schema itself rather than a separate
// imperative check, so it can't be skipped on a second submit).
export function buildCheckoutAddressSchema(requireEmail: boolean) {
  return z.object({
    fullName: z.string().min(2, "Enter your full name"),
    phone: z.string().min(5, "Enter a valid phone number"),
    address: z.string().min(5, "Enter your delivery address"),
    city: z.string().min(2, "Enter your city"),
    email: requireEmail
      ? z
          .string()
          .trim()
          .min(1, "Email is required for guest checkout")
          .email("Enter a valid email")
      : z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  });
}

export type CheckoutAddressForm = z.infer<ReturnType<typeof buildCheckoutAddressSchema>>;
