import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { CartLineInput, ReconciledCart } from "@/types/commerce";

// Backend cart (requireAuth) always returns a server-reconciled cart (fresh
// price/name/image, drops out-of-stock/missing lines) — callers REPLACE local
// state with the response, never merge. No express surcharge here (that's added
// at order creation from deliveryMethod).
export const cartService = {
  get: () => apiGet<ReconciledCart>(endpoints.cart.get),

  sync: (items: CartLineInput[]) =>
    apiPost<ReconciledCart>(endpoints.cart.sync, { items }),

  addItem: (productId: string, quantity: number, volumeMl?: number) =>
    apiPost<ReconciledCart>(endpoints.cart.items, { productId, quantity, volumeMl }),

  setQuantity: (productId: string, quantity: number) =>
    apiPatch<ReconciledCart>(endpoints.cart.item(productId), { quantity }),

  removeItem: (productId: string) =>
    apiDelete<ReconciledCart>(endpoints.cart.item(productId)),
};
