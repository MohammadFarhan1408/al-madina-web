import { Container, PageIntro } from "@/components/ui/primitives";
import { ProductGridSkeleton } from "@/components/ui/feedback";

export default function Loading() {
  return (
    <main>
      <PageIntro eyebrow="Category" title="—" />
      <Container className="py-16">
        <ProductGridSkeleton />
      </Container>
    </main>
  );
}
