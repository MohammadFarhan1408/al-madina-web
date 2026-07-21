"use client";

import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/queries/use-account";
import { Spinner, EmptyState } from "@/components/ui/feedback";
import type { Notification } from "@/types/commerce";

const KIND_ICON: Record<Notification["kind"], string> = {
  order: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
  promo: "M4 12l8-8 8 8-8 8-8-8Z",
  system: "M12 8v5M12 16h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
  wishlist: "M12 20s-7-4.5-9.3-8.6C1 8.4 2.5 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.3 0 4.8 3.4 3.1 6.4C19 15.5 12 20 12 20Z",
};

export function AccountNotifications() {
  const query = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  const hasUnread = items.some((n) => !n.read);

  if (query.isLoading) return <div className="py-16 text-center"><Spinner className="h-7 w-7" /></div>;
  if (items.length === 0) {
    return <EmptyState title="No notifications" body="Order updates and news will appear here." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ivory">Notifications</h2>
        {hasUnread && (
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="font-ui text-xs uppercase tracking-[0.16em] text-antique-gold hover:text-gold-bright disabled:opacity-50"
          >
            Mark all read
          </button>
        )}
      </div>

      <ul className="mt-6 divide-y divide-bronze/15 border-y border-bronze/15">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => !n.read && markRead.mutate(n.id)}
              className={`flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-charcoal/30 ${n.read ? "opacity-60" : ""}`}
            >
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-bronze/30 text-antique-gold">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d={KIND_ICON[n.kind]} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-ui text-sm text-ivory">{n.title}</span>
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-antique-gold" />}
                </span>
                <span className="mt-1 block font-ui text-sm leading-relaxed text-stone">{n.body}</span>
                <span className="mt-2 block font-ui text-[0.65rem] uppercase tracking-[0.14em] text-bronze">
                  {new Date(n.date).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {query.hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="border border-bronze/50 px-8 py-3 font-ui text-xs uppercase tracking-[0.2em] text-ivory hover:border-antique-gold hover:text-antique-gold disabled:opacity-50"
          >
            {query.isFetchingNextPage ? "Loading" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
