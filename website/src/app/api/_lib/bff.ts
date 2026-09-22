import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

/**
 * Shared BFF plumbing for the website's `/api/*` routes. Every route here is
 * a thin, cookie-authenticated proxy in front of backend-v2 — the browser
 * never sees backend URLs or tokens.
 *
 * - backend-v2 serves everything under the global `/api` prefix, so
 *   `backendApi("/auth/me")` targets `${BACKEND_URL}/api/auth/me`.
 * - Session cookies are httpOnly + SameSite=Lax + Secure in production; the
 *   access/refresh tokens never reach client JavaScript.
 * - Cookie-authenticated mutations additionally pass `assertSameOrigin`
 *   (defense-in-depth on top of SameSite=Lax).
 */
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";
export const ACCESS_COOKIE = "alcedo_access";
export const REFRESH_COOKIE = "alcedo_refresh";

const ACCESS_MAX_AGE = 60 * 20;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export function backendApi(path: string): string {
  return `${BACKEND_URL}/api${path}`;
}

export function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export const accessCookieOpts = () => cookieOpts(ACCESS_MAX_AGE);
export const refreshCookieOpts = () => cookieOpts(REFRESH_MAX_AGE);

/** Expires both session cookies with the same path they were set on. */
export function clearSessionCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, "", { ...cookieOpts(0), maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...cookieOpts(0), maxAge: 0 });
}

export function getAccessToken(req: NextRequest): string | null {
  return req.cookies.get(ACCESS_COOKIE)?.value ?? null;
}

export function getRefreshToken(req: NextRequest): string | null {
  return req.cookies.get(REFRESH_COOKIE)?.value ?? null;
}

/**
 * Defense-in-depth CSRF check for cookie-authenticated mutations. The
 * primary defense is SameSite=Lax on the session cookies (cross-site POSTs
 * don't carry them); this additionally rejects a forged request whose
 * Origin header names another site. Returns an error response when the
 * request must be blocked, or null when it may proceed.
 */
export function assertSameOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }
  if (host !== req.nextUrl.host) {
    return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
  }
  return null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function isTokenPair(value: unknown): value is TokenPair {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.accessToken === "string" &&
    p.accessToken.length > 0 &&
    typeof p.refreshToken === "string" &&
    p.refreshToken.length > 0
  );
}

/**
 * Backend rotation (`POST /auth/refresh`), single-flight per refresh token.
 * Two concurrent BFF requests sharing one refresh cookie must not both hit
 * the backend: the loser would get AUTH_REFRESH_REUSED and wipe cookies the
 * winner just set, signing the user out. The key is a SHA-256 hash — the raw
 * token is never used as a map key, logged, or persisted.
 */
const refreshInFlight = new Map<string, Promise<TokenPair | null>>();

export async function refreshTokenPair(refreshToken: string): Promise<TokenPair | null> {
  const key = createHash("sha256").update(refreshToken).digest("hex");
  const existing = refreshInFlight.get(key);
  if (existing) return existing;
  const task = (async (): Promise<TokenPair | null> => {
    let res: Response;
    try {
      res = await fetch(backendApi("/auth/refresh"), {
        body: JSON.stringify({ refreshToken }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    } catch {
      return null;
    }
    if (!res.ok) return null;
    const pair: unknown = await res.json().catch(() => null);
    return isTokenPair(pair) ? pair : null;
  })();
  refreshInFlight.set(key, task);
  try {
    return await task;
  } finally {
    if (refreshInFlight.get(key) === task) refreshInFlight.delete(key);
  }
}

/** Only https: URLs may be handed to the browser for an external redirect. */
export function isHttpsUrl(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\/[^/]/.test(value);
}
