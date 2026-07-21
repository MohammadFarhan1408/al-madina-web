"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/queries/use-orders";
import { useWishlistStore } from "@/store/wishlist.store";
import { Spinner } from "@/components/ui/feedback";
import { StatusBadge, statusTone } from "@/features/order/parts";
import { formatAED } from "@/types/catalog";

export function AccountDashboard() {
  const orders = useOrders();
  const recent = orders.data?.pages[0]?.items.slice(0, 3) ?? [];
  const wishCount = useWishlistStore((s) => s.ids.length);

  return (
    <div className="space-y-12">
      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/account/orders" label="Orders" value={String(orders.data?.pages[0]?.total ?? "—")} />
        <QuickLink href="/wishlist" label="Wishlist" value={String(wishCount)} />
        <QuickLink href="/account/addresses" label="Addresses" value="Manage" />
      </div>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ivory">Recent Orders</h2>
          <Link href="/account/orders" className="font-ui text-xs uppercase tracking-[0.16em] text-antique-gold hover:text-gold-bright">
            View all →
          </Link>
        </div>

        {orders.isLoading ? (
          <div className="py-12 text-center"><Spinner /></div>
        ) : recent.length === 0 ? (
          <p className="mt-6 font-editorial text-lg italic text-stone">
            No orders yet.{" "}
            <Link href="/shop" className="text-antique-gold not-italic hover:underline">Discover the Maison →</Link>
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-bronze/15 border-y border-bronze/15">
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-4 py-5 transition-colors hover:bg-charcoal/30">
                  <div>
                    <p className="font-ui text-sm text-ivory">{o.reference}</p>
                    <p className="mt-1 font-ui text-xs uppercase tracking-[0.14em] text-stone">
                      {new Date(o.placedAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <StatusBadge label={o.status} tone={statusTone(o.status)} />
                  <span className="font-ui text-sm text-ivory">{formatAED(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function QuickLink({ href, label, value }: { href: string; label: string; value: string }) {
  return (
    <Link
      href={href}
      className="group border border-bronze/20 bg-charcoal/40 p-6 transition-colors hover:border-antique-gold/50"
    >
      <p className="font-display text-3xl text-ivory group-hover:text-antique-gold">{value}</p>
      <p className="mt-2 font-ui text-xs uppercase tracking-[0.2em] text-bronze">{label}</p>
    </Link>
  );
}
