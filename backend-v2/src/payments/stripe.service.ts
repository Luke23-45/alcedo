import { Inject, Injectable, Logger, Optional, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SiteConfigService } from '../site-config/site-config.service';

/** Short-lived cache for admin-configured Stripe prices (Mongo read per request avoided). */
const PRICE_CACHE_TTL_MS = 60_000;

/**
 * Stripe integration for website premium purchases.
 *
 * The purchase is always keyed to the Google `sub`: the checkout session
 * carries it as `client_reference_id` and in metadata, and the webhook
 * grants the entitlement to that sub. The mobile app reads the same
 * entitlement via `GET /billing/status`, so a website purchase unlocks
 * premium in the app automatically.
 *
 * Price IDs come from admin site config (`billing.stripe.priceMonthly` /
 * `billing.stripe.priceYearly`) with the env vars as fallback; the admin
 * panel actually changes the prices offered.
 *
 * Stripe is optional: when STRIPE_SECRET_KEY is unset, checkout and portal
 * throw 503 and the webhook route rejects. Nothing else depends on Stripe.
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe | null;
  private priceCache: { at: number; monthly?: string; yearly?: string } | null = null;

  constructor(
    private readonly config: ConfigService,
    @Optional() @Inject(SiteConfigService) private readonly siteConfig?: SiteConfigService,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = secretKey ? new Stripe(secretKey) : null;
    if (!this.stripe) {
      this.logger.warn('STRIPE_SECRET_KEY is not set; Stripe endpoints are disabled.');
    }
  }

  /** True when Stripe is configured and usable. */
  isEnabled(): boolean {
    return this.stripe !== null;
  }

  private requireStripe(): Stripe {
    if (!this.stripe) {
      throw new ServiceUnavailableException({
        code: 'BILLING_STRIPE_DISABLED',
        message: 'Stripe is not configured on this backend.',
      });
    }
    return this.stripe;
  }

  /**
   * Configured price IDs. Admin site config wins over the env fallback;
   * results are cached briefly to avoid a Mongo read per request.
   */
  private async getPriceIds(): Promise<{ monthly?: string; yearly?: string }> {
    const now = Date.now();
    if (this.priceCache && now - this.priceCache.at < PRICE_CACHE_TTL_MS) {
      return this.priceCache;
    }
    const monthly =
      (await this.siteConfig?.get('billing.stripe.priceMonthly')) ||
      this.config.get<string>('STRIPE_PRICE_MONTHLY');
    const yearly =
      (await this.siteConfig?.get('billing.stripe.priceYearly')) ||
      this.config.get<string>('STRIPE_PRICE_YEARLY');
    this.priceCache = { at: now, monthly, yearly };
    return this.priceCache;
  }

  /**
   * Creates a Stripe Checkout Session for a subscription price.
   * Returns the hosted URL the browser must redirect to.
   */
  async createCheckoutSession(args: {
    priceId: string;
    googleSub: string;
    email?: string;
    customerId?: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ url: string; customerId: string }> {
    const stripe = this.requireStripe();
    const priceIds = await this.getPriceIds();
    const allowed = [priceIds.monthly, priceIds.yearly].filter(
      (p): p is string => typeof p === 'string' && p.length > 0,
    );
    if (!allowed.includes(args.priceId)) {
      throw new ServiceUnavailableException({
        code: 'BILLING_UNKNOWN_PRICE',
        message: 'This price is not offered.',
      });
    }

    let customerId = args.customerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: args.email,
        metadata: { googleSub: args.googleSub },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      cancel_url: args.cancelUrl,
      client_reference_id: args.googleSub,
      customer: customerId,
      line_items: [{ price: args.priceId, quantity: 1 }],
      metadata: { googleSub: args.googleSub },
      mode: 'subscription',
      subscription_data: { metadata: { googleSub: args.googleSub } },
      success_url: args.successUrl,
    });
    if (!session.url) {
      throw new ServiceUnavailableException({
        code: 'BILLING_CHECKOUT_FAILED',
        message: 'Stripe did not return a checkout URL.',
      });
    }
    return { customerId, url: session.url };
  }

  /** Creates a Stripe Customer Portal session for managing the subscription. */
  async createPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
    const stripe = this.requireStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  }

  /**
   * Verifies the Stripe webhook signature and parses the event.
   * Throws when the signature is invalid.
   */
  constructEvent(rawBody: Buffer, signature: string): Stripe.Event {
    const stripe = this.requireStripe();
    const webhookSecret = this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }

  /**
   * Recovers the Google sub for a subscription when the webhook payload lacks
   * metadata (e.g. invoice events). Reads the subscription's metadata stamped
   * at checkout. Returns null when it cannot be resolved.
   */
  async resolveSubscriptionGoogleSub(subscriptionId: string): Promise<string | null> {
    const stripe = this.requireStripe();
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const googleSub = subscription.metadata?.['googleSub'];
      return typeof googleSub === 'string' && googleSub.length > 0 ? googleSub : null;
    } catch (error) {
      this.logger.warn(
        `Could not resolve Google sub for Stripe subscription ${subscriptionId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  /**
   * Reads a subscription's lifecycle state and period end for webhook
   * recovery. Returns null when the subscription cannot be read.
   */
  async getSubscriptionState(
    subscriptionId: string,
  ): Promise<{ status: string; periodEnd: Date | null } | null> {
    const stripe = this.requireStripe();
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = (subscription as unknown as { current_period_end?: number })
        .current_period_end;
      return {
        periodEnd: typeof periodEnd === 'number' ? new Date(periodEnd * 1000) : null,
        status: subscription.status,
      };
    } catch (error) {
      this.logger.warn(
        `Could not read Stripe subscription ${subscriptionId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  /** Reads a subscription's current period end. Null when unavailable. */
  async getSubscriptionPeriodEnd(subscriptionId: string): Promise<Date | null> {
    const state = await this.getSubscriptionState(subscriptionId);
    return state?.periodEnd ?? null;
  }

  /**
   * Public plan catalog: the configured Stripe prices with their real
   * amounts from Stripe. No prices are invented — everything comes from
   * the Stripe price objects. Returns an empty list when Stripe is not
   * configured.
   */
  async getPublicPlans(): Promise<
    Array<{
      id: string;
      priceId: string;
      name: string;
      amount: number;
      currency: string;
      interval: string;
    }>
  > {
    if (!this.stripe) return [];
    const priceIds = await this.getPriceIds();
    const configured: Array<{ id: string; priceId: string | undefined; name: string }> = [
      {
        id: 'monthly',
        name: 'Monthly',
        priceId: priceIds.monthly,
      },
      {
        id: 'yearly',
        name: 'Yearly',
        priceId: priceIds.yearly,
      },
    ];
    const plans: Array<{
      id: string;
      priceId: string;
      name: string;
      amount: number;
      currency: string;
      interval: string;
    }> = [];
    for (const { id, priceId, name } of configured) {
      if (!priceId) continue;
      try {
        const price = await this.stripe.prices.retrieve(priceId);
        if (!price.active || price.unit_amount === null) continue;
        plans.push({
          amount: price.unit_amount,
          currency: price.currency,
          id,
          interval: price.recurring?.interval ?? 'month',
          name: price.nickname ?? name,
          priceId,
        });
      } catch (error) {
        this.logger.warn(`Could not retrieve Stripe price ${priceId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return plans;
  }
}
