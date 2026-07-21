import { notFound } from "next/navigation";
import { Container, PageIntro } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/feedback";
import { ProductCard } from "@/components/ui/ProductCard";
import { collectionsServer } from "@/services/catalog.server";

export async function CollectionDetailPage({ id }: { id: string }) {
  const collection = await collectionsServer.detail(id);
  if (!collection) notFound();

  const products = (await collectionsServer.products(id)) ?? [];

  return (
    <main>
      <PageIntro
        eyebrow="Collection"
        title={collection.title}
        description={collection.subtitle}
      />
      <Container className="py-14 sm:py-20">
        {products.length === 0 ? (
          <EmptyState
            title="This collection is being composed"
            body="Fragrances will appear here soon."
            action={{ label: "Shop all", href: "/shop" }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
