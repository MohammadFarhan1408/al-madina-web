import { Reveal } from "@/components/Reveal";
import { reviews } from "../data/home-content";

export function Reviews() {
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
