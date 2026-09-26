import type { RepositoryBundle } from './harness';

const SUB = 'parity-user-sub';

export function userContracts(get: () => RepositoryBundle): void {
  describe('UserRepository parity', () => {
    it('creates and reads back a user', async () => {
      const { users } = get();
      const created = await users.create({
        googleSub: SUB,
        email: 'a@example.com',
        name: 'Ada',
      });
      expect(created.googleSub).toBe(SUB);
      expect(created.email).toBe('a@example.com');
      expect(created.premium.status).toBe('none');
      expect(created.isAdmin).toBe(false);

      const found = await users.findByGoogleSub(SUB);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
    });

    it('returns null for an unknown sub', async () => {
      expect(await get().users.findByGoogleSub('nope')).toBeNull();
    });

    it('updates the profile partially', async () => {
      const { users } = get();
      await users.create({ googleSub: SUB });
      const updated = await users.updateProfile(SUB, { name: 'Bo', units: 'imperial' });
      expect(updated!.name).toBe('Bo');
      expect(updated!.units).toBe('imperial');
      expect(await users.updateProfile('nope', { name: 'x' })).toBeNull();
    });

    it('grants and expires entitlements with a source guard', async () => {
      const { users } = get();
      const expires = new Date(Date.now() + 86400000);
      const granted = await users.grantEntitlement(SUB, 'web', expires);
      expect(granted.premium.status).toBe('active');
      expect(granted.premium.source).toBe('web');

      // A different provider must not revoke another provider's grant.
      expect(await users.expireEntitlement(SUB, 'revenuecat')).toBeNull();
      const stillActive = await users.findByGoogleSub(SUB);
      expect(stillActive!.premium.status).toBe('active');

      const expired = await users.expireEntitlement(SUB, 'web');
      expect(expired!.premium.status).toBe('expired');
    });

    it('grantEntitlement creates the user when missing', async () => {
      const { users } = get();
      const granted = await users.grantEntitlement('fresh-sub', 'manual', null);
      expect(granted.googleSub).toBe('fresh-sub');
      expect(granted.premium.status).toBe('active');
    });

    it('manages admins', async () => {
      const { users } = get();
      await users.create({ googleSub: 'u1' });
      await users.create({ googleSub: 'u2' });
      expect(await users.isAdmin('u1')).toBe(false);
      await users.setAdmin('u1', true);
      expect(await users.isAdmin('u1')).toBe(true);
      expect(await users.countAdmins()).toBe(1);
      expect(await users.count()).toBe(2);
      expect(await users.setAdmin('nope', true)).toBeNull();
    });

    it('links Stripe customer ids', async () => {
      const { users } = get();
      await users.create({ googleSub: SUB });
      const linked = await users.linkStripeCustomer(SUB, {
        customerId: 'cus_123',
        subscriptionId: 'sub_123',
      });
      expect(linked!.stripeCustomerId).toBe('cus_123');
      const byCustomer = await users.findByStripeCustomerId('cus_123');
      expect(byCustomer!.googleSub).toBe(SUB);
      expect(await users.linkStripeCustomer('nope', { customerId: 'x' })).toBeNull();
    });

    it('lists recent users newest first with offset', async () => {
      const { users } = get();
      await users.create({ googleSub: 'u1' });
      await new Promise((r) => setTimeout(r, 15));
      await users.create({ googleSub: 'u2' });
      await new Promise((r) => setTimeout(r, 15));
      await users.create({ googleSub: 'u3' });
      const page1 = await users.listRecent(2);
      expect(page1.map((u) => u.googleSub)).toEqual(['u3', 'u2']);
      const page2 = await users.listRecent(2, 2);
      expect(page2.map((u) => u.googleSub)).toEqual(['u1']);
    });
  });
}
