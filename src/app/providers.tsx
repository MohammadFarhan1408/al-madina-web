"use client";

import { useEffect } from "react";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { useSessionStore } from "@/store/session.store";
import { startBackgroundSync } from "@/store/session-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore session against the backend, and let the axios client reset
    // session state when a refresh ultimately fails (401 → logout).
    void useSessionStore.getState().hydrateFromToken();
    setUnauthorizedHandler(() => useSessionStore.getState().setUnauthenticated());
    // Mirror later cart/wishlist edits to the server while authenticated.
    startBackgroundSync();
    return () => setUnauthorizedHandler(null);
  }, []);

  return <QueryProvider>{children}</QueryProvider>;
}
