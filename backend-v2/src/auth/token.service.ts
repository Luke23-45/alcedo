import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes, randomUUID } from 'crypto';
import {
  RefreshTokenRecord,
  RefreshTokenRepository,
} from './repositories/refresh-token-repository.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  /** Access-token lifetime in seconds (mirrors the JWT `exp` claim). */
  expiresIn: number;
}

/** Distinguishes backend-issued access tokens from anything else we may sign. */
const ACCESS_TOKEN_TYPE = 'access';

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/** Reuse-detection grace window: a replay within this long after a rotation is
 * treated as a benign concurrent duplicate (e.g. a client retry after a
 * timeout) — rejected, but the family is NOT nuked. A replay after the window
 * is treated as theft and revokes the whole family. Either way the replayed
 * token itself is always rejected. */
const REUSE_GRACE_MS = 10_000;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly tokens: RefreshTokenRepository,
  ) {}

  private accessTtlSeconds(): number {
    return this.config.get<number>('JWT_ACCESS_TTL_SECONDS', 900);
  }

  /** Issues a fresh pair in a new token family. */
  async issueTokenPair(googleSub: string): Promise<TokenPair> {
    return this.issueTokenPairInFamily(googleSub, randomUUID());
  }

  /**
   * Rotating refresh: the presented token is revoked and a new pair in the
   * same family is issued. The revocation is an atomic claim, so two
   * concurrent refreshes with the same token cannot both succeed — the loser
   * mints nothing usable. Presenting an already-rotated token is treated as
   * theft (whole family revoked) unless it falls inside the benign-retry
   * grace window.
   */
  async refresh(refreshToken: string): Promise<TokenPair> {
    const hash = sha256(refreshToken);
    const now = new Date();
    const record = await this.tokens.findByHash(hash);
    if (!record) {
      throw new UnauthorizedException({
        code: 'AUTH_REFRESH_INVALID',
        message: 'Refresh token is not recognized.',
      });
    }
    if (record.revokedAt && record.replacedByHash) {
      // This token was already rotated once — someone is replaying it.
      await this.handleReuse(record, now);
    }
    if (record.revokedAt || record.expiresAt.getTime() <= now.getTime()) {
      throw new UnauthorizedException({
        code: 'AUTH_REFRESH_INVALID',
        message: 'Refresh token is invalid or expired.',
      });
    }
    // Mint the replacement first so its hash can be recorded in the same
    // atomic claim below. If the claim loses, the minted record is revoked
    // immediately — its plaintext never left this scope, so it is unusable.
    const pair = await this.issueTokenPairInFamily(record.googleSub, record.familyId);
    const claimed = await this.tokens.claimRotation(hash, now, sha256(pair.refreshToken));
    if (!claimed) {
      // Lost a race (concurrent refresh) or the token expired mid-flight.
      // Revoke the minted replacement so it can never be used.
      await this.tokens.revokeByHash(sha256(pair.refreshToken), now);
      const current = await this.tokens.findByHash(hash);
      if (current?.revokedAt && current?.replacedByHash) {
        await this.handleReuse(current, now);
      }
      throw new UnauthorizedException({
        code: 'AUTH_REFRESH_INVALID',
        message: 'Refresh token is invalid or expired.',
      });
    }
    return pair;
  }

  /**
   * Handles the replay of an already-rotated token. Inside the grace window
   * the family is left alone (benign duplicate submission); outside it the
   * whole family is revoked (suspected theft). Always throws.
   */
  private async handleReuse(
    record: Pick<RefreshTokenRecord, 'familyId' | 'revokedAt'>,
    now: Date,
  ): Promise<never> {
    const rotatedMsAgo = now.getTime() - (record.revokedAt?.getTime() ?? 0);
    if (rotatedMsAgo > REUSE_GRACE_MS) {
      await this.tokens.revokeFamily(record.familyId, now);
    }
    throw new UnauthorizedException({
      code: 'AUTH_REFRESH_REUSED',
      message: 'Refresh token was already used.',
    });
  }

  /** Revokes one refresh token. Unknown tokens are a silent no-op (no leakage). */
  async revoke(refreshToken: string): Promise<void> {
    await this.tokens.revokeByHash(sha256(refreshToken), new Date());
  }

  async revokeAllForUser(googleSub: string): Promise<void> {
    await this.tokens.revokeAllForUser(googleSub, new Date());
  }

  private async issueTokenPairInFamily(googleSub: string, familyId: string): Promise<TokenPair> {
    const expiresIn = this.accessTtlSeconds();
    const accessToken = await this.jwtService.signAsync(
      { googleSub, sub: googleSub, type: ACCESS_TOKEN_TYPE },
      { expiresIn },
    );
    // 256-bit cryptographically random; only the sha256 hash touches the DB.
    const refreshToken = randomBytes(32).toString('hex');
    const days = this.config.get<number>('JWT_REFRESH_TTL_DAYS', 30);
    await this.tokens.create({
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      familyId,
      googleSub,
      tokenHash: sha256(refreshToken),
    });
    return { accessToken, expiresIn, refreshToken };
  }
}
