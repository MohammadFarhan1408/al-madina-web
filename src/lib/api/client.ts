// Central axios instance for all client-side (browser) data access.
// - Request interceptor attaches the Bearer access token from the cookie.
// - Response interceptor normalizes errors to ApiError and performs a single
//   silent token refresh + retry on 401 (rotating refresh tokens).
// Mirrors al-madina-admin/src/libs/api/axios.ts and the mobile client.

import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { ApiError, type ApiErrorBody } from "./types";
import { API_BASE_URL, endpoints } from "./endpoints";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokens";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Bare client for the refresh call so it never loops through the interceptor.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// De-duplicate concurrent refreshes into one in-flight promise.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return null;
        const { data } = await refreshClient.post(endpoints.auth.refresh, {
          refreshToken,
        });
        const payload = data?.data ?? data;
        setTokens(payload.accessToken, payload.refreshToken);
        return payload.accessToken as string;
      } catch {
        clearTokens();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes("/auth/");

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(original);
      }
      // Refresh failed — session store's unauthorized handler resets state.
      onUnauthorized?.();
    }

    const body: ApiErrorBody = error.response?.data ?? {
      status: status ?? 0,
      message: error.message || "Network error",
    };
    return Promise.reject(new ApiError(body));
  },
);

// Registered by the session store at boot (avoids a circular import).
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (h: (() => void) | null) => {
  onUnauthorized = h;
};

/** Unwraps the `{ data }` envelope and returns the payload. */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.get(url, config);
  return (res.data?.data ?? res.data) as T;
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await api.post(url, body, config);
  return (res.data?.data ?? res.data) as T;
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await api.patch(url, body, config);
  return (res.data?.data ?? res.data) as T;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.delete(url, config);
  return (res.data?.data ?? res.data) as T;
}
