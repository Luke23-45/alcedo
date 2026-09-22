/**
 * The backend's `GET /auth/me` response shape, shared by every client
 * component that reads the BFF session endpoint. Validate with
 * `isMeResponse` before trusting any field — a malformed payload must never
 * crash the UI or flip the premium/admin state.
 */
export interface MePremium {
  status: string;
  source: string | null;
  expiresAt: string | null;
}

export interface MeResponse {
  googleSub: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
  premium: MePremium;
}

function isPremium(value: unknown): value is MePremium {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.status === "string" &&
    (p.source === null || typeof p.source === "string") &&
    (p.expiresAt === null || typeof p.expiresAt === "string")
  );
}

export function isMeResponse(value: unknown): value is MeResponse {
  if (typeof value !== "object" || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.googleSub === "string" &&
    m.googleSub.length > 0 &&
    (m.email === null || typeof m.email === "string") &&
    (m.name === null || typeof m.name === "string") &&
    (m.picture === null || typeof m.picture === "string") &&
    typeof m.isAdmin === "boolean" &&
    isPremium(m.premium)
  );
}
