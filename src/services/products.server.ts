// Server-only product fetchers (RSC + generateMetadata). Kept separate from
// products.service.ts so client hooks never pull `server-only` into the bundle.
import { serverGet } from "@/lib/api/server";
import { endpoints } from "@/lib/api/endpoints";
import type { Paginated } from "@/lib/api/types";
import type { Product, Review } from "@/types/catalog";
import { normalizeProductQuery, type ProductQuery } from "./products.service";

export const productsServer = {
  list: (q: ProductQuery = {}, revalidate = 120) =>
    serverGet<Paginated<Product>>(endpoints.products.list, {
      query: normalizeProductQuery(q),
      revalidate,
    }),

  detail: (id: string, revalidate = 300) =>
    serverGet<Product>(endpoints.products.detail(id), { revalidate }),

  reviews: (id: string, page = 1, limit = 10, revalidate = 120) =>
    serverGet<Paginated<Review>>(endpoints.products.reviews(id), {
      query: { page, limit },
      revalidate,
    }),

  rail: (
    kind: "featured" | "new-arrivals" | "best-sellers" | "signature" | "seasonal",
    revalidate = 600,
  ) => serverGet<Product[]>(`/products/${kind}`, { revalidate }),
};
