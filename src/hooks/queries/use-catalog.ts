"use client";

import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { productsService, type ProductQuery } from "@/services/products.service";
import {
  categoriesService,
  collectionsService,
} from "@/services/catalog.service";
import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Paginated } from "@/lib/api/types";
import type { Product } from "@/types/catalog";

const PAGE_SIZE = 20;

/** Paginated products with filters — infinite scroll / load-more. */
export function useProducts(filters: Omit<ProductQuery, "page" | "limit">) {
  return useInfiniteQuery({
    queryKey: queryKeys.products(filters),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      productsService.list({ ...filters, page: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (last: Paginated<Product>) =>
      last.hasMore ? last.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });
}

/** Products under a category (category endpoint only supports page/limit). */
export function useCategoryProducts(categoryId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.categoryProducts(categoryId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      categoriesService.products(categoryId, pageParam, PAGE_SIZE),
    getNextPageParam: (last: Paginated<Product>) =>
      last.hasMore ? last.page + 1 : undefined,
    enabled: !!categoryId,
  });
}

export function useProduct(id: string, initialData?: Product) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsService.detail(id),
    enabled: !!id,
    initialData,
  });
}

export function useProductReviews(id: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.productReviews(id),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => productsService.reviews(id, pageParam, 10),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesService.list(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections,
    queryFn: () => collectionsService.list(),
    staleTime: 30 * 60 * 1000,
  });
}

// ---- Search ----
export function useSearch(q: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.search(q),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => productsService.search(q, pageParam, PAGE_SIZE),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: q.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}

export function useSuggest(q: string) {
  return useQuery({
    queryKey: queryKeys.suggest(q),
    queryFn: () => productsService.suggest(q, 6),
    enabled: q.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: queryKeys.trending,
    queryFn: () => apiGet<string[]>(endpoints.search.trending),
    staleTime: 60 * 60 * 1000,
  });
}

/** Flatten infinite-query pages into one product array. */
export function flattenProducts(
  data: { pages: Paginated<Product>[] } | undefined,
): Product[] {
  return data?.pages.flatMap((p) => p.items) ?? [];
}
