import { NextRequest, NextResponse } from "next/server";
import { isMeResponse } from "@/lib/me";
import {
  accessCookieOpts,
  backendApi,
  clearSessionCookies,
  getAccessToken,
  getRefreshToken,
  refreshCookieOpts,
  refreshTokenPair,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "@/app/api/_lib/bff";

async function backendMe(accessToken: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(backendApi("/auth/me"), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

function clearSession(): NextResponse {
  const response = NextResponse.json({ error: "Session expired." }, { status: 401 });
  clearSessionCookies(response);
  return response;
}

/**
 * Current user: identity, premium entitlement, admin flag.
 * Transparently refreshes the access token when it has expired, so the
 * session persists across visits without the client handling tokens.
 * Concurrent refreshes for the same session share one backend rotation
 * (single-flight in the BFF lib) — otherwise the loser would wipe the
 * cookies the winner just set and sign the user out.
 */
export async function GET(req: NextRequest) {
  const access = getAccessToken(req);
  const refresh = getRefreshToken(req);
  if (!access && !refresh) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (access) {
    const me = await backendMe(access);
    if (isMeResponse(me)) return NextResponse.json(me);
  }

  // Access token expired or invalid — try the rotating refresh token.
  if (refresh) {
    const pair = await refreshTokenPair(refresh);
    if (pair) {
      const me = await backendMe(pair.accessToken);
      if (isMeResponse(me)) {
        const response = NextResponse.json(me);
        response.cookies.set(ACCESS_COOKIE, pair.accessToken, accessCookieOpts());
        response.cookies.set(REFRESH_COOKIE, pair.refreshToken, refreshCookieOpts());
        return response;
      }
    }
  }

  // Both tokens are dead — clear the cookies so the UI shows signed-out.
  return clearSession();
}

/** Sign out: revokes the refresh token server-side and clears cookies. */
export async function DELETE(req: NextRequest) {
  const access = getAccessToken(req);
  const refresh = getRefreshToken(req);
  if (access && refresh) {
    await fetch(backendApi("/auth/logout"), {
      body: JSON.stringify({ refreshToken: refresh }),
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }).catch(() => {
      // Logout is best-effort; cookies are cleared regardless.
    });
  }
  return signedOutResponse();
}

function signedOutResponse(): NextResponse {
  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
}
