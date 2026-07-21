"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/auth.service";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/api/tokens";
import type { User } from "@/types/commerce";

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean; // true once boot restoration has run
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (fullName: string, email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  hydrateFromToken: () => Promise<void>;
  setUnauthenticated: () => void;
}

// Merge guest cart/wishlist into the server after login. Dynamic import breaks
// the session-sync ↔ session-store circular dependency; best-effort.
async function mergeGuestData() {
  try {
    const { syncGuestDataOnLogin } = await import("./session-sync");
    await syncGuestDataOnLogin();
  } catch {
    // non-fatal — background sync will still mirror later edits
  }
}

// Only user + isAuthenticated are persisted; tokens live in cookies.
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,

      signIn: async (email, password) => {
        const res = await authService.signIn({ email, password });
        setTokens(res.accessToken, res.refreshToken);
        set({ user: res.user, isAuthenticated: true, hydrated: true });
        await mergeGuestData();
        return res.user;
      },

      signUp: async (fullName, email, password) => {
        const res = await authService.signUp({ fullName, email, password });
        setTokens(res.accessToken, res.refreshToken);
        set({ user: res.user, isAuthenticated: true, hydrated: true });
        await mergeGuestData();
        return res.user;
      },

      signOut: async () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            await authService.signOut(refreshToken);
          } catch {
            // best-effort — clear locally regardless
          }
        }
        clearTokens();
        set({ user: null, isAuthenticated: false, hydrated: true });
      },

      // Session restoration at boot: re-validate the cached user against the
      // backend so a stale user can't outlive its token.
      hydrateFromToken: async () => {
        if (!getAccessToken() && !getRefreshToken()) {
          set({ user: null, isAuthenticated: false, hydrated: true });
          return;
        }
        try {
          const user = await authService.me();
          set({ user, isAuthenticated: true, hydrated: true });
        } catch {
          clearTokens();
          set({ user: null, isAuthenticated: false, hydrated: true });
        }
      },

      setUnauthenticated: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "am_session",
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
);
