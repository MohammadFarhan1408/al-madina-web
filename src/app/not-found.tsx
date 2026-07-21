import { BrandMark } from "@/components/BrandMark";
import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rich-black px-6 text-center">
      <BrandMark className="h-12 w-12 text-antique-gold" />
      <p className="overline mt-8">404</p>
      <h1 className="mt-5 font-display text-4xl text-ivory sm:text-6xl">Nothing Found Here</h1>
      <p className="mt-5 max-w-md font-ui text-sm leading-relaxed text-stone">
        The page you&apos;re looking for has moved, or never existed. Let us guide you back to the
        collection.
      </p>
      <ButtonLink href="/" variant="outline" className="mt-10">
        Return Home
      </ButtonLink>
    </main>
  );
}
