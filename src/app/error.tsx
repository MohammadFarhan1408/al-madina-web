"use client";

import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/primitives";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rich-black px-6 text-center">
      <BrandMark className="h-12 w-12 text-antique-gold" />
      <p className="overline mt-8 text-burgundy">Something went wrong</p>
      <h1 className="mt-5 font-display text-4xl text-ivory sm:text-6xl">A Small Disturbance</h1>
      <p className="mt-5 max-w-md font-ui text-sm leading-relaxed text-stone">
        We couldn&apos;t load this page. Please try again — if the issue continues, contact us.
      </p>
      <Button onClick={reset} variant="outline" className="mt-10">
        Try Again
      </Button>
    </main>
  );
}
