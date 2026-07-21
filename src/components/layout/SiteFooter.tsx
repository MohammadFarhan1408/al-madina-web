import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/BrandMark";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Fragrances", href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "Fragrance Families", href: "/fragrance-families" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Journal", href: "/about" },
      { label: "My Account", href: "/account" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-bronze/20 bg-rich-black">
      <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 text-antique-gold">
              <BrandMark className="h-9 w-9" />
              <Wordmark className="text-ivory" />
            </div>
            <p className="mt-6 max-w-xs font-editorial text-lg italic leading-relaxed text-stone">
              A Maison of Arabian perfumery — composed in shadow and gold.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-ui text-xs uppercase tracking-[0.28em] text-antique-gold">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="font-ui text-sm text-ivory-dim/70 transition-colors hover:text-ivory"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bronze/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-ui text-xs tracking-wide text-stone">
            © {new Date().getFullYear()} Al Madina Ittar. All rights reserved.
          </p>
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-bronze">
            Prices in AED
          </p>
        </div>
      </div>
    </footer>
  );
}
