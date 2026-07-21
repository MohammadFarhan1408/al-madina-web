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

/** Single order, polling while payment is still settling (mirrors mobile). */
export function useOrder(id: string, email?: string, initialData?: Order) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersService.get(id, email),
    enabled: !!id,
    initialData,
    refetchOnMount: "always",
    refetchInterval: (query) =>
      query.state.data?.paymentStatus === "processing" ? 2000 : false,
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

export function useRetryPayment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idempotencyKey: string) =>
      ordersService.retryPayment(id, idempotencyKey),
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
