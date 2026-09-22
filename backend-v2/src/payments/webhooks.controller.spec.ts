import { BadRequestException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { WebhooksController } from './webhooks.controller';

function mockStripe(): jest.Mocked<StripeService> {
  return {
    constructEvent: jest.fn().mockReturnValue({
      data: { object: { metadata: { googleSub: 'google-sub-9' } } },
      id: 'evt_stripe_1',
      type: 'checkout.session.completed',
    }),
    getSubscriptionPeriodEnd: jest.fn().mockResolvedValue(null),
  } as unknown as jest.Mocked<StripeService>;
}

const SECRETS: Record<string, string> = {
  REVENUECAT_WEBHOOK_SECRET: 'rc-webhook-secret',
  WEB_CHECKOUT_SECRET: 'web-checkout-secret',
};

function mockConfig(): ConfigService {
  return {
    get: (key: string, fallback?: unknown) =>
      key === 'REVENUECAT_PREMIUM_ENTITLEMENT' ? 'premium' : (fallback ?? undefined),
    getOrThrow: (key: string) => {
      const value = SECRETS[key];
      if (!value) throw new Error(`missing ${key}`);
      return value;
    },
  } as unknown as ConfigService;
}

function mockPayments(): jest.Mocked<PaymentsService> {
  return {
    applyRevenueCatEvent: jest.fn().mockResolvedValue(undefined),
    applyStripeEvent: jest.fn().mockResolvedValue(undefined),
    applyWebCheckoutEvent: jest.fn().mockResolvedValue(undefined),
    billingStatus: jest.fn(),
    claimEvent: jest.fn().mockResolvedValue('claimed'),
    markEventProcessed: jest.fn().mockResolvedValue(undefined),
    releaseEventClaim: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<PaymentsService>;
}

function sign(rawBody: Buffer, secret = SECRETS.WEB_CHECKOUT_SECRET): string {
  return createHmac('sha256', secret).update(rawBody).digest('hex');
}

function webBody() {
  return {
    eventId: '123e4567-e89b-12d3-a456-426614174000',
    expiresAt: '2027-01-01T00:00:00.000Z',
    googleSub: 'google-sub-7',
    plan: 'yearly' as const,
  };
}

function codedError(error: unknown): { code?: string; message?: string } {
  expect(error).toBeInstanceOf(UnauthorizedException);
  const response = (error as UnauthorizedException).getResponse();
  expect(typeof response).toBe('object');
  return response as { code?: string; message?: string };
}

describe('WebhooksController', () => {
  describe('POST /webhooks/revenuecat', () => {
    it('processes a signed RENEWAL and returns ok', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const event = {
        app_user_id: 'google-sub-9',
        entitlement_ids: ['premium'],
        expiration_at_ms: Date.now() + 1000,
        id: 'rc-evt-1',
        type: 'RENEWAL',
      };

      const result = await controller.revenuecat(
        `Bearer ${SECRETS.REVENUECAT_WEBHOOK_SECRET}`,
        { event },
      );

      expect(result).toEqual({ status: 'ok' });
      expect(payments.claimEvent).toHaveBeenCalledWith(
        'rc-evt-1',
        'revenuecat',
        'RENEWAL',
        'google-sub-9',
        expect.anything(),
      );
      expect(payments.applyRevenueCatEvent).toHaveBeenCalledWith(event, 'premium');
    });

    it('rejects a missing Authorization header with PAYMENTS_UNAUTHORIZED', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());

      const error = await controller
        .revenuecat(undefined, { event: { app_user_id: 'x', id: 'e', type: 'RENEWAL' } })
        .catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_UNAUTHORIZED');
      expect(payments.applyRevenueCatEvent).not.toHaveBeenCalled();
    });

    it('rejects a wrong secret with PAYMENTS_UNAUTHORIZED', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());

      const error = await controller
        .revenuecat('Bearer wrong-secret', { event: { app_user_id: 'x', id: 'e', type: 'RENEWAL' } })
        .catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_UNAUTHORIZED');
    });

    it('rejects the raw secret without the Bearer scheme', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());

      const error = await controller
        .revenuecat(SECRETS.REVENUECAT_WEBHOOK_SECRET, {
          event: { app_user_id: 'x', id: 'e', type: 'RENEWAL' },
        })
        .catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_UNAUTHORIZED');
    });

    it('returns duplicate without re-applying when the event was claimed', async () => {
      const payments = mockPayments();
      payments.claimEvent.mockResolvedValue('duplicate-processed');
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const event = { app_user_id: 'google-sub-9', id: 'rc-evt-dup', type: 'RENEWAL' };

      const result = await controller.revenuecat(
        `Bearer ${SECRETS.REVENUECAT_WEBHOOK_SECRET}`,
        { event },
      );

      expect(result).toEqual({ status: 'duplicate' });
      expect(payments.applyRevenueCatEvent).not.toHaveBeenCalled();
    });

    it('releases the claim and rethrows when processing fails (so the provider retries)', async () => {
      const payments = mockPayments();
      payments.applyRevenueCatEvent.mockRejectedValue(new Error('entitlement write failed'));
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const event = { app_user_id: 'google-sub-9', id: 'rc-evt-boom', type: 'RENEWAL' };

      await expect(
        controller.revenuecat(`Bearer ${SECRETS.REVENUECAT_WEBHOOK_SECRET}`, { event }),
      ).rejects.toThrow('entitlement write failed');
      expect(payments.releaseEventClaim).toHaveBeenCalledWith('rc-evt-boom');
      expect(payments.markEventProcessed).not.toHaveBeenCalled();
    });

    it('marks the event processed after a successful apply', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const event = { app_user_id: 'google-sub-9', id: 'rc-evt-2', type: 'RENEWAL' };

      await controller.revenuecat(`Bearer ${SECRETS.REVENUECAT_WEBHOOK_SECRET}`, { event });

      expect(payments.markEventProcessed).toHaveBeenCalledWith('rc-evt-2');
      expect(payments.releaseEventClaim).not.toHaveBeenCalled();
    });

    it('acks an inflight duplicate without re-applying', async () => {
      const payments = mockPayments();
      payments.claimEvent.mockResolvedValue('duplicate-inflight');
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const event = { app_user_id: 'google-sub-9', id: 'rc-evt-race', type: 'RENEWAL' };

      const result = await controller.revenuecat(
        `Bearer ${SECRETS.REVENUECAT_WEBHOOK_SECRET}`,
        { event },
      );

      expect(result).toEqual({ status: 'duplicate' });
      expect(payments.applyRevenueCatEvent).not.toHaveBeenCalled();
    });

    it('rejects a mistyped optional field with a coded bad request', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const event = {
        app_user_id: 'google-sub-9',
        entitlement_ids: [123],
        id: 'rc-evt-bad',
        type: 'RENEWAL',
      };

      const error = await controller
        .revenuecat(`Bearer ${SECRETS.REVENUECAT_WEBHOOK_SECRET}`, { event })
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(BadRequestException);
      expect(payments.claimEvent).not.toHaveBeenCalled();
    });

    it('rejects a malformed event with a coded bad request', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());

      const error = await controller
        .revenuecat(`Bearer ${SECRETS.REVENUECAT_WEBHOOK_SECRET}`, { event: {} as never })
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as { code?: string };
      expect(response.code).toBe('PAYMENTS_MALFORMED_EVENT');
    });
  });

  describe('POST /webhooks/web-checkout', () => {
    it('accepts a valid HMAC signature and grants', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const rawBody = Buffer.from(JSON.stringify(body));
      const req = { rawBody } as unknown as Request;

      const result = await controller.webCheckout(req, sign(rawBody), body);

      expect(result).toEqual({ status: 'ok' });
      expect(payments.claimEvent).toHaveBeenCalledWith(
        body.eventId,
        'web',
        'purchase',
        body.googleSub,
        expect.anything(),
      );
      expect(payments.applyWebCheckoutEvent).toHaveBeenCalledWith({
        eventId: body.eventId,
        expiresAt: body.expiresAt,
        googleSub: body.googleSub,
        plan: body.plan,
      });
    });

    it('rejects a wrong signature with PAYMENTS_BAD_SIGNATURE', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const rawBody = Buffer.from(JSON.stringify(body));
      const req = { rawBody } as unknown as Request;

      const error = await controller.webCheckout(req, sign(rawBody, 'wrong-key'), body).catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_BAD_SIGNATURE');
      expect(payments.applyWebCheckoutEvent).not.toHaveBeenCalled();
    });

    it('rejects a tampered body whose signature no longer matches the raw bytes', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const originalRaw = Buffer.from(JSON.stringify(body));
      const tamperedRaw = Buffer.from(JSON.stringify({ ...body, plan: 'lifetime' }));
      const req = { rawBody: tamperedRaw } as unknown as Request;

      const error = await controller.webCheckout(req, sign(originalRaw), body).catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_BAD_SIGNATURE');
      expect(payments.applyWebCheckoutEvent).not.toHaveBeenCalled();
    });

    it('rejects a missing signature with PAYMENTS_BAD_SIGNATURE', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const req = { rawBody: Buffer.from(JSON.stringify(body)) } as unknown as Request;

      const error = await controller.webCheckout(req, undefined, body).catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_BAD_SIGNATURE');
    });

    it('rejects a missing raw body with PAYMENTS_BAD_SIGNATURE', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const req = {} as unknown as Request;

      const error = await controller.webCheckout(req, 'a'.repeat(64), body).catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_BAD_SIGNATURE');
    });

    it('returns duplicate without re-granting when the event was claimed', async () => {
      const payments = mockPayments();
      payments.claimEvent.mockResolvedValue('duplicate-processed');
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const rawBody = Buffer.from(JSON.stringify(body));
      const req = { rawBody } as unknown as Request;

      const result = await controller.webCheckout(req, sign(rawBody), body);

      expect(result).toEqual({ status: 'duplicate' });
      expect(payments.applyWebCheckoutEvent).not.toHaveBeenCalled();
    });

    it('releases the claim and rethrows when processing fails', async () => {
      const payments = mockPayments();
      payments.applyWebCheckoutEvent.mockRejectedValue(new Error('db down'));
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const rawBody = Buffer.from(JSON.stringify(body));
      const req = { rawBody } as unknown as Request;

      await expect(controller.webCheckout(req, sign(rawBody), body)).rejects.toThrow('db down');
      expect(payments.releaseEventClaim).toHaveBeenCalledWith(body.eventId);
      expect(payments.markEventProcessed).not.toHaveBeenCalled();
    });

    it('marks the event processed after a successful grant', async () => {
      const payments = mockPayments();
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());
      const body = webBody();
      const rawBody = Buffer.from(JSON.stringify(body));
      const req = { rawBody } as unknown as Request;

      await controller.webCheckout(req, sign(rawBody), body);

      expect(payments.markEventProcessed).toHaveBeenCalledWith(body.eventId);
    });
  });

  describe('POST /webhooks/stripe', () => {
    function stripeReq() {
      const rawBody = Buffer.from('stripe-raw-payload');
      return { rawBody } as unknown as Request;
    }

    it('processes a verified event and returns ok', async () => {
      const payments = mockPayments();
      const stripe = mockStripe();
      const controller = new WebhooksController(payments, stripe, mockConfig());

      const result = await controller.stripe(stripeReq(), 'sig');

      expect(result).toEqual({ status: 'ok' });
      expect(stripe.constructEvent).toHaveBeenCalled();
      expect(payments.claimEvent).toHaveBeenCalledWith(
        'evt_stripe_1',
        'stripe',
        'checkout.session.completed',
        'google-sub-9',
        expect.anything(),
      );
      expect(payments.markEventProcessed).toHaveBeenCalledWith('evt_stripe_1');
    });

    it('returns 503 (not a signature error) when Stripe is not configured', async () => {
      const payments = mockPayments();
      const stripe = mockStripe();
      stripe.constructEvent.mockImplementation(() => {
        throw new ServiceUnavailableException({
          code: 'BILLING_STRIPE_DISABLED',
          message: 'Stripe is not configured on this backend.',
        });
      });
      const controller = new WebhooksController(payments, stripe, mockConfig());

      const error = await controller.stripe(stripeReq(), 'sig').catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ServiceUnavailableException);
      expect(payments.claimEvent).not.toHaveBeenCalled();
    });

    it('rejects a bad signature with PAYMENTS_BAD_SIGNATURE', async () => {
      const payments = mockPayments();
      const stripe = mockStripe();
      stripe.constructEvent.mockImplementation(() => {
        throw new Error('Unable to verify signature');
      });
      const controller = new WebhooksController(payments, stripe, mockConfig());

      const error = await controller.stripe(stripeReq(), 'sig').catch((e: unknown) => e);

      expect(codedError(error).code).toBe('PAYMENTS_BAD_SIGNATURE');
      expect(payments.claimEvent).not.toHaveBeenCalled();
    });

    it('releases the claim and rethrows when processing fails', async () => {
      const payments = mockPayments();
      payments.applyStripeEvent = jest.fn().mockRejectedValue(new Error('db down'));
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());

      await expect(controller.stripe(stripeReq(), 'sig')).rejects.toThrow('db down');
      expect(payments.releaseEventClaim).toHaveBeenCalledWith('evt_stripe_1');
      expect(payments.markEventProcessed).not.toHaveBeenCalled();
    });

    it('acks an inflight duplicate without re-applying', async () => {
      const payments = mockPayments();
      payments.claimEvent.mockResolvedValue('duplicate-inflight');
      const controller = new WebhooksController(payments, mockStripe(), mockConfig());

      const result = await controller.stripe(stripeReq(), 'sig');

      expect(result).toEqual({ status: 'duplicate' });
      expect(payments.applyStripeEvent).not.toHaveBeenCalled();
    });
  });
});
