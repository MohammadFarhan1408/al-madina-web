"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/queries/use-orders";
import { Spinner, EmptyState } from "@/components/ui/feedback";
import { StatusBadge, PaymentStatusBadge, statusTone } from "@/features/order/parts";
import { formatAED } from "@/types/catalog";

export function AccountOrders() {
  const query = useOrders();
  const orders = query.data?.pages.flatMap((p) => p.items) ?? [];

  if (query.isLoading) {
    return <div className="py-16 text-center"><Spinner className="h-7 w-7" /></div>;
  }
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        body="When you place an order, it will appear here for tracking."
        action={{ label: "Shop the collection", href: "/shop" }}
      />
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-ivory">Your Orders</h2>
      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <li key={o.id}>
            <Link
              href={`/account/orders/${o.id}`}
              className="block border border-bronze/20 bg-charcoal/30 p-6 transition-colors hover:border-antique-gold/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-ui text-sm text-ivory">{o.reference}</p>
                  <p className="mt-1 font-ui text-xs uppercase tracking-[0.14em] text-stone">
                    {new Date(o.placedAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    {o.items.length} item{o.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={o.status} tone={statusTone(o.status)} />
                  <PaymentStatusBadge status={o.paymentStatus} />
                </div>
                <span className="font-ui text-base text-ivory">{formatAED(o.total)}</span>
              </div>
              <p className="mt-3 truncate font-ui text-xs text-stone">
                {o.items.map((i) => i.productName).join(" · ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {query.hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="border border-bronze/50 px-8 py-3 font-ui text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold disabled:opacity-50"
          >
            {query.isFetchingNextPage ? "Loading" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
