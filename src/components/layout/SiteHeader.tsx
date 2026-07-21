"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCartCount } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useSessionStore } from "@/store/session.store";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Fragrances", href: "/fragrance-families" },
  { label: "Our Story", href: "/about" },
];

const ICONS = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4",
  account: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0",
  wishlist:
    "M12 20s-7-4.5-9.3-8.6C1 8.4 2.5 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.3 0 4.8 3.4 3.1 6.4C19 15.5 12 20 12 20Z",
  bag: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
};

function IconLink({
  d,
  label,
  href,
  count,
}: {
  d: string;
  label: string;
  href: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      aria-label={count ? `${label} (${count})` : label}
      className="relative grid h-9 w-9 place-items-center text-ivory/85 transition-colors hover:text-antique-gold"
    >
      <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count != null && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-antique-gold px-1 font-ui text-[0.58rem] font-semibold text-rich-black">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartCount();
  const wishCount = useWishlistStore((s) => s.ids.length);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  // Persisted stores hydrate after mount; gate counts to avoid SSR mismatch.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  const accountHref = isAuthenticated ? "/account" : "/login";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-bronze/20 bg-rich-black/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="text-ivory" aria-label="Al Madina Ittar — home">
          <Image src="/images/al-madina-mark.png" alt="Al Madina Ittar" width={36} height={54} className="h-9 w-auto object-contain" priority />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="relative font-ui text-[0.82rem] uppercase tracking-[0.2em] text-ivory/85 transition-colors hover:text-antique-gold after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-antique-gold after:transition-all hover:after:w-full"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden sm:flex">
            <IconLink d={ICONS.search} label="Search" href="/search" />
            <IconLink d={ICONS.account} label="Account" href={accountHref} />
            <IconLink
              d={ICONS.wishlist}
              label="Wishlist"
              href="/wishlist"
              count={mounted ? wishCount : 0}
            />
          </div>
          <IconLink
            d={ICONS.bag}
            label="Bag"
            href="/cart"
            count={mounted ? cartCount : 0}
          />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ml-1 grid h-9 w-9 place-items-center text-ivory/85 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="border-t border-bronze/20 bg-rich-black/95 px-5 py-6 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-5">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link href={n.href} className="font-display text-2xl text-ivory">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-6 border-t border-bronze/20 pt-6">
            <Link href="/search" className="font-ui text-xs uppercase tracking-[0.2em] text-ivory/80">Search</Link>
            <Link href={accountHref} className="font-ui text-xs uppercase tracking-[0.2em] text-ivory/80">Account</Link>
            <Link href="/wishlist" className="font-ui text-xs uppercase tracking-[0.2em] text-ivory/80">Wishlist</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
