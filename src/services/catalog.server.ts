// Server-only category/collection fetchers (RSC + generateMetadata).
import { serverGet } from "@/lib/api/server";
import { endpoints } from "@/lib/api/endpoints";
import type { Paginated } from "@/lib/api/types";
import type { Category, Collection, Product } from "@/types/catalog";

export const categoriesServer = {
  list: (revalidate = 3600) =>
    serverGet<Category[]>(endpoints.categories.list, { revalidate }),
  detail: (id: string, revalidate = 3600) =>
    serverGet<Category>(endpoints.categories.detail(id), { revalidate }),
  products: (id: string, page = 1, limit = 20, revalidate = 120) =>
    serverGet<Paginated<Product>>(endpoints.categories.products(id), {
      query: { page, limit },
      revalidate,
    }),
};

export const collectionsServer = {
  list: (revalidate = 3600) =>
    serverGet<Collection[]>(endpoints.collections.list, { revalidate }),
  detail: (id: string, revalidate = 3600) =>
    serverGet<Collection>(endpoints.collections.detail(id), { revalidate }),
  products: (id: string, revalidate = 300) =>
    serverGet<Product[]>(endpoints.collections.products(id), { revalidate }),
};
