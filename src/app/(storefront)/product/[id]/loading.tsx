import { Container } from "@/components/ui/primitives";
import { Skeleton } from "@/components/ui/feedback";

export default function Loading() {
  return (
    <main className="pt-24 sm:pt-28">
      <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="flex flex-col gap-4 pt-4">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="mt-6 h-24 w-full" />
          <Skeleton className="mt-6 h-12 w-1/2" />
        </div>
      </Container>
    </main>
  );
}
