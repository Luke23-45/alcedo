import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';

function mockConfig(values: Record<string, string | undefined>): ConfigService {
  return {
    get: (key: string) => values[key],
    getOrThrow: (key: string) => {
      const v = values[key];
      if (v === undefined) throw new Error(`missing ${key}`);
      return v;
    },
  } as unknown as ConfigService;
}

describe('StripeService', () => {
  describe('when STRIPE_SECRET_KEY is unset', () => {
    const service = new StripeService(mockConfig({}));

    it('reports disabled', () => {
      expect(service.isEnabled()).toBe(false);
    });

    it('throws 503 on checkout', async () => {
      await expect(
        service.createCheckoutSession({
          cancelUrl: 'https://example.com/cancel',
          googleSub: 'sub-1',
          priceId: 'price_monthly',
          successUrl: 'https://example.com/success',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('throws 503 on portal', async () => {
      await expect(service.createPortalSession('cus_1', 'https://example.com')).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });

  describe('price allowlist', () => {
    it('rejects a price ID that is not configured', async () => {
      // Stripe client is constructed but never hits the network: the
      // allowlist check runs before any Stripe API call.
      const service = new StripeService(
        mockConfig({
          STRIPE_PRICE_MONTHLY: 'price_monthly',
          STRIPE_PRICE_YEARLY: 'price_yearly',
          STRIPE_SECRET_KEY: 'sk_test_123',
        }),
      );
      expect(service.isEnabled()).toBe(true);
      await expect(
        service.createCheckoutSession({
          cancelUrl: 'https://example.com/cancel',
          googleSub: 'sub-1',
          priceId: 'price_attacker_controlled',
          successUrl: 'https://example.com/success',
        }),
      ).rejects.toMatchObject({ response: { code: 'BILLING_UNKNOWN_PRICE' } });
    });

    it('prefers admin-configured price IDs over the env fallback', async () => {
      const siteConfig = { get: jest.fn().mockResolvedValue('price_admin_monthly') };
      const service = new StripeService(
        mockConfig({
          STRIPE_PRICE_MONTHLY: 'price_env_monthly',
          STRIPE_PRICE_YEARLY: 'price_yearly',
          STRIPE_SECRET_KEY: 'sk_test_123',
        }),
        siteConfig as never,
      );

      await expect(
        service.createCheckoutSession({
          cancelUrl: 'https://example.com/cancel',
          googleSub: 'sub-1',
          priceId: 'price_env_monthly',
          successUrl: 'https://example.com/success',
        }),
      ).rejects.toMatchObject({ response: { code: 'BILLING_UNKNOWN_PRICE' } });
      expect(siteConfig.get).toHaveBeenCalledWith('billing.stripe.priceMonthly');
    });
  });

  describe('resolveSubscriptionGoogleSub', () => {
    function serviceWithSubscriptions(retrieveImpl: jest.Mock): StripeService {
      const service = new StripeService(mockConfig({ STRIPE_SECRET_KEY: 'sk_test_123' }));
      // Reach the lazily-created Stripe client without network access.
      (service as unknown as { stripe: unknown }).stripe = {
        subscriptions: { retrieve: retrieveImpl },
      };
      return service;
    }

    it('returns the googleSub from subscription metadata', async () => {
      const service = serviceWithSubscriptions(
        jest.fn().mockResolvedValue({ metadata: { googleSub: 'google-sub-9' } }),
      );

      await expect(service.resolveSubscriptionGoogleSub('sub_1')).resolves.toBe('google-sub-9');
    });

    it('returns null when metadata has no googleSub', async () => {
      const service = serviceWithSubscriptions(jest.fn().mockResolvedValue({ metadata: {} }));

      await expect(service.resolveSubscriptionGoogleSub('sub_1')).resolves.toBeNull();
    });

    it('returns null when the subscription cannot be retrieved', async () => {
      const service = serviceWithSubscriptions(jest.fn().mockRejectedValue(new Error('no such sub')));

      await expect(service.resolveSubscriptionGoogleSub('sub_nope')).resolves.toBeNull();
    });
  });
});
