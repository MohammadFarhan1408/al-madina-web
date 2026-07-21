import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { collections, familyRail } from "../data/home-content";
import type { CollectionAccent } from "@/types/catalog";

// Full literal class strings so Tailwind's source scanner emits them.
const ACCENT: Record<
  CollectionAccent,
  { text: string; linkHover: string; border: string; glow: string }
> = {
  gold: {
    text: "text-antique-gold",
    linkHover: "group-hover:text-antique-gold",
    border: "border-antique-gold/40",
    glow: "radial-gradient(80% 60% at 50% 0%, rgba(200,162,75,0.16), transparent 70%)",
  },
  emerald: {
    text: "text-emerald",
    linkHover: "group-hover:text-emerald",
    border: "border-emerald/50",
    glow: "radial-gradient(80% 60% at 50% 0%, rgba(27,122,77,0.20), transparent 70%)",
  },
  burgundy: {
    text: "text-burgundy",
    linkHover: "group-hover:text-burgundy",
    border: "border-burgundy/50",
    glow: "radial-gradient(80% 60% at 50% 0%, rgba(124,36,56,0.24), transparent 70%)",
  },
};

export function ShopByFamily() {
  return (
    <section
      id="collections"
      className="border-t border-bronze/15 bg-obsidian py-28 sm:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <Reveal>
          <p className="overline">Explore the Maison</p>
          <h2 className="mt-5 max-w-3xl font-display text-4xl leading-[1.02] text-ivory sm:text-6xl">
            Curated collections, drawn by mood
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {collections.map((c, i) => {
            const a = ACCENT[c.accent];
            return (
              <Reveal
                key={c.id}
                delay={i * 100}
                className={`group relative flex min-h-[22rem] flex-col justify-between overflow-hidden border ${a.border} bg-charcoal/60 p-8 transition-colors hover:bg-charcoal`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{ background: a.glow }}
                />
                <div className="relative">
                  <span
                    className={`font-ui text-xs uppercase tracking-[0.3em] ${a.text}`}
                  >
                    {c.productCount} fragrances
                  </span>
                  <h3 className="mt-5 font-display text-3xl leading-tight text-ivory sm:text-4xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-xs font-editorial text-base italic leading-relaxed text-stone">
                    {c.subtitle}
                  </p>
                </div>
                <Link
                  href="/collections"
                  className={`relative mt-8 inline-flex items-center gap-2 font-ui text-sm uppercase tracking-[0.2em] text-ivory transition-colors ${a.linkHover}`}
                >
                  Discover
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* families */}
        <Reveal className="mt-16 flex flex-wrap items-center gap-x-3 gap-y-4">
          <span className="mr-2 font-ui text-xs uppercase tracking-[0.3em] text-bronze">
            By family
          </span>
          {familyRail.map((f) => (
            <Link
              key={f.family}
              href={`/shop?family=${f.family}`}
              className="group inline-flex items-baseline gap-2 border border-bronze/25 px-4 py-2 transition-colors hover:border-antique-gold/60"
            >
              <span className="font-display text-lg text-ivory group-hover:text-antique-gold">
                {f.label}
              </span>
              <span className="font-ui text-[0.65rem] tabular-nums text-bronze">
                {f.count}
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
