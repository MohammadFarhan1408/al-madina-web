// Auth tokens live in httpOnly cookies that only the same-origin API proxy
// (src/app/api/proxy/[...path]/route.ts) reads or writes — browser JS never
// sees them. proxy.ts also reads these names to gate /account server-side.

export const ACCESS_TOKEN_COOKIE = "am_access_token";
export const REFRESH_TOKEN_COOKIE = "am_refresh_token";

export const ACCESS_MAX_AGE = 60 * 60; // 1h ceiling; renewed on refresh
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
