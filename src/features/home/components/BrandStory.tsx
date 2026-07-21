import { Reveal } from "@/components/Reveal";

const STATS = [
  { value: "1968", label: "Maison founded" },
  { value: "40+", label: "Rare naturals" },
  { value: "AED", label: "Priced with care" },
];

export function BrandStory() {
  return (
    <section
      id="story"
      className="border-t border-bronze/15 bg-rich-black py-28 sm:py-36"
    >
      <div className="mx-auto grid max-w-[1600px] gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-20 lg:px-16">
        <Reveal className="lg:col-span-5">
          <p className="overline">Our Story</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.03] text-ivory sm:text-6xl">
            The art of
            <br />
            <span className="italic text-antique-gold">Arabian</span> perfumery
          </h2>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal className="max-w-xl">
            <p className="font-editorial text-xl leading-relaxed text-ivory-dim sm:text-2xl">
              At Al Madina Ittar, fragrance is composed the old way — oud aged in
              silence, saffron measured by the gram, amber warmed until it glows.
              Every bottle is a small architecture of shadow and gold.
            </p>
            <p className="mt-6 max-w-lg font-ui text-sm leading-relaxed text-stone">
              We work with attars and modern extraction alike, holding to a
              single belief: that a scent should feel inevitable on the skin, and
              stay long after the room has emptied.
            </p>
          </Reveal>

          <Reveal className="mt-14 grid grid-cols-3 gap-6 border-t border-bronze/20 pt-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-antique-gold sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 font-ui text-xs uppercase tracking-[0.2em] text-stone">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
