import { apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export const contactService = {
  submit: (input: { name: string; email: string; message: string }) =>
    apiPost<null>(endpoints.contact, input),
};
