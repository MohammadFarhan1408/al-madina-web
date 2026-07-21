"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/ui/primitives";
import { Spinner } from "@/components/ui/feedback";
import { useSessionStore } from "@/store/session.store";

const NAV = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Notifications", href: "/account/notifications" },
  { label: "Profile", href: "/account/profile" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const hydrated = useSessionStore((s) => s.hydrated);
  const user = useSessionStore((s) => s.user);
  const signOut = useSessionStore((s) => s.signOut);

  // Client-side guard (proxy.ts already gates at the edge on cookie presence).
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <main className="grid min-h-[60vh] place-items-center pt-32">
        <Spinner className="h-8 w-8" />
      </main>
    );
  }

  return (
    <main>
      <div className="border-b border-bronze/15 pt-32 pb-10 sm:pt-40">
        <Container>
          <p className="overline">My Account</p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-6xl">
            {user?.fullName?.split(" ")[0] ?? "Welcome"}
          </h1>
          <p className="mt-3 font-ui text-sm text-stone">
            {user?.tier} · {user?.email}
          </p>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {NAV.map((n) => {
              const active =
                n.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`shrink-0 border-l-2 px-4 py-3 font-ui text-xs uppercase tracking-[0.18em] transition-colors lg:border-l-2 ${
                    active
                      ? "border-antique-gold text-antique-gold"
                      : "border-transparent text-ivory/70 hover:text-ivory"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/");
              }}
              className="shrink-0 border-l-2 border-transparent px-4 py-3 text-left font-ui text-xs uppercase tracking-[0.18em] text-ivory/50 transition-colors hover:text-burgundy"
            >
              Sign Out
            </button>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </Container>
    </main>
  );
}
