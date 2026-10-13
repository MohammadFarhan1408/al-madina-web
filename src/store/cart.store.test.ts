import { describe, expect, it } from "vitest";
import { useCartStore } from "./cart.store";

describe("cart coupon", () => {
  it("keeps the code until the bag is cleared (order placed)", () => {
    useCartStore.getState().setCouponCode("OUD10");
    expect(useCartStore.getState().couponCode).toBe("OUD10");
    useCartStore.getState().clear();
    expect(useCartStore.getState().couponCode).toBeNull();
  });
});
