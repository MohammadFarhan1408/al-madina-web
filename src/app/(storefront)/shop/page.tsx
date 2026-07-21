import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/features/shop/ShopPage";
import { ProductGridSkeleton } from "@/components/ui/feedback";
import { Container, PageIntro } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description:
    "Explore the full Al Madina Ittar collection — oud, amber, floral and rare naturals in luxury Arabian perfumery.",
};

function ShopFallback() {
  return (
    <main>
      <PageIntro eyebrow="Shop" title="The Collection" />
      <Container className="py-16">
        <ProductGridSkeleton />
      </Container>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopPage />
    </Suspense>
  );
}
