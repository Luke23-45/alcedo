export interface RefreshTokenRecord {
  tokenHash: string;
  /** The user's Google `sub`. */
  googleSub: string;
  /** Links a rotated chain; every rotation reuses the family's id. */
  familyId: string;
  expiresAt: Date;
  revokedAt?: Date;
  replacedByHash?: string;
  createdAt: Date;
}

export interface CreateRefreshTokenInput {
  tokenHash: string;
  googleSub: string;
  familyId: string;
  expiresAt: Date;
}

/**
 * Server-side refresh token records. Only sha256 hashes are stored — never
 * the token plaintext. Rotation links records through `familyId` so reuse of
 * an already-rotated token can be treated as theft and revoke the whole
 * family. A record is "live" when `revokedAt` is absent and `expiresAt` is in
 * the future.
 */
export abstract class RefreshTokenRepository {
  abstract findByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  abstract create(input: CreateRefreshTokenInput): Promise<void>;
  /**
   * Atomically claims a live token for rotation: sets `revokedAt` and
   * `replacedByHash` only when the token is unexpired and not yet revoked.
   * Returns true when this caller won the claim (proceed with the rotation),
   * false when the token was already rotated/revoked or expired mid-flight.
   */
  abstract claimRotation(
    tokenHash: string,
    now: Date,
    replacementHash: string,
  ): Promise<boolean>;
  /** Revokes one token; unknown or already-revoked tokens are a silent no-op. */
  abstract revokeByHash(tokenHash: string, now: Date): Promise<void>;
  /** Revokes every unrevoked token in the family (suspected theft). */
  abstract revokeFamily(familyId: string, now: Date): Promise<void>;
  abstract revokeAllForUser(googleSub: string, now: Date): Promise<void>;
  /**
   * Deletes records past `expiresAt` — mirrors the Mongo TTL on `expiresAt`
   * (expireAfterSeconds: 0). Returns the removed count.
   */
  abstract purgeExpired(now: Date): Promise<number>;
}
