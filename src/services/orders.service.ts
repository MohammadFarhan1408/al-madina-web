import { apiGet, apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Paginated } from "@/lib/api/types";
import type {
  CreateOrderInput,
  Order,
  OrderStatus,
  Transaction,
} from "@/types/commerce";

export const ordersService = {
  create: (input: CreateOrderInput) =>
    apiPost<Order>(endpoints.orders.create, input),

  list: (page = 1, limit = 10, status?: OrderStatus) =>
    apiGet<Paginated<Order>>(endpoints.orders.list, {
      params: { page, limit, ...(status ? { status } : {}) },
    }),

  /** Guests pass their email to match guestEmail; owners resolve by userId. */
  get: (id: string, email?: string) =>
    apiGet<Order>(endpoints.orders.detail(id), {
      params: email ? { email } : undefined,
    }),

  payments: (id: string, email?: string) =>
    apiGet<Transaction[]>(endpoints.orders.payments(id), {
      params: email ? { email } : undefined,
    }),

  retryPayment: (id: string, idempotencyKey: string) =>
    apiPost<Transaction>(endpoints.orders.retryPayment(id), { idempotencyKey }),
};
