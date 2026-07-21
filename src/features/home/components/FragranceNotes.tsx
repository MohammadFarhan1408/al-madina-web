import { Reveal } from "@/components/Reveal";
import { notePyramid } from "../data/home-content";

export function FragranceNotes() {
  return (
    <section
      id="notes"
      className="relative overflow-hidden border-t border-bronze/15 bg-obsidian py-28 sm:py-36"
    >
      {/* faint bottle render keeps the composition connected to the hero */}
      <img
        src="/animations/oud-black/desktop/frame-090.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 hidden w-[46rem] max-w-[55%] -translate-y-1/2 object-contain opacity-25 lg:block"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 55%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 55%)",
        }}
      />
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <Reveal>
          <p className="overline">The Composition</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.02] text-ivory sm:text-6xl">
            How <span className="italic text-antique-gold">Oud Black</span>{" "}
            unfolds
          </h2>
        </Reveal>

        <div className="mt-16 max-w-2xl divide-y divide-bronze/20 border-y border-bronze/20">
          {notePyramid.map((tier, i) => (
            <Reveal
              key={tier.tier}
              delay={i * 120}
              className="grid grid-cols-[6rem_1fr] items-baseline gap-6 py-8 sm:grid-cols-[9rem_1fr]"
            >
              <span className="font-ui text-xs uppercase tracking-[0.34em] text-antique-gold">
                {tier.tier}
              </span>
              <span className="font-display text-2xl text-ivory sm:text-4xl">
                {tier.notes.join(" · ")}
              </span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-12 max-w-md font-editorial text-lg italic leading-relaxed text-stone">
            Composed to open bright, deepen at the heart, and rest for hours on
            skin — a fragrance read in three movements.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
