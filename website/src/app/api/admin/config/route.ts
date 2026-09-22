import { NextRequest, NextResponse } from "next/server";
import {
  assertSameOrigin,
  backendApi,
  getAccessToken,
} from "@/app/api/_lib/bff";

async function proxy(req: NextRequest, path: string, init?: RequestInit) {
  const access = getAccessToken(req);
  if (!access) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let res: Response;
  try {
    res = await fetch(backendApi(path), {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

/** GET /api/admin/config — list all editable config entries (admin only). */
export async function GET(req: NextRequest) {
  return proxy(req, "/admin/config");
}

/** PUT /api/admin/config — update one config key (admin only). */
export async function PUT(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;
  const body = await req.text();
  return proxy(req, "/admin/config", { body, method: "PUT" });
}
