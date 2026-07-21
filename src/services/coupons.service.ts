import { apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { CouponPreview } from "@/types/commerce";

// authOptional preview — real application happens server-side at order creation.
export const couponsService = {
  validate: (code: string, subtotal: number) =>
    apiPost<CouponPreview>(endpoints.coupons.validate, { code, subtotal }),
};
