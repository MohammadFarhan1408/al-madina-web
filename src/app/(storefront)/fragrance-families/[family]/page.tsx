import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopPage } from "@/features/shop/ShopPage";
import { FAMILY_COPY } from "@/features/families/FamiliesPage";
import { ProductGridSkeleton } from "@/components/ui/feedback";
import { Container, PageIntro } from "@/components/ui/primitives";
import type { ScentFamily } from "@/types/catalog";

const FAMILIES = Object.keys(FAMILY_COPY) as ScentFamily[];

type Props = { params: Promise<{ family: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { family } = await params;
  const copy = FAMILY_COPY[family as ScentFamily];
  if (!copy) return { title: "Fragrance Family" };
  return { title: `${copy.label} Fragrances`, description: copy.note };
}

export default async function Page({ params }: Props) {
  const { family } = await params;
  if (!FAMILIES.includes(family as ScentFamily)) notFound();
  const copy = FAMILY_COPY[family as ScentFamily];

  return (
    <Suspense
      fallback={
        <main>
          <PageIntro eyebrow="Family" title={copy.label} description={copy.note} />
          <Container className="py-16">
            <ProductGridSkeleton />
          </Container>
        </main>
      }
    >
      <ShopPage
        eyebrow="Family"
        title={copy.label}
        description={copy.note}
        lockedFamily={family as ScentFamily}
      />
    </Suspense>
  );
}
