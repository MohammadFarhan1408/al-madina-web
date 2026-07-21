"use client";

import { Container, PageIntro } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { useCategoryProducts, flattenProducts } from "@/hooks/queries/use-catalog";

export function CategoryPage({
  categoryId,
  name,
  tagline,
}: {
  categoryId: string;
  name: string;
  tagline?: string;
}) {
  const query = useCategoryProducts(categoryId);
  const products = flattenProducts(query.data);

  return (
    <main>
      <PageIntro eyebrow="Category" title={name} description={tagline} />
      <Container className="py-14 sm:py-20">
        <ProductGrid
          products={products}
          isLoading={query.isLoading}
          isError={query.isError}
          onRetry={() => query.refetch()}
          hasMore={query.hasNextPage}
          isFetchingMore={query.isFetchingNextPage}
          onLoadMore={() => query.fetchNextPage()}
        />
      </Container>
    </main>
  );
}
