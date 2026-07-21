"use client";

import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton, EmptyState, ErrorState, Spinner } from "./feedback";
import type { Product } from "@/types/catalog";

/** Shared catalog grid: loading, error, empty, and load-more states. */
export function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
  hasMore,
  isFetchingMore,
  onLoadMore,
  emptyTitle = "No fragrances found",
  emptyBody = "Try adjusting your filters or explore the full collection.",
}: {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (isLoading) return <ProductGridSkeleton />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!products.length)
    return (
      <EmptyState
        eyebrow="Empty"
        title={emptyTitle}
        body={emptyBody}
        action={{ label: "Browse all", href: "/shop" }}
      />
    );

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={`${p.id}-${i}`} product={p} priority={i < 4} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingMore}
            className="inline-flex items-center gap-3 border border-bronze/60 px-10 py-4 font-ui text-[0.78rem] uppercase tracking-[0.24em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold disabled:opacity-50"
          >
            {isFetchingMore ? <Spinner /> : null}
            {isFetchingMore ? "Loading" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
