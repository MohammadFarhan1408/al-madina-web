import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "./route";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const ctx = (path: string) => ({ params: Promise.resolve({ path: path.split("/") }) });
const req = (path: string, { cookie, ...init }: { method?: string; body?: string; cookie?: string } = {}) =>
  new NextRequest(`http://localhost:3000/api/proxy/${path}`, {
    ...init,
    headers: { host: "localhost:3000", ...(cookie ? { cookie } : {}) },
  });

afterEach(() => vi.unstubAllGlobals());

describe("auth proxy", () => {
  it("moves sign-in tokens out of the body and into httpOnly cookies", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(200, { data: { user: { id: "1" }, accessToken: "A", refreshToken: "R" } })));
    const res = await POST(req("auth/sign-in", { method: "POST", body: "{}" }), ctx("auth/sign-in"));
    expect(await res.json()).toEqual({ data: { user: { id: "1" } } });
    const cookies = res.headers.getSetCookie().join("\n");
    expect(cookies).toMatch(/am_access_token=A.*HttpOnly/i);
    expect(cookies).toMatch(/am_refresh_token=R.*HttpOnly/i);
  });

  it("refreshes once on 401 and retries with the new token", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(json(401, { status: 401, message: "expired" }))
      .mockResolvedValueOnce(json(200, { data: { accessToken: "A2", refreshToken: "R2" } }))
      .mockResolvedValueOnce(json(200, { data: { id: "1" } }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await GET(req("auth/me", { cookie: "am_access_token=A1; am_refresh_token=R-test-1" }), ctx("auth/me"));
    expect(res.status).toBe(200);
    expect(fetchMock.mock.calls[2][1].headers.get("authorization")).toBe("Bearer A2");
    expect(res.headers.getSetCookie().join("\n")).toContain("am_access_token=A2");
  });

  it("does not expose /auth/refresh and rejects foreign origins", async () => {
    expect((await POST(req("auth/refresh", { method: "POST" }), ctx("auth/refresh"))).status).toBe(404);
    const evil = new NextRequest("http://localhost:3000/api/proxy/cart", {
      method: "POST",
      headers: { host: "localhost:3000", origin: "https://evil.example" },
    });
    expect((await POST(evil, ctx("cart"))).status).toBe(403);
  });
});
