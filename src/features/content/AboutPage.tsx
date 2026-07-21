import { Reveal } from "@/components/Reveal";
import { Container, PageIntro } from "@/components/ui/primitives";

const TIMELINE = [
  { year: "1968", label: "The first Al Madina atelier opens, composing attars by hand." },
  { year: "1994", label: "Our signature Oud Black is aged, sealed and set as the house scent." },
  { year: "2012", label: "The Maison expands across the Gulf, one boutique at a time." },
  { year: "2026", label: "Centuries of craft, now carried into a single online atelier." },
];

const VALUES = [
  { title: "Rare Materials", body: "Only the finest oud, saffron and amber make our compositions." },
  { title: "Master Craft", body: "Each fragrance is blended and aged by hand, batch by batch." },
  { title: "Honest Sourcing", body: "Ingredients traded and harvested with respect for their origin." },
  { title: "Made to Last", body: "Designed to be treasured for a lifetime, not a season." },
];

export function AboutPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Our Heritage"
        title="The Art of Arabian Perfumery"
        description="Al Madina Ittar is a Maison of Arabian perfumery — oud aged in silence, saffron measured by the gram, amber warmed until it glows. Every bottle is a small architecture of shadow and gold."
      />

      <Container className="py-20">
        <Reveal className="max-w-2xl">
          <p className="overline">Our Journey</p>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((item) => (
            <Reveal key={item.year} className="border-t border-bronze/20 pt-6">
              <p className="font-display text-3xl text-antique-gold">{item.year}</p>
              <p className="mt-3 font-ui text-sm leading-relaxed text-stone">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="border-t border-bronze/15 py-20">
        <Reveal className="max-w-2xl">
          <p className="overline">Our Values</p>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <Reveal key={v.title} className="border border-bronze/20 bg-charcoal/30 p-6">
              <h3 className="font-display text-xl text-ivory">{v.title}</h3>
              <p className="mt-3 font-ui text-sm leading-relaxed text-stone">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  );
}
