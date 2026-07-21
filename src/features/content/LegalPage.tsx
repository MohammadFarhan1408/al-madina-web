import { Container, PageIntro } from "@/components/ui/primitives";

export type LegalSection = { heading: string; body: string[] };

/** Shared editorial layout for legal / policy copy (Privacy, Terms, Shipping & Returns). */
export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  sections: LegalSection[];
}) {
  return (
    <main>
      <PageIntro eyebrow={eyebrow} title={title} description={description} />
      <Container className="max-w-3xl py-20">
        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl text-ivory">{s.heading}</h2>
              <div className="mt-4 space-y-4">
                {s.body.map((p, i) => (
                  <p key={i} className="font-ui text-sm leading-relaxed text-stone">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
