import { EntitlementService } from './entitlement.service';
import type { PremiumSource } from './schemas/user.schema';
import type { UserRecord, UserRepository } from './repositories/user-repository.interface';

/** In-memory UserRepository fake honoring the contract semantics. */
function makeRepository(seed: UserRecord[] = []) {
  const store = new Map<string, UserRecord>();
  for (const record of seed) store.set(record.googleSub, record);

  const repo: UserRepository = {
    count: () => Promise.resolve(store.size),
    countAdmins: () =>
      Promise.resolve([...store.values()].filter((r) => r.isAdmin).length),
    expireEntitlement: (googleSub: string, source: PremiumSource) => {
      const record = store.get(googleSub);
      // Source guard is atomic in the real implementations — a mismatched
      // source must not revoke another provider's grant.
      if (!record || record.premium.source !== source || record.premium.status !== 'active') {
        return Promise.resolve(null);
      }
      record.premium.status = 'expired';
      record.premium.updatedAt = new Date();
      return Promise.resolve(record);
    },
    findByGoogleSub: (googleSub: string) => Promise.resolve(store.get(googleSub) ?? null),
    findByStripeCustomerId: () => Promise.resolve(null),
    create: (input: { googleSub: string; email?: string; name?: string; picture?: string }) => {
      const now = new Date();
      const record: UserRecord = {
        createdAt: now,
        email: input.email,
        googleSub: input.googleSub,
        id: `user-${input.googleSub}`,
        isAdmin: false,
        name: input.name,
        picture: input.picture,
        premium: { expiresAt: null, source: undefined, status: 'none', updatedAt: now },
        units: 'metric',
        updatedAt: now,
      };
      store.set(input.googleSub, record);
      return Promise.resolve(record);
    },
    updateProfile: (
      googleSub: string,
      patch: { name?: string; picture?: string; units?: 'metric' | 'imperial' },
    ) => {
      const record = store.get(googleSub);
      if (!record) return Promise.resolve(null);
      if (patch.name !== undefined) record.name = patch.name;
      if (patch.picture !== undefined) record.picture = patch.picture;
      if (patch.units !== undefined) record.units = patch.units;
      record.updatedAt = new Date();
      return Promise.resolve(record);
    },
    updateEntitlement: (
      googleSub: string,
      entitlement: { status: 'active' | 'expired' | 'none'; source: PremiumSource; expiresAt?: Date },
    ) => {
      const record = store.get(googleSub);
      if (!record) return Promise.resolve(null);
      const now = new Date();
      record.premium = {
        expiresAt: entitlement.expiresAt ?? null,
        source: entitlement.source,
        status: entitlement.status,
        updatedAt: now,
      };
      record.updatedAt = now;
      return Promise.resolve(record);
    },
    grantEntitlement: (googleSub: string, source: PremiumSource, expiresAt: Date | null) => {
      const now = new Date();
      const record = store.get(googleSub) ?? {
        createdAt: now,
        email: undefined,
        googleSub,
        id: `user-${googleSub}`,
        isAdmin: false,
        name: undefined,
        picture: undefined,
        premium: { expiresAt: null, source: undefined, status: 'none', updatedAt: now },
        units: 'metric' as const,
        updatedAt: now,
      };
      record.premium = { expiresAt, source, status: 'active', updatedAt: now };
      record.updatedAt = now;
      store.set(googleSub, record);
      return Promise.resolve(record);
    },
    isAdmin: (googleSub: string) => Promise.resolve(store.get(googleSub)?.isAdmin ?? false),
    linkStripeCustomer: (googleSub: string, ids: { customerId?: string | null; subscriptionId?: string | null }) => {
      const record = store.get(googleSub);
      if (!record) return Promise.resolve(null);
      if (ids.customerId) record.stripeCustomerId = ids.customerId;
      if (ids.subscriptionId) record.stripeSubscriptionId = ids.subscriptionId;
      return Promise.resolve(record);
    },
    listRecent: (limit: number, offset = 0) =>
      Promise.resolve(
        [...store.values()]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(offset, offset + limit),
      ),
    setAdmin: (googleSub: string, isAdmin: boolean) => {
      const record = store.get(googleSub);
      if (!record) return Promise.resolve(null);
      record.isAdmin = isAdmin;
      return Promise.resolve(record);
    },
  };
  return { repo, store };
}

function stored(
  googleSub: string,
  premium: Partial<UserRecord['premium']> & { status: UserRecord['premium']['status'] },
): UserRecord {
  const now = new Date();
  return {
    createdAt: now,
    googleSub,
    id: `user-${googleSub}`,
    isAdmin: false,
    premium: { expiresAt: null, source: undefined, updatedAt: now, ...premium },
    units: 'metric',
    updatedAt: now,
  };
}

function makeService(seed: UserRecord[] = []) {
  const { repo, store } = makeRepository(seed);
  return { repo, service: new EntitlementService(repo), store };
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

  it('grant upserts: a missing user record is created', async () => {
    const { service, store } = makeService();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await service.grant('brand-new', 'web', expiresAt);

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

  it('linkStripeCustomer links both IDs when provided', async () => {
    const { repo, service, store } = makeService([stored('u1', { status: 'none' })]);
    const link = jest.spyOn(repo, 'linkStripeCustomer');

    await service.linkStripeCustomer('u1', 'cus_123', 'sub_456');

    expect(link).toHaveBeenCalledWith('u1', { customerId: 'cus_123', subscriptionId: 'sub_456' });
    expect(store.get('u1')!.stripeCustomerId).toBe('cus_123');
    expect(store.get('u1')!.stripeSubscriptionId).toBe('sub_456');
  });

  it('linkStripeCustomer with both IDs null does not touch the store', async () => {
    const { repo, service } = makeService([stored('u1', { status: 'none' })]);
    const link = jest.spyOn(repo, 'linkStripeCustomer');

    await service.linkStripeCustomer('u1', null, null);

    expect(link).not.toHaveBeenCalled();
  });
});
