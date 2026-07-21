import { Reveal } from "@/components/Reveal";
import { formatAED } from "@/types/catalog";
import { featuredProducts } from "../data/home-content";

const hero = featuredProducts[0]; // Oud Black

export function EditorialFeature() {
  return (
    <section
      id="journal"
      className="relative overflow-hidden border-t border-bronze/15 bg-obsidian"
    >
      <div className="mx-auto grid max-w-[1600px] items-stretch gap-10 px-6 py-24 sm:px-10 lg:grid-cols-2 lg:gap-0 lg:px-0 lg:py-0">
        {/* image side — the real bottle render */}
        <div className="relative order-2 min-h-[24rem] overflow-hidden lg:order-1 lg:min-h-[42rem]">
          <img
            src="/animations/oud-black/desktop/frame-125.jpg"
            alt="Al Madina Ittar Oud Black bottle mid-spray."
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-obsidian via-transparent to-transparent lg:bg-linear-to-r" />
        </div>

        {/* editorial side */}
        <div className="order-1 flex items-center lg:order-2 lg:px-16">
          <Reveal className="max-w-lg">
            <p className="overline">The Icon</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] text-ivory sm:text-7xl">
              Oud Black
            </h2>
            <p className="mt-6 font-editorial text-xl italic leading-relaxed text-ivory-dim">
              {hero.description}
            </p>
            <p className="mt-6 font-ui text-xs uppercase tracking-[0.28em] text-antique-gold">
              {hero.notes.join(" · ")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <span className="font-display text-3xl text-ivory">
                {formatAED(hero.price)}
              </span>
              <a
                href={`#${hero.slug}`}
                className="inline-flex items-center gap-3 bg-antique-gold px-8 py-4 font-ui text-sm font-medium uppercase tracking-[0.18em] text-rich-black transition-colors hover:bg-gold-bright"
              >
                Discover the Icon
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
