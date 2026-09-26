import type { RepositoryBundle } from './harness';

const SUB = 'parity-auth-sub';

const tokenInput = (hash: string, family: string, ttlMs: number) => ({
  tokenHash: hash,
  googleSub: SUB,
  familyId: family,
  expiresAt: new Date(Date.now() + ttlMs),
});

export function authContracts(get: () => RepositoryBundle): void {
  describe('RefreshTokenRepository parity', () => {
    it('creates and finds by hash', async () => {
      const { refreshTokens } = get();
      await refreshTokens.create(tokenInput('h1', 'f1', 3600000));
      const found = await refreshTokens.findByHash('h1');
      expect(found!.tokenHash).toBe('h1');
      expect(found!.familyId).toBe('f1');
      expect(found!.revokedAt).toBeUndefined();
      expect(await refreshTokens.findByHash('nope')).toBeNull();
    });

    it('claims rotation exactly once', async () => {
      const { refreshTokens } = get();
      const now = new Date();
      await refreshTokens.create(tokenInput('h1', 'f1', 3600000));

      expect(await refreshTokens.claimRotation('h1', now, 'h2')).toBe(true);
      // Second claim loses: already revoked.
      expect(await refreshTokens.claimRotation('h1', now, 'h3')).toBe(false);

      const rotated = await refreshTokens.findByHash('h1');
      expect(rotated!.replacedByHash).toBe('h2');
      expect(rotated!.revokedAt).toBeInstanceOf(Date);
    });

    it('refuses to claim an expired token', async () => {
      const { refreshTokens } = get();
      await refreshTokens.create(tokenInput('old', 'f1', -1000));
      expect(await refreshTokens.claimRotation('old', new Date(), 'new')).toBe(false);
    });

    it('revokes singly, by family, and by user', async () => {
      const { refreshTokens } = get();
      const now = new Date();
      await refreshTokens.create(tokenInput('a1', 'fam', 3600000));
      await refreshTokens.create(tokenInput('a2', 'fam', 3600000));
      await refreshTokens.create(tokenInput('b1', 'other', 3600000));

      await refreshTokens.revokeByHash('a1', now);
      expect((await refreshTokens.findByHash('a1'))!.revokedAt).toBeInstanceOf(Date);
      // Unknown hash is a silent no-op.
      await refreshTokens.revokeByHash('nope', now);

      await refreshTokens.revokeFamily('fam', now);
      expect((await refreshTokens.findByHash('a2'))!.revokedAt).toBeInstanceOf(Date);
      expect((await refreshTokens.findByHash('b1'))!.revokedAt).toBeUndefined();

      await refreshTokens.revokeAllForUser(SUB, now);
      expect((await refreshTokens.findByHash('b1'))!.revokedAt).toBeInstanceOf(Date);
    });

    it('purges only expired records', async () => {
      const { refreshTokens } = get();
      const now = new Date();
      await refreshTokens.create(tokenInput('live', 'f1', 3600000));
      await refreshTokens.create(tokenInput('dead', 'f1', -1000));
      expect(await refreshTokens.purgeExpired(now)).toBe(1);
      expect(await refreshTokens.findByHash('live')).not.toBeNull();
      expect(await refreshTokens.findByHash('dead')).toBeNull();
    });
  });
}

export function paymentsContracts(get: () => RepositoryBundle): void {
  describe('WebhookEventRepository parity', () => {
    const event = (id: string) => ({
      eventId: id,
      provider: 'revenuecat' as const,
      type: 'INITIAL_PURCHASE',
      googleSub: SUB,
      payload: { appUserId: SUB },
    });

    it('claims once, then classifies duplicates', async () => {
      const { webhookEvents } = get();
      expect(await webhookEvents.claim(event('e1'))).toBe('claimed');
      expect(await webhookEvents.claim(event('e1'))).toBe('duplicate-inflight');

      await webhookEvents.markProcessed('e1');
      expect(await webhookEvents.claim(event('e1'))).toBe('duplicate-processed');
    });

    it('releases a claim so a retry can re-claim', async () => {
      const { webhookEvents } = get();
      expect(await webhookEvents.claim(event('e2'))).toBe('claimed');
      await webhookEvents.releaseClaim('e2');
      expect(await webhookEvents.claim(event('e2'))).toBe('claimed');
    });

    it('markProcessed is idempotent', async () => {
      const { webhookEvents } = get();
      await webhookEvents.claim(event('e3'));
      await webhookEvents.markProcessed('e3');
      await webhookEvents.markProcessed('e3');
      expect(await webhookEvents.claim(event('e3'))).toBe('duplicate-processed');
    });
  });
}

export function siteConfigContracts(get: () => RepositoryBundle): void {
  describe('SiteConfigRepository parity', () => {
    it('upserts and reads back', async () => {
      const { siteConfig } = get();
      expect(await siteConfig.findByKey('missing')).toBeNull();

      await siteConfig.upsert('providers.litellm.baseUrl', 'http://x', false);
      const found = await siteConfig.findByKey('providers.litellm.baseUrl');
      expect(found!.value).toBe('http://x');
      expect(found!.secret).toBe(false);

      await siteConfig.upsert('providers.litellm.baseUrl', 'http://y', true);
      const updated = await siteConfig.findByKey('providers.litellm.baseUrl');
      expect(updated!.value).toBe('http://y');
      expect(updated!.secret).toBe(true);
    });

    it('lists all entries', async () => {
      const { siteConfig } = get();
      await siteConfig.upsert('a', '1', false);
      await siteConfig.upsert('b', '2', false);
      const all = await siteConfig.findAll();
      expect(all.map((c) => c.key).sort()).toEqual(['a', 'b']);
    });
  });
}
