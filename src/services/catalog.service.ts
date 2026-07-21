import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Paginated } from "@/lib/api/types";
import type { Category, Collection, Product } from "@/types/catalog";

// ---- Categories (client) ----
export const categoriesService = {
  list: () => apiGet<Category[]>(endpoints.categories.list),
  detail: (id: string) => apiGet<Category>(endpoints.categories.detail(id)),
  products: (id: string, page = 1, limit = 20) =>
    apiGet<Paginated<Product>>(endpoints.categories.products(id), {
      params: { page, limit },
    }),
};

// ---- Collections (client) ----
export const collectionsService = {
  list: () => apiGet<Collection[]>(endpoints.collections.list),
  detail: (id: string) => apiGet<Collection>(endpoints.collections.detail(id)),
  /** Curated order, not paginated — returns a bare array. */
  products: (id: string) => apiGet<Product[]>(endpoints.collections.products(id)),
};
