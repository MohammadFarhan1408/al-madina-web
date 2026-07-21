import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductReviews } from "./ProductReviews";
import { productsServer } from "@/services/products.server";
import type { Product } from "@/types/catalog";

async function getRelated(product: Product): Promise<Product[]> {
  try {
    const page = await productsServer.list(
      { categoryId: product.categoryId, limit: 8 },
      120,
    );
    return (page?.items ?? []).filter((p) => p.id !== product.id).slice(0, 4);
  } catch {
    return [];
  }
}

export async function ProductDetailView({ product }: { product: Product }) {
  const related = await getRelated(product);

  return (
    <main className="pt-24 sm:pt-28">
      {/* Breadcrumb */}
      <Container className="pt-8">
        <nav className="flex flex-wrap items-center gap-2 font-ui text-xs uppercase tracking-[0.16em] text-stone">
          <Link href="/shop" className="hover:text-antique-gold">Shop</Link>
          <span aria-hidden>/</span>
          <Link href={`/fragrance-families/${product.scentFamily}`} className="capitalize hover:text-antique-gold">
            {product.scentFamily}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ivory/70">{product.name}</span>
        </nav>
      </Container>

      {/* Gallery + purchase */}
      <Container className="grid gap-12 py-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images ?? []} name={product.name} />
        <div className="lg:py-4">
          <ProductPurchasePanel product={product} />
        </div>
      </Container>

      {/* Fragrance composition — editorial, not generic cards */}
      {product.notes?.length > 0 && (
        <section className="border-t border-bronze/15 bg-obsidian py-20 sm:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <div>
                <p className="overline">The Composition</p>
                <h2 className="mt-5 font-display text-3xl leading-tight text-ivory sm:text-5xl">
                  Notes woven in shadow &amp; gold
                </h2>
                <p className="mt-6 font-editorial text-lg italic leading-relaxed text-stone">
                  {/aeiou/.test(product.scentFamily[0]) ? "An" : "A"}{" "}
                  {product.scentFamily} accord composed for depth and longevity.
                </p>
              </div>
              <ul className="flex flex-col divide-y divide-bronze/15 border-t border-bronze/15">
                {product.notes.map((note, i) => (
                  <li key={note} className="flex items-baseline gap-6 py-5">
                    <span className="font-ui text-sm tabular-nums text-bronze">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl text-ivory sm:text-3xl">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* Reviews */}
      <Container>
        <ProductReviews
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-bronze/15 py-20 sm:py-28">
          <Container>
            <p className="overline">You may also like</p>
            <h2 className="mt-5 font-display text-3xl text-ivory sm:text-5xl">
              From the same world
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
