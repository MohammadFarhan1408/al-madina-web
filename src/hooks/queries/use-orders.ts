"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { ordersService } from "@/services/orders.service";
import { addressesService } from "@/services/addresses.service";
import type {
  CreateOrderInput,
  Order,
  OrderStatus,
} from "@/types/commerce";

// Card/wallet payments settle via an async gateway callback with no push
// channel back to the client, so this polls — but only for a bounded window.
// Past it, the gateway is either slow or never going to call back; the UI
// falls back to "we'll email you" (see isPaymentPollTimedOut) instead of
// polling forever.
const PAYMENT_POLL_INTERVAL_MS = 2000;
const PAYMENT_POLL_TIMEOUT_MS = 2 * 60 * 1000;

/** How long an order has been sitting in its current payment status. */
function msSincePaymentStatusChange(order: Order): number {
  return Date.now() - new Date(order.updatedAt).getTime();
}

/** True once polling has given up on a still-processing payment. */
export function isPaymentPollTimedOut(order: Order): boolean {
  return (
    order.paymentStatus === "processing" &&
    msSincePaymentStatusChange(order) >= PAYMENT_POLL_TIMEOUT_MS
  );
}

/** Single order, polling while payment is still settling (mirrors mobile). */
export function useOrder(id: string, email?: string, initialData?: Order) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersService.get(id, email),
    enabled: !!id,
    initialData,
    refetchOnMount: "always",
    refetchInterval: (query) => {
      const order = query.state.data;
      if (order?.paymentStatus !== "processing") return false;
      return msSincePaymentStatusChange(order) < PAYMENT_POLL_TIMEOUT_MS
        ? PAYMENT_POLL_INTERVAL_MS
        : false;
    },
  });
}

export function useOrderPayments(id: string, email?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.orderPayments(id),
    queryFn: () => ordersService.payments(id, email),
    enabled: !!id && enabled,
    staleTime: 10 * 1000,
  });
}

export function useOrders(status?: OrderStatus) {
  return useInfiniteQuery({
    queryKey: queryKeys.orders({ status }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => ordersService.list(pageParam, 10, status),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersService.create(input),
    onSuccess: (order) => {
      qc.setQueryData(queryKeys.order(order.id), order);
      qc.invalidateQueries({ queryKey: queryKeys.orders() });
    },
  });
}

export function useRetryPayment(id: string, email?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idempotencyKey: string) =>
      ordersService.retryPayment(id, idempotencyKey, email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.order(id) });
      qc.invalidateQueries({ queryKey: queryKeys.orderPayments(id) });
    },
  });
}

// ---- Addresses ----
export function useAddresses(enabled = true) {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: () => addressesService.list(),
    enabled,
  });
}
