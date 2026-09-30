// Order/payment idempotency keys must be real UUIDs (backend: z.string().uuid()).
// crypto.randomUUID() needs a secure context (HTTPS or localhost); this falls
// back to crypto.getRandomValues, which doesn't, so plain-HTTP hosts (and any
// non-localhost dev/staging box) don't 422 on order placement.
export function generateUuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
