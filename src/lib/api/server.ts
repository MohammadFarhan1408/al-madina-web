// Server-side fetch for React Server Components + generateMetadata.
// Public catalog reads only (no auth needed) — uses native fetch so Next can
// cache/revalidate. Returns the unwrapped `{ data }` payload, or null on 404.
import "server-only";
import { API_BASE_URL } from "./endpoints";
import type { ApiEnvelope } from "./types";

type ServerGetOptions = {
  /** ISR revalidate window in seconds (default 5 min). */
  revalidate?: number;
  query?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, query?: ServerGetOptions["query"]) {
  const url = new URL(API_BASE_URL + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/** Fetch a public endpoint on the server. Throws on non-404 errors; null on 404. */
export async function serverGet<T>(
  path: string,
  { revalidate = 300, query }: ServerGetOptions = {},
): Promise<T | null> {
  const res = await fetch(buildUrl(path, query), {
    next: { revalidate },
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API ${res.status} for ${path}`);
  }
  const body = (await res.json()) as ApiEnvelope<T> | T;
  return (body as ApiEnvelope<T>)?.data ?? (body as T);
}
