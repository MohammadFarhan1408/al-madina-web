// Same-origin proxy to the backend. The browser talks only to /api/proxy/*;
// this handler keeps the auth tokens in httpOnly cookies (invisible to JS/XSS),
// attaches the Bearer token, and silently rotates it on expiry.
import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api/endpoints";
import {
  ACCESS_MAX_AGE,
  ACCESS_TOKEN_COOKIE,
  REFRESH_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/api/tokens";

type Tokens = { accessToken: string; refreshToken: string };
type Ctx = { params: Promise<{ path: string[] }> };

const FORWARD = ["content-type", "accept", "accept-language", "idempotency-key", "user-agent"];

const errorResponse = (status: number, message: string) =>
  NextResponse.json({ status, message }, { status });

function setAuthCookies(res: NextResponse, t: Tokens) {
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  res.cookies.set(ACCESS_TOKEN_COOKIE, t.accessToken, { ...base, maxAge: ACCESS_MAX_AGE });
  res.cookies.set(REFRESH_TOKEN_COOKIE, t.refreshToken, { ...base, maxAge: REFRESH_MAX_AGE });
}

function clearAuthCookies(res: NextResponse) {
  res.cookies.delete(ACCESS_TOKEN_COOKIE);
  res.cookies.delete(REFRESH_TOKEN_COOKIE);
}

// Refresh tokens rotate, so parallel requests carrying the same one must share
// a single rotation or the losers would revoke the session.
// ponytail: per-process; multiple server instances can still race — add a
// short grace window for the previous refresh token on the API if that bites.
const rotations = new Map<string, Promise<Tokens | null>>();

function rotate(refreshToken: string): Promise<Tokens | null> {
  let p = rotations.get(refreshToken);
  if (!p) {
    p = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
        });
        if (!res.ok) return null;
        const json = await res.json();
        return (json?.data ?? json) as Tokens;
      } catch {
        return null;
      } finally {
        setTimeout(() => rotations.delete(refreshToken), 5_000);
      }
    })();
    rotations.set(refreshToken, p);
  }
  return p;
}

function callBackend(
  req: NextRequest,
  path: string,
  body: BodyInit | undefined,
  accessToken?: string,
  extraHeaders?: Record<string, string>,
) {
  const headers = new Headers();
  for (const h of FORWARD) {
    const v = req.headers.get(h);
    if (v) headers.set(h, v);
  }
  // Keep per-IP rate limiting meaningful: the API sees this server, not the visitor.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) headers.set("x-forwarded-for", xff);
  for (const [k, v] of Object.entries(extraHeaders ?? {})) headers.set(k, v);
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  return fetch(`${API_BASE_URL}/${path}${req.nextUrl.search}`, {
    method: req.method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  });
}

async function handle(req: NextRequest, ctx: Ctx) {
  const path = (await ctx.params).path.join("/");

  // Rotation is internal; never exposed to the browser.
  if (path === "auth/refresh") return errorResponse(404, "Not found");

  // CSRF: SameSite=Lax already blocks cross-site cookies on POSTs; also refuse a
  // mismatched Origin outright.
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return errorResponse(403, "Cross-origin request blocked");
  }

  let access = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  // /auth/me is a normal authenticated read and must be refreshable.
  const isAuthCall = path.startsWith("auth/") && path !== "auth/me";
  const isSignOut = path === "auth/sign-out";

  let body: BodyInit | undefined;
  let extra: Record<string, string> | undefined;
  if (isSignOut) {
    body = JSON.stringify({ refreshToken: refresh ?? "" });
    extra = { "content-type": "application/json" };
  } else if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  let rotated: Tokens | null = null;
  let refreshFailed = false;
  // Access cookie expired but session alive: renew up front so optional-auth
  // routes don't silently run as guest.
  if (!access && refresh && !isAuthCall) {
    rotated = await rotate(refresh);
    if (rotated) access = rotated.accessToken;
    else refreshFailed = true;
  }

  let upstream: Response;
  try {
    upstream = await callBackend(req, path, body, access, extra);
    if (upstream.status === 401 && !isAuthCall && refresh && !rotated && !refreshFailed) {
      rotated = await rotate(refresh);
      if (rotated) upstream = await callBackend(req, path, body, rotated.accessToken, extra);
      else refreshFailed = true;
    }
  } catch {
    return errorResponse(502, "Upstream unavailable");
  }

  const isLogin = path === "auth/sign-in" || path === "auth/sign-up";
  let out: NextResponse;
  if (isLogin && upstream.ok) {
    // Strip the tokens from the body; they travel only as httpOnly cookies.
    const json = await upstream.json();
    const { accessToken, refreshToken, ...data } = json?.data ?? {};
    out = NextResponse.json({ ...json, data }, { status: upstream.status });
    setAuthCookies(out, { accessToken, refreshToken });
  } else {
    const bytes = upstream.status === 204 ? null : await upstream.arrayBuffer();
    out = new NextResponse(bytes, { status: upstream.status });
    for (const h of ["content-type", "retry-after"]) {
      const v = upstream.headers.get(h);
      if (v) out.headers.set(h, v);
    }
  }

  if (rotated) setAuthCookies(out, rotated);
  if (isSignOut || refreshFailed) clearAuthCookies(out);
  return out;
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
