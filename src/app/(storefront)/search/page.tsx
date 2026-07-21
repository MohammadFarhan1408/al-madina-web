import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPage } from "@/features/search/SearchPage";
import { Container, PageIntro } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Al Madina Ittar fragrances by name, note or family.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main>
          <PageIntro eyebrow="Search" title="Find your scent" align="center" />
          <Container className="py-16" />
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
