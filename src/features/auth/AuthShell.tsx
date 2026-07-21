import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { BrandMark } from "@/components/BrandMark";

/** Centered auth card used by login / register / password screens. */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-[80vh] place-items-center pt-32 pb-20">
      <Container className="w-full">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <Link href="/" className="inline-flex text-antique-gold" aria-label="Home">
              <BrandMark className="h-10 w-10" />
            </Link>
            <p className="mt-6 overline">{eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{title}</h1>
            {subtitle && (
              <p className="mt-4 font-ui text-sm leading-relaxed text-stone">{subtitle}</p>
            )}
          </div>

          <div className="mt-10">{children}</div>

          {footer && (
            <div className="mt-8 text-center font-ui text-sm text-stone">{footer}</div>
          )}
        </div>
      </Container>
    </main>
  );
}
