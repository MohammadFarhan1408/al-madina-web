"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { usersService, notificationsService } from "@/services/account.service";
import { addressesService } from "@/services/addresses.service";
import { productsService } from "@/services/products.service";
import { useSessionStore } from "@/store/session.store";
import type { AddressInput, UserPreferences } from "@/types/commerce";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (input: { fullName?: string; avatar?: string }) =>
      usersService.updateProfile(input),
    onSuccess: (user) => useSessionStore.setState({ user }),
  });
}

// ---- Preferences ----
export function usePreferences() {
  return useQuery({
    queryKey: queryKeys.preferences,
    queryFn: () => usersService.getPreferences(),
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<UserPreferences>) => usersService.updatePreferences(input),
    onSuccess: (prefs) => qc.setQueryData(queryKeys.preferences, prefs),
  });
}

// ---- Notifications ----
export function useNotifications() {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => notificationsService.list(pageParam, 20),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    staleTime: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
}

// ---- Addresses ----
export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddressInput) => addressesService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AddressInput> }) =>
      addressesService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useRemoveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

// ---- Reviews ----
export function useCreateReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { rating: number; title: string; body: string }) =>
      productsService.createReview(productId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.productReviews(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.product(productId) });
    },
  });
}
