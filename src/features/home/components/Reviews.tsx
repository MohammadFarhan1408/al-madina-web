import { Reveal } from "@/components/Reveal";
import { productsServer } from "@/services/products.server";
import type { Review } from "@/types/catalog";

// Real reviews only — pulls the best-rated, most recent reviews off a
// handful of best-selling products. No mock/fabricated testimonials: if the
// catalogue doesn't have enough real reviews yet, the section just doesn't
// render (see FeaturedFragrances for the same convention).
async function getTopReviews(): Promise<Review[]> {
  const bestSellers = await productsServer.rail("best-sellers").catch(() => []);
  const pages = await Promise.all(
    (bestSellers ?? [])
      .slice(0, 6)
      .map((p) => productsServer.reviews(p.id, 1, 5, 3600).catch(() => null)),
  );
  return pages
    .flatMap((page) => page?.items ?? [])
    .filter((r) => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating || +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);
}

export async function Reviews() {
  const reviews = await getTopReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="border-t border-bronze/15 bg-rich-black py-28 sm:py-36">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <Reveal className="max-w-3xl">
          <p className="overline">The Collectors</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.02] text-ivory sm:text-6xl">
            Worn, and remembered
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden border border-bronze/20 bg-bronze/20 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal
              key={r.id}
              delay={i * 100}
              className="flex flex-col justify-between bg-rich-black p-8 sm:p-10"
            >
              <div>
                <p className="font-ui text-sm tracking-[0.3em] text-antique-gold">
                  {"★".repeat(r.rating)}
                </p>
                <h3 className="mt-5 font-display text-2xl leading-snug text-ivory">
                  {r.title}
                </h3>
                <p className="mt-4 font-editorial text-lg italic leading-relaxed text-stone">
                  “{r.body}”
                </p>
              </div>
              <p className="mt-8 font-ui text-xs uppercase tracking-[0.2em] text-ivory-dim/70">
                {r.author}
                {r.verified && (
                  <span className="ml-2 text-bronze">· Verified</span>
                )}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
