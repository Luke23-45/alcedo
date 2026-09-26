export type WebhookProvider = 'revenuecat' | 'web' | 'stripe';

export interface ClaimWebhookEventInput {
  eventId: string;
  provider: WebhookProvider;
  type: string;
  googleSub: string;
  payload: Record<string, unknown>;
}

/**
 * Result of claiming a webhook event:
 * - `'claimed'` — this call won the race and must process the event.
 * - `'duplicate-processed'` — the event was already applied; ack only.
 * - `'duplicate-inflight'` — another request is processing it right now;
 *   ack without re-applying (its outcome decides the retry, not ours).
 */
export type WebhookClaimResult = 'claimed' | 'duplicate-processed' | 'duplicate-inflight';

/**
 * Audit log + idempotency gate for inbound payment webhooks. The unique
 * `eventId` makes claiming atomic: a redelivery racing the original fails
 * the insert with a duplicate-key error instead of applying twice.
 */
export abstract class WebhookEventRepository {
  abstract claim(input: ClaimWebhookEventInput): Promise<WebhookClaimResult>;
  /** Marks a claimed event as applied. Idempotent. */
  abstract markProcessed(eventId: string): Promise<void>;
  /**
   * Releases a claim after a transient processing failure so the provider's
   * retry can re-claim and re-process. Application is idempotent, so a
   * reprocessed event never double-applies.
   */
  abstract releaseClaim(eventId: string): Promise<void>;
}
