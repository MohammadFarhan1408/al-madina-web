"use client";

import { useQuery } from "@tanstack/react-query";
import { Container, PageIntro } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { queryKeys } from "@/lib/query/keys";
import { productsService } from "@/services/products.service";
import { useWishlistStore } from "@/store/wishlist.store";

export function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);

  const query = useQuery({
    queryKey: queryKeys.productsByIds(ids),
    queryFn: () => productsService.byIds(ids),
    enabled: ids.length > 0,
  });

  // Preserve wishlist order; drop any product that no longer exists.
  const products = ids
    .map((id) => query.data?.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main>
      <PageIntro
        eyebrow="Saved"
        title="Your Wishlist"
        description="The compositions you're drawn to — kept close until you're ready."
      />
      <Container className="py-14 sm:py-20">
        {ids.length === 0 ? (
          <ProductGrid
            products={[]}
            emptyTitle="Your wishlist is empty"
            emptyBody="Tap the heart on any fragrance to save it here."
          />
        ) : (
          <ProductGrid
            products={products}
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={() => query.refetch()}
          />
        )}
      </Container>
    </main>
  );
}
