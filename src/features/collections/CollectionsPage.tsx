import Link from "next/link";
import { Container, PageIntro } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/feedback";
import { collectionsServer } from "@/services/catalog.server";
import type { Collection, CollectionAccent } from "@/types/catalog";

const ACCENT: Record<CollectionAccent, { border: string; text: string; glow: string }> = {
  gold: {
    border: "border-antique-gold/40",
    text: "text-antique-gold",
    glow: "radial-gradient(80% 60% at 50% 0%, rgba(200,162,75,0.16), transparent 70%)",
  },
  emerald: {
    border: "border-emerald/50",
    text: "text-emerald",
    glow: "radial-gradient(80% 60% at 50% 0%, rgba(27,122,77,0.20), transparent 70%)",
  },
  burgundy: {
    border: "border-burgundy/50",
    text: "text-burgundy",
    glow: "radial-gradient(80% 60% at 50% 0%, rgba(124,36,56,0.24), transparent 70%)",
  },
};

export async function CollectionsPage() {
  let collections: Collection[] = [];
  try {
    collections = (await collectionsServer.list()) ?? [];
  } catch {
    collections = [];
  }

  return (
    <main>
      <PageIntro
        eyebrow="Curated"
        title="Collections"
        description="Fragrance families drawn by mood — assembled by the Maison for a moment, a season, an hour."
      />

      <Container className="py-14 sm:py-20">
        {collections.length === 0 ? (
          <EmptyState
            title="Collections are being composed"
            body="Our curated collections will appear here shortly."
            action={{ label: "Shop all fragrances", href: "/shop" }}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((c) => {
              const a = ACCENT[c.accent] ?? ACCENT.gold;
              return (
                <Link
                  key={c.id}
                  href={`/collections/${c.id}`}
                  className={`group relative flex min-h-88 flex-col justify-between overflow-hidden border ${a.border} bg-charcoal/60 p-8 transition-colors hover:bg-charcoal`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{ background: a.glow }}
                  />
                  <div className="relative">
                    <span className={`font-ui text-xs uppercase tracking-[0.3em] ${a.text}`}>
                      {c.productCount} fragrances
                    </span>
                    <h2 className="mt-5 font-display text-3xl leading-tight text-ivory sm:text-4xl">
                      {c.title}
                    </h2>
                    <p className="mt-4 max-w-xs font-editorial text-base italic leading-relaxed text-stone">
                      {c.subtitle}
                    </p>
                  </div>
                  <span className="relative mt-8 inline-flex items-center gap-2 font-ui text-sm uppercase tracking-[0.2em] text-ivory">
                    Discover
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}
