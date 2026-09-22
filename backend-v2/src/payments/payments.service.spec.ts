import { EntitlementService } from '../users/entitlement.service';
import { PaymentsService, RevenueCatEvent } from './payments.service';
import { StripeService } from './stripe.service';

function mockStripeService(): jest.Mocked<StripeService> {
  return {
    getSubscriptionPeriodEnd: jest.fn().mockResolvedValue(null),
    resolveSubscriptionGoogleSub: jest.fn().mockResolvedValue(null),
  } as unknown as jest.Mocked<StripeService>;
}

function mockEntitlements(): {
  entitlements: jest.Mocked<EntitlementService>;
} {
  const entitlements = {
    expire: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockResolvedValue({ expiresAt: null, source: null, status: 'none' }),
    grant: jest.fn().mockResolvedValue(undefined),
    isPremiumActive: jest.fn().mockResolvedValue(false),
    linkStripeCustomer: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<EntitlementService>;
  return { entitlements };
}

function mockEventsModel(
  createImpl: jest.Mock = jest.fn().mockResolvedValue({}),
  findOneResult: unknown = null,
) {
  return {
    create: createImpl,
    deleteOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(findOneResult),
      lean: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
    }),
    updateOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
  } as never;
}

function duplicateKeyError(): Error {
  return Object.assign(new Error('E11000 duplicate key error'), { code: 11000 });
}

function rcEvent(overrides: Partial<RevenueCatEvent>): RevenueCatEvent {
  return {
    app_user_id: 'google-sub-9',
    id: 'evt-1',
    type: 'RENEWAL',
    ...overrides,
  };
}

describe('PaymentsService', () => {
  describe('claimEvent', () => {
    it('inserts the event as claimed and returns claimed on first sight', async () => {
      const create = jest.fn().mockResolvedValue({});
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel(create));

      await expect(
        service.claimEvent('evt-1', 'revenuecat', 'RENEWAL', 'google-sub-9', { id: 'evt-1' }),
      ).resolves.toBe('claimed');
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'evt-1',
          googleSub: 'google-sub-9',
          provider: 'revenuecat',
          status: 'claimed',
          type: 'RENEWAL',
        }),
      );
    });

    it('returns duplicate-processed when the existing record was already applied', async () => {
      const create = jest.fn().mockRejectedValue(duplicateKeyError());
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(
        entitlements,
        mockStripeService(),
        mockEventsModel(create, { status: 'processed' }),
      );

      await expect(
        service.claimEvent('evt-dup', 'web', 'purchase', 'google-sub-7', {}),
      ).resolves.toBe('duplicate-processed');
    });

    it('returns duplicate-inflight when the existing record is still being processed', async () => {
      const create = jest.fn().mockRejectedValue(duplicateKeyError());
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(
        entitlements,
        mockStripeService(),
        mockEventsModel(create, { status: 'claimed' }),
      );

      await expect(
        service.claimEvent('evt-race', 'stripe', 'checkout.session.completed', 'google-sub-9', {}),
      ).resolves.toBe('duplicate-inflight');
    });

    it('rethrows non-duplicate insert errors', async () => {
      const create = jest.fn().mockRejectedValue(new Error('db down'));
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel(create));

      await expect(
        service.claimEvent('evt-x', 'web', 'purchase', 'google-sub-7', {}),
      ).rejects.toThrow('db down');
    });

    it('markEventProcessed flips the claim to processed', async () => {
      const { entitlements } = mockEntitlements();
      const model = mockEventsModel() as unknown as { updateOne: jest.Mock };
      const service = new PaymentsService(entitlements, mockStripeService(), model as never);

      await service.markEventProcessed('evt-1');

      expect(model.updateOne).toHaveBeenCalledWith(
        { eventId: 'evt-1' },
        { $set: { status: 'processed' } },
      );
    });

    it('releaseEventClaim deletes only a still-claimed record', async () => {
      const { entitlements } = mockEntitlements();
      const model = mockEventsModel() as unknown as { deleteOne: jest.Mock };
      const service = new PaymentsService(entitlements, mockStripeService(), model as never);

      await service.releaseEventClaim('evt-1');

      expect(model.deleteOne).toHaveBeenCalledWith({ eventId: 'evt-1', status: 'claimed' });
    });

    it('hasActiveSubscription delegates to the entitlement service', async () => {
      const { entitlements } = mockEntitlements();
      entitlements.isPremiumActive.mockResolvedValue(true);
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await expect(service.hasActiveSubscription('google-sub-9')).resolves.toBe(true);
      expect(entitlements.isPremiumActive).toHaveBeenCalledWith('google-sub-9');
    });
  });

  describe('applyRevenueCatEvent', () => {
    it('grants premium on RENEWAL with an expiry date', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());
      const expirationMs = Date.now() + 30 * 24 * 60 * 60 * 1000;

      await service.applyRevenueCatEvent(
        rcEvent({ entitlement_ids: ['premium'], expiration_at_ms: expirationMs }),
        'premium',
      );

      expect(entitlements.grant).toHaveBeenCalledWith(
        'google-sub-9',
        'revenuecat',
        new Date(expirationMs),
      );
    });

    it('grants with a null expiry on INITIAL_PURCHASE when no expiration is given', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyRevenueCatEvent(
        rcEvent({ entitlement_ids: ['premium'], type: 'INITIAL_PURCHASE' }),
        'premium',
      );

      expect(entitlements.grant).toHaveBeenCalledWith('google-sub-9', 'revenuecat', null);
    });

    it('processes anyway with a warning when entitlement_ids is absent', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyRevenueCatEvent(rcEvent({ entitlement_ids: undefined }), 'premium');

      expect(entitlements.grant).toHaveBeenCalledWith('google-sub-9', 'revenuecat', null);
    });

    it('ignores events for other entitlements', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyRevenueCatEvent(
        rcEvent({ entitlement_ids: ['some_other_pack'] }),
        'premium',
      );

      expect(entitlements.grant).not.toHaveBeenCalled();
      expect(entitlements.expire).not.toHaveBeenCalled();
    });

    it('expires premium on EXPIRATION', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyRevenueCatEvent(
        rcEvent({ entitlement_ids: ['premium'], type: 'EXPIRATION' }),
        'premium',
      );

      expect(entitlements.expire).toHaveBeenCalledWith('google-sub-9', 'revenuecat');
      expect(entitlements.grant).not.toHaveBeenCalled();
    });

    it('keeps access on CANCELLATION (no expire)', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyRevenueCatEvent(
        rcEvent({ entitlement_ids: ['premium'], type: 'CANCELLATION' }),
        'premium',
      );

      expect(entitlements.expire).not.toHaveBeenCalled();
      expect(entitlements.grant).not.toHaveBeenCalled();
    });

    it('keeps access on BILLING_ISSUE', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyRevenueCatEvent(
        rcEvent({ entitlement_ids: ['premium'], type: 'BILLING_ISSUE' }),
        'premium',
      );

      expect(entitlements.expire).not.toHaveBeenCalled();
      expect(entitlements.grant).not.toHaveBeenCalled();
    });

    it('logs and ignores unknown event types', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyRevenueCatEvent(
        rcEvent({ entitlement_ids: ['premium'], type: 'SOME_FUTURE_EVENT' }),
        'premium',
      );

      expect(entitlements.expire).not.toHaveBeenCalled();
      expect(entitlements.grant).not.toHaveBeenCalled();
    });
  });

  describe('applyWebCheckoutEvent', () => {
    it('grants premium with source web and the expiry', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      await service.applyWebCheckoutEvent({
        eventId: 'web-1',
        expiresAt,
        googleSub: 'google-sub-7',
        plan: 'yearly',
      });

      expect(entitlements.grant).toHaveBeenCalledWith(
        'google-sub-7',
        'web',
        new Date(expiresAt),
      );
    });

    it('grants with a null expiry for a lifetime plan', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyWebCheckoutEvent({
        eventId: 'web-2',
        expiresAt: null,
        googleSub: 'google-sub-7',
        plan: 'lifetime',
      });

      expect(entitlements.grant).toHaveBeenCalledWith('google-sub-7', 'web', null);
    });
  });

  describe('billingStatus', () => {
    it('returns premium, status, source, and an ISO expiry', async () => {
      const { entitlements } = mockEntitlements();
      entitlements.isPremiumActive.mockResolvedValue(true);
      entitlements.getStatus.mockResolvedValue({
        expiresAt: new Date('2027-01-01T00:00:00.000Z'),
        source: 'revenuecat',
        status: 'active',
      });
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await expect(service.billingStatus('google-sub-9')).resolves.toEqual({
        expiresAt: '2027-01-01T00:00:00.000Z',
        premium: true,
        source: 'revenuecat',
        status: 'active',
      });
    });
  });

  describe('applyStripeEvent', () => {
    function stripeEvent(type: string, object: Record<string, unknown>) {
      return { data: { object }, id: 'evt-stripe-1', type };
    }

    it('grants premium on checkout.session.completed with metadata googleSub', async () => {
      const { entitlements } = mockEntitlements();
      const stripe = mockStripeService();
      stripe.getSubscriptionPeriodEnd.mockResolvedValue(new Date('2027-02-01T00:00:00.000Z'));
      const service = new PaymentsService(entitlements, stripe, mockEventsModel());

      await service.applyStripeEvent(
        stripeEvent('checkout.session.completed', {
          client_reference_id: 'google-sub-9',
          customer: 'cus_1',
          metadata: { googleSub: 'google-sub-9' },
          subscription: 'sub_1',
        }),
      );

      expect(entitlements.grant).toHaveBeenCalledWith(
        'google-sub-9',
        'stripe',
        new Date('2027-02-01T00:00:00.000Z'),
      );
      expect(entitlements.linkStripeCustomer).toHaveBeenCalledWith('google-sub-9', 'cus_1', 'sub_1');
    });

    it('keeps access on customer.subscription.updated with status past_due', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyStripeEvent(
        stripeEvent('customer.subscription.updated', {
          current_period_end: 1800000000,
          metadata: { googleSub: 'google-sub-9' },
          status: 'past_due',
        }),
      );

      expect(entitlements.grant).toHaveBeenCalledWith(
        'google-sub-9',
        'stripe',
        new Date(1800000000 * 1000),
      );
      expect(entitlements.expire).not.toHaveBeenCalled();
    });

    it('expires on customer.subscription.updated with status canceled', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyStripeEvent(
        stripeEvent('customer.subscription.updated', {
          metadata: { googleSub: 'google-sub-9' },
          status: 'canceled',
        }),
      );

      expect(entitlements.expire).toHaveBeenCalledWith('google-sub-9', 'stripe');
      expect(entitlements.grant).not.toHaveBeenCalled();
    });

    it('recovers googleSub from subscription metadata for invoice.payment_failed', async () => {
      const { entitlements } = mockEntitlements();
      const stripe = mockStripeService();
      stripe.resolveSubscriptionGoogleSub.mockResolvedValue('google-sub-9');
      const service = new PaymentsService(entitlements, stripe, mockEventsModel());

      await service.applyStripeEvent(
        stripeEvent('invoice.payment_failed', { subscription: 'sub_1' }),
      );

      expect(stripe.resolveSubscriptionGoogleSub).toHaveBeenCalledWith('sub_1');
      // Dunning keeps access: neither grant nor expire.
      expect(entitlements.grant).not.toHaveBeenCalled();
      expect(entitlements.expire).not.toHaveBeenCalled();
    });

    it('ignores an event whose googleSub cannot be resolved', async () => {
      const { entitlements } = mockEntitlements();
      const service = new PaymentsService(entitlements, mockStripeService(), mockEventsModel());

      await service.applyStripeEvent(
        stripeEvent('invoice.payment_failed', { subscription: 'sub_unknown' }),
      );

      expect(entitlements.grant).not.toHaveBeenCalled();
      expect(entitlements.expire).not.toHaveBeenCalled();
    });
  });
});
