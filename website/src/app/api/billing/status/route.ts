import { NextRequest, NextResponse } from "next/server";
import {
  assertSameOrigin,
  backendApi,
  getAccessToken,
  isHttpsUrl,
} from "@/app/api/_lib/bff";

/** Billing status for the signed-in user (proxies GET /billing/status). */
export async function GET(req: NextRequest) {
  const access = getAccessToken(req);
  if (!access) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let res: Response;
  try {
    res = await fetch(backendApi("/billing/status"), {
      headers: { Authorization: `Bearer ${access}` },
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
  if (!res.ok) {
    return NextResponse.json({ error: "Could not load billing status." }, { status: res.status });
  }
  return NextResponse.json(await res.json().catch(() => null));
}

/**
 * Stripe Customer Portal session (proxies POST /billing/portal).
 * The backend takes no body and chooses the return URL itself.
 * Returns { url: string | null } — null when the user has no Stripe
 * customer yet (nothing to manage); the page says so honestly.
 */
export async function POST(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;
  const access = getAccessToken(req);
  if (!access) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let res: Response;
  try {
    res = await fetch(backendApi("/billing/portal"), {
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
    return NextResponse.json({ error: "Could not open the billing portal." }, { status: res.status });
  }
  const data: unknown = await res.json().catch(() => null);
  const url = (data as { url?: unknown } | null)?.url;
  if (url !== null && !isHttpsUrl(url)) {
    return NextResponse.json({ error: "Could not open the billing portal." }, { status: 502 });
  }
  return NextResponse.json({ url });
}
