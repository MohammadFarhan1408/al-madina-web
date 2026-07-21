import { apiGet, apiPost, apiDelete } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/types";

// Server wishlist is a set of product IDs (requireAuth). The Zustand store stays
// the reactive local cache; session-sync mirrors the two. See mobile parity.
export const wishlistService = {
  getIds: async (): Promise<string[]> => {
    const res = await apiGet<{ productIds: string[] }>(endpoints.wishlist.get);
    return res.productIds;
  },

  add: async (productId: string): Promise<void> => {
    try {
      await apiPost(endpoints.wishlist.add, { productId });
    } catch (err) {
      // 409 ALREADY_IN_WISHLIST is a no-op from the caller's view.
      if (!(err instanceof ApiError) || err.status !== 409) throw err;
    }
  },

  remove: async (productId: string): Promise<void> => {
    try {
      await apiDelete(endpoints.wishlist.remove(productId));
    } catch (err) {
      if (!(err instanceof ApiError) || err.status !== 404) throw err;
    }
  },
};
