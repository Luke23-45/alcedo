import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import type { UserRecord, UserRepository } from '../users/repositories/user-repository.interface';

function makeController(opts: { premium?: boolean; stripeCustomerId?: string | null }) {
  const findByGoogleSub = jest.fn().mockResolvedValue(
    opts.stripeCustomerId === undefined
      ? ({ email: 'alex@example.com', googleSub: 'google-sub-9', stripeCustomerId: 'cus_1' } as UserRecord)
      : opts.stripeCustomerId
        ? ({ googleSub: 'google-sub-9', stripeCustomerId: opts.stripeCustomerId } as UserRecord)
        : null,
  );
  const users = { findByGoogleSub } as unknown as UserRepository;
  const paymentsService = {
    hasActiveSubscription: jest.fn().mockResolvedValue(opts.premium ?? false),
  } as unknown as PaymentsService;
  const stripeService = {
    createCheckoutSession: jest.fn().mockResolvedValue({ customerId: 'cus_1', url: 'https://stripe/checkout' }),
    createPortalSession: jest.fn().mockResolvedValue({ url: 'https://stripe/portal' }),
    getPublicPlans: jest.fn().mockResolvedValue([]),
  } as unknown as StripeService;
  const config = {
    get: jest.fn().mockReturnValue('https://alcedo.example.com'),
  } as unknown as ConfigService;
  const controller = new BillingController(paymentsService, stripeService, config, users);
  return { controller, paymentsService, stripeService };
}

describe('BillingController', () => {
  describe('POST /billing/checkout', () => {
    it('rejects with 409 when the account already has premium (no duplicate checkout)', async () => {
      const { controller, stripeService } = makeController({ premium: true });

      const error = await controller
        .checkout('google-sub-9', { priceId: 'price_monthly' })
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ConflictException);
      expect((error as ConflictException).getResponse()).toMatchObject({
        code: 'BILLING_ALREADY_PREMIUM',
      });
      expect(stripeService.createCheckoutSession).not.toHaveBeenCalled();
    });

    it('dedups concurrent checkouts: one Stripe session for a double-click', async () => {
      const { controller, stripeService } = makeController({ premium: false });
      (stripeService.createCheckoutSession as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ url: 'https://stripe/checkout' }), 20)),
      );

      const [a, b] = await Promise.all([
        controller.checkout('google-sub-9', { priceId: 'price_monthly' }),
        controller.checkout('google-sub-9', { priceId: 'price_monthly' }),
      ]);

      expect(a).toEqual({ url: 'https://stripe/checkout' });
      expect(b).toEqual({ url: 'https://stripe/checkout' });
      expect(stripeService.createCheckoutSession).toHaveBeenCalledTimes(1);
    });

    it('creates a checkout session landing on real website pages', async () => {
      const { controller, stripeService } = makeController({ premium: false });

      const result = await controller.checkout('google-sub-9', { priceId: 'price_monthly' });

      expect(result).toEqual({ url: 'https://stripe/checkout' });
      expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({
          cancelUrl: 'https://alcedo.example.com/pricing?cancelled=1',
          googleSub: 'google-sub-9',
          priceId: 'price_monthly',
          successUrl: 'https://alcedo.example.com/account?upgraded=1',
        }),
      );
    });
  });

  describe('POST /billing/portal', () => {
    it('returns a null url when the user has no Stripe customer', async () => {
      const { controller, stripeService } = makeController({ stripeCustomerId: null });

      await expect(controller.portal('google-sub-9')).resolves.toEqual({ url: null });
      expect(stripeService.createPortalSession).not.toHaveBeenCalled();
    });

    it('opens the portal for a linked customer', async () => {
      const { controller, stripeService } = makeController({ stripeCustomerId: 'cus_1' });

      await expect(controller.portal('google-sub-9')).resolves.toEqual({
        url: 'https://stripe/portal',
      });
      expect(stripeService.createPortalSession).toHaveBeenCalledWith(
        'cus_1',
        'https://alcedo.example.com/account',
      );
    });
  });

  describe('GET /billing/plans', () => {
    it('delegates to the Stripe price catalog', async () => {
      const { controller, stripeService } = makeController({});
      await controller.plans();
      expect(stripeService.getPublicPlans).toHaveBeenCalled();
    });
  });
});
