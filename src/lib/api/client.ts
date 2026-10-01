// Central axios instance for all client-side (browser) data access.
// Talks to the same-origin /api/proxy route, which holds the httpOnly auth
// cookies, attaches the Bearer token and silently refreshes it — so this file
// never touches a token. Responses are normalized to ApiError; a 401 here
// means the proxy already tried (and failed) to refresh.

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

import { ApiError, type ApiErrorBody } from "./types";

export const api = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    if (status === 401 && !error.config?.url?.includes("/auth/")) onUnauthorized?.();

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
