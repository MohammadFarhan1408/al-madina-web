import { apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export const newsletterService = {
  subscribe: (email: string) => apiPost<null>(endpoints.newsletter, { email }),
};
