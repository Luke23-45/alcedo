import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { RefreshTokenDocument } from './schemas/refresh-token.schema';
import { TokenService } from './token.service';

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

interface MockRecord {
  googleSub: string;
  tokenHash: string;
  tokenFamilyId: string;
  expiresAt: Date;
  revokedAt?: Date;
  replacedByHash?: string;
  save: jest.Mock;
}

function makeService() {
  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('access-token'),
  } as unknown as JwtService;
  const config = {
    get: jest.fn((key: string, fallback?: unknown) => {
      if (key === 'JWT_ACCESS_TTL_SECONDS') return 900;
      if (key === 'JWT_REFRESH_TTL_DAYS') return 30;
      return fallback;
    }),
  } as unknown as ConfigService;
  const records = new Map<string, MockRecord>();
  const model = {
    create: jest.fn(async (doc: Record<string, unknown>) => {
      const record: MockRecord = {
        ...(doc as Omit<MockRecord, 'save'>),
        save: jest.fn().mockResolvedValue(undefined),
      };
      records.set(record.tokenHash, record);
      return record;
    }),
    findOne: jest.fn((query: { tokenHash: string }) => ({
      exec: jest.fn().mockResolvedValue(records.get(query.tokenHash) ?? null),
    })),
    // Atomic claim: only an unrevoked, unexpired record can be claimed, and
    // the claim applies replacedByHash/revokedAt in the same operation.
    findOneAndUpdate: jest.fn(
      (
        filter: { tokenHash: string; expiresAt?: { $gt: Date }; revokedAt?: { $exists: boolean } },
        update: { $set: Partial<MockRecord> },
      ) => ({
        exec: jest.fn().mockImplementation(async () => {
          const record = records.get(filter.tokenHash);
          if (!record) return null;
          if (record.revokedAt) return null;
          const gt = filter.expiresAt?.['$gt'];
          if (gt && !(record.expiresAt.getTime() > gt.getTime())) return null;
          Object.assign(record, update.$set);
          return record;
        }),
      }),
    ),
    updateOne: jest.fn(
      (filter: { tokenHash: string }, update: { $set: { revokedAt: Date } }) => ({
        exec: jest.fn().mockImplementation(async () => {
          const record = records.get(filter.tokenHash);
          if (record && !record.revokedAt) record.revokedAt = update.$set.revokedAt;
          return { modifiedCount: record ? 1 : 0 };
        }),
      }),
    ),
    // Faithful enough: revokes every un-revoked record in the family, like the real updateMany.
    updateMany: jest.fn((filter: { tokenFamilyId: string }, update: { $set: { revokedAt: Date } }) => ({
      exec: jest.fn().mockImplementation(async () => {
        for (const record of records.values()) {
          if (record.tokenFamilyId === filter.tokenFamilyId && !record.revokedAt) {
            record.revokedAt = update.$set.revokedAt;
          }
        }
        return { modifiedCount: 1 };
      }),
    })),
  };
  const service = new TokenService(
    jwtService,
    config,
    model as unknown as Model<RefreshTokenDocument>,
  );
  return { config, jwtService, model, records, service };
}

async function errorBody(promise: Promise<unknown>): Promise<{ code: string; message: string }> {
  try {
    await promise;
  } catch (err) {
    expect(err).toBeInstanceOf(UnauthorizedException);
    return (err as UnauthorizedException).getResponse() as { code: string; message: string };
  }
  throw new Error('expected the promise to reject');
}

describe('TokenService', () => {
  it('signs access tokens with the { sub, googleSub, type } claims and issues 256-bit refresh tokens', async () => {
    const { jwtService, service } = makeService();
    const pair = await service.issueTokenPair('google-sub-1');

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { googleSub: 'google-sub-1', sub: 'google-sub-1', type: 'access' },
      { expiresIn: 900 },
    );
    expect(pair.expiresIn).toBe(900);
    // 32 random bytes rendered as hex.
    expect(pair.refreshToken).toMatch(/^[0-9a-f]{64}$/);
  });

  it('rotation happy path: the old token dies, the new one lives, chains share a family', async () => {
    const { model, records, service } = makeService();
    const first = await service.issueTokenPair('google-sub-1');
    const familyId = records.get(sha256(first.refreshToken))!.tokenFamilyId;

    const second = await service.refresh(first.refreshToken);

    const oldRecord = records.get(sha256(first.refreshToken))!;
    expect(oldRecord.revokedAt).toBeInstanceOf(Date);
    expect(oldRecord.replacedByHash).toBe(sha256(second.refreshToken));
    expect(records.get(sha256(second.refreshToken))!.tokenFamilyId).toBe(familyId);
    expect(second.refreshToken).not.toBe(first.refreshToken);
    expect(model.updateMany).not.toHaveBeenCalled();

    // The rotated-in token is itself refreshable.
    const third = await service.refresh(second.refreshToken);
    expect(third.refreshToken).toMatch(/^[0-9a-f]{64}$/);
  });

  it('reuse detection: replaying an already-rotated token revokes the whole family', async () => {
    const { model, records, service } = makeService();
    const first = await service.issueTokenPair('google-sub-1');
    const second = await service.refresh(first.refreshToken);
    const familyId = records.get(sha256(first.refreshToken))!.tokenFamilyId;
    // Push the rotation outside the benign-retry grace window: this is theft, not a retry.
    records.get(sha256(first.refreshToken))!.revokedAt = new Date(Date.now() - 60_000);

    const body = await errorBody(service.refresh(first.refreshToken));

    expect(body.code).toBe('AUTH_REFRESH_REUSED');
    expect(model.updateMany).toHaveBeenCalledWith(
      { tokenFamilyId: familyId, revokedAt: { $exists: false } },
      { $set: { revokedAt: expect.any(Date) } },
    );
    // The stolen-session token is dead too — the attacker gains nothing.
    const afterTheft = await errorBody(service.refresh(second.refreshToken));
    expect(afterTheft.code).toBe('AUTH_REFRESH_INVALID');
  });

  it('grace window: an immediate replay is rejected but the family survives', async () => {
    const { model, records, service } = makeService();
    const first = await service.issueTokenPair('google-sub-1');
    const second = await service.refresh(first.refreshToken);

    // A client retry right after a timeout: the rotation just happened.
    const body = await errorBody(service.refresh(first.refreshToken));

    expect(body.code).toBe('AUTH_REFRESH_REUSED');
    expect(model.updateMany).not.toHaveBeenCalled();
    // The legitimately rotated-in token still works — other sessions survive.
    const third = await service.refresh(second.refreshToken);
    expect(third.refreshToken).toMatch(/^[0-9a-f]{64}$/);
    expect(records.get(sha256(first.refreshToken))!.revokedAt).toBeInstanceOf(Date);
  });

  it('concurrent refresh: only one wins; the loser mints nothing usable', async () => {
    const { model, records, service } = makeService();
    const first = await service.issueTokenPair('google-sub-1');
    const familyId = records.get(sha256(first.refreshToken))!.tokenFamilyId;

    const [a, b] = await Promise.allSettled([
      service.refresh(first.refreshToken),
      service.refresh(first.refreshToken),
    ]);

    const fulfilled = [a, b].filter((r) => r.status === 'fulfilled');
    const rejected = [a, b].filter((r) => r.status === 'rejected');
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(
      ((rejected[0] as PromiseRejectedResult).reason as UnauthorizedException).getResponse(),
    ).toMatchObject({ code: 'AUTH_REFRESH_REUSED' });
    // Benign race: the family is not nuked.
    expect(model.updateMany).not.toHaveBeenCalled();

    // Exactly one live refresh token exists in the family: the winner's.
    const winner = (fulfilled[0] as PromiseFulfilledResult<{ refreshToken: string }>).value;
    const live = [...records.values()].filter(
      (r) => r.tokenFamilyId === familyId && !r.revokedAt,
    );
    expect(live).toHaveLength(1);
    expect(live[0].tokenHash).toBe(sha256(winner.refreshToken));
    // The winner's token is usable; the old token is dead.
    await expect(service.refresh(winner.refreshToken)).resolves.toMatchObject({
      refreshToken: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
  });

  it('rejects a revoked (non-rotated) token without nuking the family', async () => {
    const { model, records, service } = makeService();
    const pair = await service.issueTokenPair('google-sub-1');
    await service.revoke(pair.refreshToken);

    const body = await errorBody(service.refresh(pair.refreshToken));

    expect(body.code).toBe('AUTH_REFRESH_INVALID');
    expect(model.updateMany).not.toHaveBeenCalled();
    expect(records.get(sha256(pair.refreshToken))!.replacedByHash).toBeUndefined();
  });

  it('rejects expired refresh tokens', async () => {
    const { records, service } = makeService();
    const pair = await service.issueTokenPair('google-sub-1');
    records.get(sha256(pair.refreshToken))!.expiresAt = new Date(Date.now() - 1000);

    const body = await errorBody(service.refresh(pair.refreshToken));

    expect(body.code).toBe('AUTH_REFRESH_INVALID');
  });

  it('rejects unknown refresh tokens', async () => {
    const { service } = makeService();
    const body = await errorBody(service.refresh('deadbeef'.repeat(8)));
    expect(body.code).toBe('AUTH_REFRESH_INVALID');
  });

  it('revoke is a silent no-op for unknown tokens (no validity oracle)', async () => {
    const { model, service } = makeService();
    await expect(service.revoke('deadbeef'.repeat(8))).resolves.toBeUndefined();
    expect(model.updateOne).toHaveBeenCalled();
  });
});
