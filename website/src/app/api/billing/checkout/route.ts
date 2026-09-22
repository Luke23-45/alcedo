import { NextRequest, NextResponse } from "next/server";
import {
  assertSameOrigin,
  backendApi,
  getAccessToken,
  isHttpsUrl,
} from "@/app/api/_lib/bff";

/**
 * Creates a Stripe Checkout Session for the signed-in user.
 * Body: { priceId: string } — only the price ID. Redirect targets are
 * backend-controlled (`/account?upgraded=1` on success,
 * `/pricing?cancelled=1` on cancel); the client must not supply them.
 * Returns { url } to redirect the browser to.
 */
export async function POST(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;
  const access = getAccessToken(req);
  if (!access) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let body: { priceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body.priceId || typeof body.priceId !== "string") {
    return NextResponse.json({ error: "priceId is required." }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(backendApi("/billing/checkout"), {
      body: JSON.stringify({ priceId: body.priceId }),
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
  if (!res.ok) {
    if (res.status === 409) {
      return NextResponse.json(
        { error: "This account already has an active premium subscription." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Could not start checkout." }, { status: res.status });
  }
  const data: unknown = await res.json().catch(() => null);
  const url = (data as { url?: unknown } | null)?.url;
  if (!isHttpsUrl(url)) {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
  return NextResponse.json({ url });
}
