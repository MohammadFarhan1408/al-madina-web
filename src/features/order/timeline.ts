import type { Order, OrderStatus } from "@/types/commerce";

/**
 * When the order last entered each status, from the API's statusHistory.
 * Orders placed before the history existed have none — callers fall back to
 * placedAt for "processing" and show no date for later steps.
 */
export function statusDates(
  order: Pick<Order, "statusHistory" | "placedAt">,
): Partial<Record<OrderStatus, string>> {
  const dates: Partial<Record<OrderStatus, string>> = {
    processing: order.placedAt,
  };
  for (const h of order.statusHistory ?? []) dates[h.status] = h.at;
  return dates;
}
