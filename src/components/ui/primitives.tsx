import Link from "next/link";
import { formatAED } from "@/types/catalog";

// ---- Container: the site-wide max width + responsive padding ----
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag className={`mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </Tag>
  );
}

// ---- Button variants (mirror the homepage CTAs) ----
type Variant = "gold" | "outline" | "ghost";

const VARIANT: Record<Variant, string> = {
  gold: "bg-antique-gold text-rich-black hover:bg-gold-bright",
  outline:
    "border border-bronze/60 text-ivory hover:border-antique-gold hover:text-antique-gold",
  ghost: "text-ivory/85 hover:text-antique-gold",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-ui text-[0.78rem] uppercase tracking-[0.2em] px-8 py-3.5 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-45";

export function Button({
  variant = "gold",
  className = "",
  ...props
}: { variant?: Variant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${BASE} ${VARIANT[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "gold",
  className = "",
  href,
  children,
  ...props
}: { variant?: Variant; href: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

// ---- Section header: overline + display heading + optional trailing link ----
export function SectionHeader({
  eyebrow,
  title,
  action,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 ${className}`}>
      <div>
        {eyebrow && <p className="overline">{eyebrow}</p>}
        <h2 className="mt-5 font-display text-4xl leading-none text-ivory sm:text-6xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="font-ui text-sm uppercase tracking-[0.2em] text-antique-gold transition-colors hover:text-gold-bright"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

// ---- Page intro: editorial header that clears the fixed nav ----
export function PageIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`border-b border-bronze/15 pt-32 pb-14 sm:pt-40 sm:pb-16 ${className}`}
    >
      <Container>
        <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow && <p className="overline">{eyebrow}</p>}
          <h1 className="mt-5 font-display text-5xl leading-[0.95] text-ivory sm:text-7xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 font-editorial text-lg italic leading-relaxed text-stone">
              {description}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}

// ---- Price: integer AED, optional strikethrough originalPrice ----
export function Price({
  amount,
  original,
  className = "",
}: {
  amount: number;
  original?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-ui text-ivory">{formatAED(amount)}</span>
      {original && original > amount && (
        <span className="font-ui text-xs text-stone line-through">
          {formatAED(original)}
        </span>
      )}
    </span>
  );
}

// ---- Rating: gold stars + count ----
export function Rating({
  value,
  count,
  className = "",
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const full = Math.round(value);
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-ui text-xs text-bronze ${className}`}
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
    >
      <span className="tracking-[0.1em] text-antique-gold" aria-hidden>
        {"★".repeat(full)}
        <span className="text-smoke">{"★".repeat(5 - full)}</span>
      </span>
      <span>
        {value.toFixed(1)}
        {count != null && ` · ${count}`}
      </span>
    </span>
  );
}

// ---- Badge chip (new / bestseller / etc.) ----
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 border border-bronze/50 px-2 py-0.5 font-ui text-[0.6rem] uppercase tracking-[0.2em] text-champagne">
      {children}
    </span>
  );
}
