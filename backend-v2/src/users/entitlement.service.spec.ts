import { Model } from 'mongoose';
import { EntitlementService } from './entitlement.service';
import { UserDocument } from './schemas/user.schema';

interface StoredDoc {
  googleSub: string;
  premium: {
    status: 'none' | 'active' | 'expired';
    source?: 'revenuecat' | 'web' | 'manual';
    expiresAt?: Date | null;
    updatedAt: Date;
  };
}

function makeService(seed: StoredDoc[] = []) {
  const store = new Map<string, StoredDoc>();
  for (const doc of seed) store.set(doc.googleSub, doc);

  const model = {
    findOne: jest.fn((query: { googleSub: string }) => ({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(store.get(query.googleSub) ?? null),
    })),
    findOneAndUpdate: jest.fn(
      (
        filter: { googleSub: string } & Record<string, unknown>,
        update: { $set: Record<string, unknown> },
        options?: { upsert?: boolean },
      ) => ({
        exec: jest.fn().mockImplementation(async () => {
          let doc = store.get(filter.googleSub);
          if (!doc && options?.upsert) {
            doc = {
              googleSub: filter.googleSub,
              premium: { status: 'none', updatedAt: new Date() },
            };
            store.set(filter.googleSub, doc);
          }
          if (doc) {
            // Honor dotted filter conditions (e.g. expire's
            // 'premium.source'/'premium.status' guard): a non-matching
            // filter updates nothing, like Mongo.
            for (const [key, value] of Object.entries(filter)) {
              if (key === 'googleSub') continue;
              const actual = key.startsWith('premium.')
                ? (doc.premium as Record<string, unknown>)[key.slice('premium.'.length)]
                : (doc as unknown as Record<string, unknown>)[key];
              if (actual !== value) return doc;
            }
            for (const [key, value] of Object.entries(update.$set)) {
              if (key === 'premium') {
                doc.premium = value as StoredDoc['premium'];
              } else if (key.startsWith('premium.')) {
                (doc.premium as Record<string, unknown>)[key.slice('premium.'.length)] = value;
              }
            }
          }
          return doc ?? null;
        }),
      }),
    ),
  };
  const service = new EntitlementService(model as unknown as Model<UserDocument>);
  return { model, service, store };
}

function stored(
  googleSub: string,
  premium: Partial<StoredDoc['premium']> & { status: StoredDoc['premium']['status'] },
): StoredDoc {
  return {
    googleSub,
    premium: { updatedAt: new Date(), ...premium },
  };
}

describe('EntitlementService state machine', () => {
  it('none -> active: grant sets status, source, expiresAt and updatedAt', async () => {
    const { service, store } = makeService([stored('u1', { status: 'none' })]);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await service.grant('u1', 'revenuecat', expiresAt);

    expect(store.get('u1')!.premium).toMatchObject({
      expiresAt,
      source: 'revenuecat',
      status: 'active',
    });
    expect(await service.getStatus('u1')).toEqual({
      expiresAt,
      source: 'revenuecat',
      status: 'active',
    });
    expect(await service.isPremiumActive('u1')).toBe(true);
  });

  it('active -> expired: expire keeps source and expiresAt for audit', async () => {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const { service, store } = makeService([
      stored('u1', { expiresAt, source: 'revenuecat', status: 'active' }),
    ]);

    await service.expire('u1', 'revenuecat');

    const premium = store.get('u1')!.premium;
    expect(premium.status).toBe('expired');
    expect(premium.source).toBe('revenuecat');
    expect(premium.expiresAt).toBe(expiresAt);
    expect(await service.isPremiumActive('u1')).toBe(false);
  });

  it('expire ignores a mismatched source: a Stripe cancel never revokes a RevenueCat grant', async () => {
    const { service, store } = makeService([
      stored('u1', {
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        source: 'revenuecat',
        status: 'active',
      }),
    ]);

    await service.expire('u1', 'stripe');

    expect(store.get('u1')!.premium.status).toBe('active');
    expect(await service.isPremiumActive('u1')).toBe(true);
  });

  it('expired -> active: re-grant revives the entitlement', async () => {
    const { service } = makeService([
      stored('u1', { expiresAt: new Date(Date.now() - 1000), source: 'web', status: 'expired' }),
    ]);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await service.grant('u1', 'web', expiresAt);

    expect(await service.getStatus('u1')).toEqual({
      expiresAt,
      source: 'web',
      status: 'active',
    });
    expect(await service.isPremiumActive('u1')).toBe(true);
  });

  it('isPremiumActive: past expiresAt means lapsed even when status is active', async () => {
    const { service } = makeService([
      stored('u1', {
        expiresAt: new Date(Date.now() - 1000),
        source: 'revenuecat',
        status: 'active',
      }),
    ]);

    expect(await service.isPremiumActive('u1')).toBe(false);
  });

  it('isPremiumActive: a null expiresAt means an active entitlement without expiry', async () => {
    const { service } = makeService([
      stored('u1', { expiresAt: null, source: 'manual', status: 'active' }),
    ]);

    expect(await service.isPremiumActive('u1')).toBe(true);
  });

  it('unknown users read as none / not premium', async () => {
    const { service } = makeService();

    expect(await service.getStatus('ghost')).toEqual({
      expiresAt: null,
      source: null,
      status: 'none',
    });
    expect(await service.isPremiumActive('ghost')).toBe(false);
  });

  it('grant upserts: a missing user document is created', async () => {
    const { model, service, store } = makeService();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await service.grant('brand-new', 'web', expiresAt);

    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { googleSub: 'brand-new' },
      expect.objectContaining({ $set: expect.anything() }),
      expect.objectContaining({ upsert: true }),
    );
    expect(store.get('brand-new')!.premium).toMatchObject({
      expiresAt,
      source: 'web',
      status: 'active',
    });
    expect(await service.isPremiumActive('brand-new')).toBe(true);
  });

  it('expire on an unknown user is a no-op', async () => {
    const { service, store } = makeService();

    await service.expire('ghost', 'revenuecat');

    expect(store.has('ghost')).toBe(false);
  });
});
