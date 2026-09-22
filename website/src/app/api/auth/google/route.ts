import { NextRequest, NextResponse } from "next/server";
import {
  accessCookieOpts,
  assertSameOrigin,
  backendApi,
  isTokenPair,
  refreshCookieOpts,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "@/app/api/_lib/bff";

/**
 * Google-only login. The client collects a Google ID token via Google
 * Identity Services and posts it here; the BFF exchanges it with the
 * backend and stores the resulting JWT pair in httpOnly cookies.
 * The token pair shape is validated before anything is stored — a malformed
 * backend response must never plant a broken session cookie.
 */
export async function POST(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;
  let body: { idToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body.idToken || typeof body.idToken !== "string") {
    return NextResponse.json({ error: "idToken is required." }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(backendApi("/auth/google"), {
      body: JSON.stringify({ idToken: body.idToken }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
  if (!res.ok) {
    // Generic message: backend error details stay server-side.
    return NextResponse.json({ error: "Google sign-in failed." }, { status: res.status });
  }
  const pair: unknown = await res.json().catch(() => null);
  if (!isTokenPair(pair)) {
    return NextResponse.json({ error: "Google sign-in failed." }, { status: 502 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, pair.accessToken, accessCookieOpts());
  response.cookies.set(REFRESH_COOKIE, pair.refreshToken, refreshCookieOpts());
  return response;
}
