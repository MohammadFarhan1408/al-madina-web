import { apiGet, apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Paginated } from "@/lib/api/types";
import type { Product, Review, ScentFamily } from "@/types/catalog";

export type ProductSort =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest";

export interface ProductQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  family?: ScentFamily;
  q?: string;
  sort?: ProductSort;
  badge?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSignature?: boolean;
  isSeasonal?: boolean;
}

type QueryObj = Record<string, string | number | boolean | undefined>;

function toQuery(q: ProductQuery): QueryObj {
  const out: QueryObj = {};
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== "") out[k] = v as string | number | boolean;
  }
  return out;
}

// ---- Client-side (browser) ----
export const productsService = {
  list: (q: ProductQuery = {}) =>
    apiGet<Paginated<Product>>(endpoints.products.list, { params: toQuery(q) }),

  /** Bulk hydration for wishlist/cart — returns a bare array. */
  byIds: (ids: string[]) =>
    ids.length
      ? apiGet<Product[]>(endpoints.products.list, { params: { ids: ids.join(",") } })
      : Promise.resolve([]),

  detail: (id: string) => apiGet<Product>(endpoints.products.detail(id)),

  reviews: (id: string, page = 1, limit = 10) =>
    apiGet<Paginated<Review>>(endpoints.products.reviews(id), {
      params: { page, limit },
    }),

  createReview: (id: string, input: { rating: number; title: string; body: string }) =>
    apiPost<Review>(endpoints.products.reviews(id), input),

  search: (q: string, page = 1, limit = 20) =>
    apiGet<Paginated<Product>>(endpoints.products.search, { params: { q, page, limit } }),

  suggest: (q: string, limit = 5) =>
    apiGet<string[]>(endpoints.products.suggest, { params: { q, limit } }),

  rail: (
    kind: "featured" | "new-arrivals" | "best-sellers" | "signature" | "seasonal",
  ) => apiGet<Product[]>(`/products/${kind}`),
};

/** Shared query→object normalizer, reused by the server fetchers. */
export function normalizeProductQuery(q: ProductQuery): QueryObj {
  return toQuery(q);
}
