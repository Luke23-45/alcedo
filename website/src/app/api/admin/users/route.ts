import { NextRequest, NextResponse } from "next/server";
import { backendApi, getAccessToken } from "@/app/api/_lib/bff";

/** GET /api/admin/users — paginated user list (admin only). */
export async function GET(req: NextRequest) {
  const access = getAccessToken(req);
  if (!access) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const search = req.nextUrl.search;
  let res: Response;
  try {
    res = await fetch(backendApi(`/admin/users${search}`), {
      headers: { Authorization: `Bearer ${access}` },
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the server." }, { status: 502 });
  }
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
