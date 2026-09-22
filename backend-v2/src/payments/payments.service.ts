import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EntitlementService,
  EntitlementSource,
  EntitlementStatusValue,
} from '../users/entitlement.service';
import { WebhookEvent, WebhookEventDocument } from './schemas/webhook-event.schema';
import { StripeService } from './stripe.service';

/** Subset of the RevenueCat v1 webhook event we act on. */
export interface RevenueCatEvent {
  id: string;
  type: string;
  app_user_id: string;
  entitlement_ids?: string[];
  expiration_at_ms?: number | null;
  purchased_at_ms?: number | null;
  product_id?: string;
}

export interface WebCheckoutPayload {
  eventId: string;
  googleSub: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  expiresAt: string | null;
}

export type WebhookProvider = 'revenuecat' | 'web' | 'stripe';

/**
 * Premium pipeline: both purchase paths (RevenueCat native purchases and the
 * website checkout webhook) converge here, keyed by the Google `sub`. The app
 * sets the RevenueCat `app_user_id` to the user's Google `sub`, so an
 * entitlement maps 1:1 regardless of where it was purchased.
 */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly entitlements: EntitlementService,
    private readonly stripeService: StripeService,
    @InjectModel(WebhookEvent.name) private readonly events: Model<WebhookEventDocument>,
  ) {}

  /**
   * Inserts the webhook's audit record before any processing. The unique
   * `eventId` index makes this atomic: a redelivery racing the original fails
   * the insert with a duplicate-key error instead of applying twice.
   *
   * - `'claimed'` — this call won the race and must process the event.
   * - `'duplicate-processed'` — the event was already applied; ack only.
   * - `'duplicate-inflight'` — another request is processing it right now;
   *   ack without re-applying (its outcome decides the retry, not ours).
   */
  async claimEvent(
    eventId: string,
    provider: WebhookProvider,
    type: string,
    googleSub: string,
    payload: Record<string, unknown>,
  ): Promise<'claimed' | 'duplicate-processed' | 'duplicate-inflight'> {
    try {
      await this.events.create({
        eventId,
        googleSub,
        payload,
        provider,
        receivedAt: new Date(),
        status: 'claimed',
        type,
      });
    } catch (error) {
      if (error instanceof Error && (error as { code?: number }).code === 11000) {
        const existing = await this.events
          .findOne({ eventId })
          .select('status')
          .lean()
          .exec();
        if (existing?.status === 'processed') {
          this.logger.log(`Duplicate ${provider} webhook ${eventId}; already applied; acking.`);
          return 'duplicate-processed';
        }
        this.logger.log(`Duplicate ${provider} webhook ${eventId}; inflight elsewhere; acking.`);
        return 'duplicate-inflight';
      }
      throw error;
    }
    return 'claimed';
  }

  /** Marks a claimed event as applied. Idempotent. */
  async markEventProcessed(eventId: string): Promise<void> {
    await this.events.updateOne({ eventId }, { $set: { status: 'processed' } }).exec();
  }

  /**
   * Releases a claim after a transient processing failure so the provider's
   * retry can re-claim and re-process. Application is idempotent, so a
   * reprocessed event never double-applies.
   */
  async releaseEventClaim(eventId: string): Promise<void> {
    await this.events.deleteOne({ eventId, status: 'claimed' }).exec();
  }

  /** Applies a verified RevenueCat webhook event to the matching Google account. */
  async applyRevenueCatEvent(event: RevenueCatEvent, premiumEntitlementId: string): Promise<void> {
    const entitlementIds = event.entitlement_ids;
    if (entitlementIds) {
      if (!entitlementIds.includes(premiumEntitlementId)) {
        this.logger.log(
          `RevenueCat event ${event.id} (${event.type}): no '${premiumEntitlementId}' entitlement; ignoring.`,
        );
        return;
      }
    } else {
      // Some event shapes omit the field; still act but leave a trace.
      this.logger.warn(
        `RevenueCat event ${event.id} (${event.type}): no entitlement_ids; processing anyway.`,
      );
    }

    const googleSub = event.app_user_id;
    const expiresAt = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;
    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        await this.entitlements.grant(googleSub, 'revenuecat', expiresAt);
        this.logger.log(
          `RevenueCat ${event.type} ${event.id}: granted premium to ${googleSub}.`,
        );
        break;
      case 'EXPIRATION':
        await this.entitlements.expire(googleSub, 'revenuecat');
        this.logger.log(`RevenueCat EXPIRATION ${event.id}: expired premium for ${googleSub}.`);
        break;
      case 'CANCELLATION':
        // The store keeps the subscription usable until the paid period ends;
        // revoking on cancellation would take away time the user paid for.
        this.logger.log(
          `RevenueCat CANCELLATION ${event.id}: keeping access until period end for ${googleSub}.`,
        );
        break;
      case 'BILLING_ISSUE':
        // RevenueCat retries billing during the grace period; access stays on.
        this.logger.log(
          `RevenueCat BILLING_ISSUE ${event.id}: keeping entitlement active for ${googleSub}.`,
        );
        break;
      case 'TRANSFER':
      default:
        this.logger.log(
          `RevenueCat event ${event.id}: unhandled type '${event.type}'; logged only.`,
        );
        break;
    }
  }

  /**
   * Applies a signature-verified web-checkout event. The web checkout emits a
   * single event kind (a successful purchase for the linked Google account),
   * so this is always a grant.
   */
  async applyWebCheckoutEvent(payload: WebCheckoutPayload): Promise<void> {
    await this.entitlements.grant(
      payload.googleSub,
      'web',
      payload.expiresAt ? new Date(payload.expiresAt) : null,
    );
    this.logger.log(
      `Web-checkout event ${payload.eventId} (${payload.plan}): granted premium to ${payload.googleSub}.`,
    );
  }

  /** What the app reads to decide whether to show premium features. */
  async billingStatus(googleSub: string): Promise<{
    premium: boolean;
    status: EntitlementStatusValue;
    source: EntitlementSource | null;
    expiresAt: string | null;
  }> {
    const [premium, { expiresAt, source, status }] = await Promise.all([
      this.entitlements.isPremiumActive(googleSub),
      this.entitlements.getStatus(googleSub),
    ]);
    return { expiresAt: expiresAt?.toISOString() ?? null, premium, source, status };
  }

  /** Whether the account currently holds any active premium subscription. */
  async hasActiveSubscription(googleSub: string): Promise<boolean> {
    return this.entitlements.isPremiumActive(googleSub);
  }

  /**
   * Applies a verified Stripe webhook event. The Google sub is read from the
   * checkout/subscription metadata (never the email — emails can change).
   */
  async applyStripeEvent(event: {
    id: string;
    type: string;
    data: { object: Record<string, unknown> };
  }): Promise<void> {
    const object = event.data.object;
    let googleSub =
      (object['metadata'] as Record<string, unknown> | undefined)?.['googleSub'] ??
      object['client_reference_id'];
    if (typeof googleSub !== 'string' || !googleSub) {
      // Recovery: subscription and invoice events reference a subscription id
      // whose metadata was stamped at checkout. Invoice payloads carry it as
      // `subscription`; subscription payloads ARE the subscription (`id`).
      const subscriptionRef = object['subscription'];
      const subscriptionId =
        typeof subscriptionRef === 'string' && subscriptionRef
          ? subscriptionRef
          : event.type.startsWith('customer.subscription.') &&
              typeof object['id'] === 'string'
            ? (object['id'] as string)
            : null;
      if (subscriptionId) {
        googleSub = await this.stripeService.resolveSubscriptionGoogleSub(subscriptionId);
      }
    }
    if (typeof googleSub !== 'string' || !googleSub) {
      this.logger.warn(
        `Stripe event ${event.id} (${event.type}): no googleSub in metadata and none recoverable; ignoring.`,
      );
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const customerId = object['customer'];
        const subscriptionId = object['subscription'];
        let expiresAt: Date | null = null;
        if (typeof subscriptionId === 'string' && subscriptionId) {
          expiresAt = await this.stripeService.getSubscriptionPeriodEnd(subscriptionId);
        }
        await this.entitlements.grant(googleSub, 'stripe', expiresAt);
        await this.entitlements.linkStripeCustomer(
          googleSub,
          typeof customerId === 'string' ? customerId : null,
          typeof subscriptionId === 'string' ? subscriptionId : null,
        );
        this.logger.log(`Stripe ${event.type} ${event.id}: granted premium to ${googleSub}.`);
        break;
      }
      case 'customer.subscription.updated': {
        const periodEnd = object['current_period_end'];
        const expiresAt =
          typeof periodEnd === 'number' ? new Date(periodEnd * 1000) : null;
        const status = object['status'];
        if (status === 'active' || status === 'trialing' || status === 'past_due') {
          // past_due keeps access during dunning; Stripe retries and the
          // subscription webhook expires it if payment truly fails.
          await this.entitlements.grant(googleSub, 'stripe', expiresAt);
          this.logger.log(`Stripe ${event.type} ${event.id}: refreshed premium for ${googleSub}.`);
        } else if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired') {
          await this.entitlements.expire(googleSub, 'stripe');
          this.logger.log(`Stripe ${event.type} ${event.id}: expired premium for ${googleSub}.`);
        } else {
          this.logger.log(
            `Stripe ${event.type} ${event.id}: status '${String(status)}'; no entitlement change.`,
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        await this.entitlements.expire(googleSub, 'stripe');
        this.logger.log(`Stripe ${event.type} ${event.id}: expired premium for ${googleSub}.`);
        break;
      }
      case 'invoice.payment_failed': {
        // Keep access during dunning; Stripe retries and the subscription
        // webhook will expire it if payment truly fails.
        this.logger.log(`Stripe ${event.type} ${event.id}: payment failed for ${googleSub}; keeping access.`);
        break;
      }
      default:
        this.logger.log(`Stripe event ${event.id}: unhandled type '${event.type}'; logged only.`);
    }
  }
}
