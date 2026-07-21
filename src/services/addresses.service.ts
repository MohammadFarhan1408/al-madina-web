import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Address, AddressInput } from "@/types/commerce";

// All address endpoints are requireAuth. Setting isDefault clears the previous.
export const addressesService = {
  list: () => apiGet<Address[]>(endpoints.addresses.list),
  create: (input: AddressInput) =>
    apiPost<Address>(endpoints.addresses.create, input),
  update: (id: string, input: Partial<AddressInput>) =>
    apiPatch<Address>(endpoints.addresses.item(id), input),
  remove: (id: string) => apiDelete<null>(endpoints.addresses.item(id)),
};
