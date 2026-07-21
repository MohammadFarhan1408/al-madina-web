import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Paginated } from "@/lib/api/types";
import type { Notification, User } from "@/types/commerce";

export const usersService = {
  updateProfile: (input: { fullName?: string; avatar?: string }) =>
    apiPatch<User>(endpoints.users.me, input),
};

export const notificationsService = {
  list: (page = 1, limit = 20) =>
    apiGet<Paginated<Notification>>(endpoints.notifications.list, {
      params: { page, limit },
    }),
  markRead: (id: string) => apiPatch<null>(endpoints.notifications.read(id)),
  markAllRead: () => apiPatch<null>(endpoints.notifications.readAll),
};
