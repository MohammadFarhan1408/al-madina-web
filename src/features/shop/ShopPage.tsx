"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Container, PageIntro } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { useProducts, flattenProducts } from "@/hooks/queries/use-catalog";
import type { ProductSort } from "@/services/products.service";
import type { ScentFamily } from "@/types/catalog";

const FAMILIES: ScentFamily[] = [
  "oud",
  "floral",
  "amber",
  "musk",
  "woody",
  "citrus",
  "spicy",
];

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function ShopPage({
  title = "The Collection",
  eyebrow = "Shop",
  description = "Every composition in the Maison — oud, amber, floral and rare naturals, bottled in shadow and gold.",
  lockedFamily,
}: {
  title?: string;
  eyebrow?: string;
  description?: string;
  lockedFamily?: ScentFamily; // for /fragrance-families/[family]
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const family = (lockedFamily ?? params.get("family")) as ScentFamily | null;
  const sort = (params.get("sort") as ProductSort) || "featured";
  const inStock = params.get("inStock") === "true";

  const filters = useMemo(
    () => ({
      family: family ?? undefined,
      sort,
      inStock: inStock || undefined,
    }),
    [family, sort, inStock],
  );

  const query = useProducts(filters);
  const products = flattenProducts(query.data);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  return (
    <main>
      <PageIntro eyebrow={eyebrow} title={title} description={description} />

      <Container className="py-12 sm:py-16">
        {/* Filter + sort bar */}
        <div className="flex flex-col gap-6 border-b border-bronze/15 pb-8 lg:flex-row lg:items-center lg:justify-between">
          {!lockedFamily && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setParam("family", null)}
                className={chip(!family)}
              >
                All
              </button>
              {FAMILIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setParam("family", f)}
                  className={chip(family === f)}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-5">
            <label className="flex cursor-pointer items-center gap-2 font-ui text-xs uppercase tracking-[0.16em] text-ivory/80">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setParam("inStock", e.target.checked ? "true" : null)}
                className="h-3.5 w-3.5 accent-antique-gold"
              />
              In stock
            </label>
            <label className="flex items-center gap-2">
              <span className="font-ui text-xs uppercase tracking-[0.16em] text-bronze">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="border border-bronze/30 bg-charcoal px-3 py-2 font-ui text-xs text-ivory outline-none focus:border-antique-gold"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-12">
          <ProductGrid
            products={products}
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={() => query.refetch()}
            hasMore={query.hasNextPage}
            isFetchingMore={query.isFetchingNextPage}
            onLoadMore={() => query.fetchNextPage()}
          />
        </div>
      </Container>
    </main>
  );
}

function chip(active: boolean) {
  return `border px-4 py-2 font-ui text-xs uppercase tracking-[0.16em] capitalize transition-colors ${
    active
      ? "border-antique-gold text-antique-gold"
      : "border-bronze/25 text-ivory/70 hover:border-antique-gold/60 hover:text-ivory"
  }`;
}
