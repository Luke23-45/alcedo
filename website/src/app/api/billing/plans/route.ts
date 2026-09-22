import { NextResponse } from "next/server";
import { backendApi } from "@/app/api/_lib/bff";

interface Plan {
  id: string;
  priceId: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
}

function isPlan(value: unknown): value is Plan {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.priceId === "string" &&
    typeof p.name === "string" &&
    typeof p.amount === "number" &&
    Number.isFinite(p.amount) &&
    typeof p.currency === "string" &&
    typeof p.interval === "string"
  );
}

/**
 * Public plan catalog (proxies GET /billing/plans).
 * No authentication required — prices come from Stripe via the backend,
 * never invented by the site. Malformed entries are dropped, never shown.
 */
export async function GET() {
  const res = await fetch(backendApi("/billing/plans")).catch(() => null);
  if (!res || !res.ok) {
    return NextResponse.json({ plans: [] });
  }
  const body: unknown = await res.json().catch(() => null);
  const plans = Array.isArray(body) ? body.filter(isPlan) : [];
  return NextResponse.json({ plans });
}
