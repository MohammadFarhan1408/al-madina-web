import Link from "next/link";
import { Container, PageIntro } from "@/components/ui/primitives";
import type { ScentFamily } from "@/types/catalog";

// Editorial descriptions for each scent family (brand copy, not backend data).
export const FAMILY_COPY: Record<
  ScentFamily,
  { label: string; note: string }
> = {
  oud: { label: "Oud", note: "Smoked, resinous, endlessly deep — the soul of Arabian perfumery." },
  amber: { label: "Amber", note: "Golden warmth of benzoin, labdanum and resins lit from within." },
  floral: { label: "Floral", note: "Rose, jasmine and orange blossom — opulent and alive." },
  musk: { label: "Musk", note: "Skin-soft, clean and lingering — intimacy made scent." },
  woody: { label: "Woody", note: "Sandalwood, cedar and vetiver — grounded and refined." },
  citrus: { label: "Citrus", note: "Bergamot and neroli — a bright, luminous opening." },
  spicy: { label: "Spicy", note: "Saffron, cardamom and pepper — heat woven through the heart." },
};

const ORDER: ScentFamily[] = ["oud", "amber", "floral", "musk", "woody", "spicy", "citrus"];

export function FamiliesPage() {
  return (
    <main>
      <PageIntro
        eyebrow="By Family"
        title="Fragrance Families"
        description="Seven olfactive worlds. Choose the character, and the Maison will meet you there."
      />
      <Container className="py-14 sm:py-20">
        <div className="grid gap-px overflow-hidden border border-bronze/15 bg-bronze/15 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER.map((family) => {
            const c = FAMILY_COPY[family];
            return (
              <Link
                key={family}
                href={`/fragrance-families/${family}`}
                className="group flex min-h-64 flex-col justify-between bg-charcoal/60 p-8 transition-colors hover:bg-charcoal"
              >
                <span className="font-ui text-xs uppercase tracking-[0.3em] text-antique-gold">
                  {family}
                </span>
                <div>
                  <h2 className="font-display text-3xl text-ivory transition-colors group-hover:text-antique-gold sm:text-4xl">
                    {c.label}
                  </h2>
                  <p className="mt-4 max-w-xs font-editorial text-base italic leading-relaxed text-stone">
                    {c.note}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-ui text-xs uppercase tracking-[0.2em] text-ivory/80">
                    Explore
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
