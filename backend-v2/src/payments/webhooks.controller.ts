import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { createHmac, timingSafeEqual } from 'crypto';
import { Request } from 'express';
import { IsIn, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentsService, RevenueCatEvent } from './payments.service';
import { StripeService } from './stripe.service';

class RevenueCatWebhookBody {
  @IsOptional()
  event?: unknown;
}

class WebCheckoutBody {
  @IsUUID()
  eventId!: string;

  @IsIn(['monthly', 'yearly', 'lifetime'])
  plan!: 'monthly' | 'yearly' | 'lifetime';

  @IsString()
  @IsNotEmpty()
  googleSub!: string;

  /** ISO-8601 expiry, or null for a lifetime purchase. */
  @IsISO8601()
  @IsOptional()
  expiresAt?: string | null;
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  // timingSafeEqual throws on mismatched lengths, so compare length first.
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Runtime shape check for the RevenueCat event. class-validator cannot
 * validate the `event` interface, so a malformed payload is rejected here
 * with a 400 instead of being applied with undefined fields.
 */
function asRevenueCatEvent(value: unknown): RevenueCatEvent | null {
  if (typeof value !== 'object' || value === null) return null;
  const e = value as Record<string, unknown>;
  if (typeof e['id'] !== 'string' || !e['id']) return null;
  if (typeof e['type'] !== 'string' || !e['type']) return null;
  if (typeof e['app_user_id'] !== 'string' || !e['app_user_id']) return null;
  const ids = e['entitlement_ids'];
  if (
    ids !== undefined &&
    !(Array.isArray(ids) && ids.every((x) => typeof x === 'string'))
  ) {
    return null;
  }
  const exp = e['expiration_at_ms'];
  if (exp !== undefined && exp !== null && typeof exp !== 'number') return null;
  return value as RevenueCatEvent;
}

/**
 * Provider webhooks. These routes are public by design — each verifies its own
 * credential (shared secret / HMAC) instead of a user access token. They opt
 * out of throttling because providers deliver in bursts.
 *
 * Reliability contract: the event is claimed before processing; on success it
 * is marked processed; on a transient failure the claim is released and the
 * error propagates (HTTP 500) so the provider retries. Application is
 * idempotent, so a retried event never double-applies. Only already-processed
 * or concurrently-inflight events are acked without work.
 */
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
    private readonly config: ConfigService,
  ) {}

  /**
   * RevenueCat webhook. The Authorization header must be exactly
   * `Bearer <REVENUECAT_WEBHOOK_SECRET>`.
   */
  @Post('revenuecat')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async revenuecat(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: RevenueCatWebhookBody,
  ) {
    const secret = this.config.getOrThrow<string>('REVENUECAT_WEBHOOK_SECRET');
    if (!safeEqual(Buffer.from(authorization ?? ''), Buffer.from(`Bearer ${secret}`))) {
      throw new UnauthorizedException({
        code: 'PAYMENTS_UNAUTHORIZED',
        message: 'Invalid webhook authorization.',
      });
    }

    const event = asRevenueCatEvent(body?.event);
    if (!event) {
      throw new BadRequestException({
        code: 'PAYMENTS_MALFORMED_EVENT',
        message: 'Malformed RevenueCat event.',
      });
    }

    const claim = await this.paymentsService.claimEvent(
      event.id,
      'revenuecat',
      event.type,
      event.app_user_id,
      event as unknown as Record<string, unknown>,
    );
    if (claim !== 'claimed') return { status: 'duplicate' };

    try {
      const entitlementId = this.config.get<string>('REVENUECAT_PREMIUM_ENTITLEMENT') ?? 'premium';
      await this.paymentsService.applyRevenueCatEvent(event, entitlementId);
    } catch (error) {
      this.logger.error(
        `RevenueCat event ${event.id}: processing failed; releasing claim for retry.`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.paymentsService.releaseEventClaim(event.id);
      throw error;
    }
    await this.paymentsService.markEventProcessed(event.id);
    return { status: 'ok' };
  }

  /**
   * Website checkout webhook. The X-Signature header must be the lowercase
   * hex HMAC-SHA256 of the raw request body, keyed with WEB_CHECKOUT_SECRET.
   */
  @Post('web-checkout')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async webCheckout(
    @Req() req: Request,
    @Headers('x-signature') signature: string | undefined,
    @Body() body: WebCheckoutBody,
  ) {
    const secret = this.config.getOrThrow<string>('WEB_CHECKOUT_SECRET');
    const rawBody: Buffer | undefined = (req as unknown as { rawBody?: Buffer }).rawBody;
    const expected = rawBody
      ? Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'))
      : undefined;
    if (!expected || !signature || !safeEqual(Buffer.from(signature), expected)) {
      throw new UnauthorizedException({
        code: 'PAYMENTS_BAD_SIGNATURE',
        message: 'Invalid webhook signature.',
      });
    }

    const claim = await this.paymentsService.claimEvent(
      body.eventId,
      'web',
      'purchase',
      body.googleSub,
      body as unknown as Record<string, unknown>,
    );
    if (claim !== 'claimed') return { status: 'duplicate' };

    try {
      await this.paymentsService.applyWebCheckoutEvent({
        eventId: body.eventId,
        expiresAt: body.expiresAt ?? null,
        googleSub: body.googleSub,
        plan: body.plan,
      });
    } catch (error) {
      this.logger.error(
        `Web-checkout event ${body.eventId}: processing failed; releasing claim for retry.`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.paymentsService.releaseEventClaim(body.eventId);
      throw error;
    }
    await this.paymentsService.markEventProcessed(body.eventId);
    return { status: 'ok' };
  }

  /**
   * Stripe webhook. The `Stripe-Signature` header is verified against
   * STRIPE_WEBHOOK_SECRET using the raw request body.
   *
   * A missing Stripe configuration surfaces as 503 (not a signature error);
   * a bad signature is 401; a transient processing failure is 500 so Stripe
   * retries the event.
   */
  @Post('stripe')
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async stripe(@Req() req: Request, @Headers('stripe-signature') signature: string | undefined) {
    const rawBody: Buffer | undefined = (req as unknown as { rawBody?: Buffer }).rawBody;
    if (!rawBody || !signature) {
      throw new UnauthorizedException({
        code: 'PAYMENTS_BAD_SIGNATURE',
        message: 'Missing Stripe webhook signature.',
      });
    }
    let event: { id: string; type: string; data: { object: Record<string, unknown> } };
    try {
      event = this.stripeService.constructEvent(rawBody, signature) as unknown as {
        id: string;
        type: string;
        data: { object: Record<string, unknown> };
      };
    } catch (error) {
      // Stripe not configured is a 503, not a signature failure.
      if (error instanceof ServiceUnavailableException) throw error;
      throw new UnauthorizedException({
        code: 'PAYMENTS_BAD_SIGNATURE',
        message: 'Invalid Stripe webhook signature.',
      });
    }

    const metadata = event.data.object['metadata'] as Record<string, unknown> | undefined;
    const googleSub =
      metadata?.['googleSub'] ?? event.data.object['client_reference_id'] ?? 'unknown';
    const claim = await this.paymentsService.claimEvent(
      event.id,
      'stripe',
      event.type,
      typeof googleSub === 'string' ? googleSub : 'unknown',
      event.data.object,
    );
    if (claim !== 'claimed') return { status: 'duplicate' };

    try {
      await this.paymentsService.applyStripeEvent(event);
    } catch (error) {
      this.logger.error(
        `Stripe event ${event.id}: processing failed; releasing claim for retry.`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.paymentsService.releaseEventClaim(event.id);
      throw error;
    }
    await this.paymentsService.markEventProcessed(event.id);
    return { status: 'ok' };
  }
}
