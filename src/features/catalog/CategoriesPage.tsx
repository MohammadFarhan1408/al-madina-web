import Link from "next/link";
import { Container, PageIntro } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/feedback";
import { ProductImage } from "@/components/ui/ProductImage";
import { categoriesServer } from "@/services/catalog.server";
import type { Category } from "@/types/catalog";

export async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = (await categoriesServer.list()) ?? [];
  } catch {
    categories = [];
  }

  return (
    <main>
      <PageIntro
        eyebrow="Browse"
        title="Categories"
        description="The Maison's compositions, organised by craft — oud perfumes, pure and premium attars, and more."
      />

      <Container className="py-14 sm:py-20">
        {categories.length === 0 ? (
          <EmptyState
            title="Categories are being composed"
            body="Our categories will appear here shortly."
            action={{ label: "Shop all fragrances", href: "/shop" }}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="group relative flex min-h-80 flex-col justify-end overflow-hidden border border-bronze/20 transition-colors hover:border-antique-gold/50"
              >
                <ProductImage
                  src={c.image}
                  alt={c.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="absolute inset-0 h-full w-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/70 to-transparent" />
                <div className="relative p-7">
                  <span className="font-ui text-xs uppercase tracking-[0.3em] text-antique-gold">
                    {c.productCount} fragrances
                  </span>
                  <h2 className="mt-3 font-display text-2xl text-ivory transition-colors group-hover:text-antique-gold sm:text-3xl">
                    {c.name}
                  </h2>
                  {c.tagline && (
                    <p className="mt-2 max-w-xs font-editorial text-sm italic leading-relaxed text-stone">
                      {c.tagline}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
