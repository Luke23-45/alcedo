import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin, backendApi, getAccessToken } from "@/app/api/_lib/bff";

/**
 * PUT /api/admin/users/[googleSub] — grant or revoke the admin flag.
 * Body: { admin: boolean }. The backend refuses to revoke the last remaining
 * admin (409) and unknown users (404); those statuses pass through so the
 * page can explain them honestly.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ googleSub: string }> },
) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;
  const access = getAccessToken(req);
  if (!access) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { googleSub } = await params;
  let body: { admin?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.admin !== "boolean") {
    return NextResponse.json({ error: "admin must be a boolean." }, { status: 400 });
  }
  let res: Response;
  try {
    res = await fetch(backendApi(`/admin/users/${encodeURIComponent(googleSub)}/admin`), {
      body: JSON.stringify({ isAdmin: body.admin }),
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (res.status === 409) {
      return NextResponse.json(
        { error: "Cannot revoke the only remaining admin." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Could not update the admin flag." }, { status: res.status });
  }
  return NextResponse.json(data, { status: res.status });
}
