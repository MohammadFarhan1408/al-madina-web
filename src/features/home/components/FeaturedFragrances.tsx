import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { featuredProducts } from "../data/home-content";
import { productsServer } from "@/services/products.server";
import { formatAED } from "@/types/catalog";
import type { Product } from "@/types/catalog";

// Live best-sellers when the catalogue is seeded; the curated static list is a
// graceful fallback so the completed homepage never renders empty.
async function getProducts(): Promise<Product[]> {
  try {
    const live = await productsServer.rail("best-sellers");
    if (live && live.length) return live.slice(0, 5);
  } catch {
    // fall through to static
  }
  return featuredProducts;
}

export async function FeaturedFragrances() {
  const products = await getProducts();

  return (
    <section
      id="featured"
      className="relative border-t border-bronze/15 bg-rich-black py-28 sm:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="overline">Bestselling</p>
            <h2 className="mt-5 font-display text-4xl leading-none text-ivory sm:text-6xl">
              The Signature Index
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-ui text-sm uppercase tracking-[0.2em] text-antique-gold transition-colors hover:text-gold-bright"
          >
            View all fragrances →
          </Link>
        </Reveal>

        <ul className="mt-14 border-t border-bronze/20">
          {products.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              delay={i * 80}
              className="group border-b border-bronze/20"
            >
              <Link
                href={`/product/${p.id}`}
                className="grid grid-cols-[3rem_1fr_auto] items-center gap-5 py-7 sm:grid-cols-[5rem_1fr_14rem_auto] sm:gap-8"
              >
                <span className="font-ui text-sm tabular-nums text-bronze">
                  0{i + 1}
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-3">
                    <span className="truncate font-display text-2xl text-ivory transition-colors group-hover:text-antique-gold sm:text-4xl">
                      {p.name}
                    </span>
                    {p.badge && (
                      <span className="shrink-0 border border-bronze/50 px-2 py-0.5 font-ui text-[0.6rem] uppercase tracking-[0.2em] text-champagne">
                        {p.badge}
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 block font-ui text-xs uppercase tracking-[0.16em] text-stone">
                    {p.scentFamily} — {p.volumeMl} ml
                  </span>
                </span>

                <span className="hidden font-ui text-sm text-ivory-dim/70 sm:block">
                  {p.notes.slice(0, 3).join(" · ")}
                </span>

                <span className="text-right">
                  <span className="block font-ui text-base text-ivory">
                    {formatAED(p.price)}
                  </span>
                  <span className="mt-1 block font-ui text-xs text-bronze">
                    ★ {p.rating.toFixed(1)} · {p.reviewCount}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
