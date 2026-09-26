import { Body, ConflictException, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { IsNotEmpty, IsString } from 'class-validator';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { UserRepository } from '../users/repositories/user-repository.interface';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';

class CheckoutBody {
  @IsString()
  @IsNotEmpty()
  priceId!: string;
}

/**
 * Billing endpoints for the website purchase flow. Guard-protected: the
 * global JwtAuthGuard verifies the access token and CurrentUserSub resolves
 * the Google sub from it.
 */
@Controller('billing')
export class BillingController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
    private readonly config: ConfigService,
    private readonly users: UserRepository,
  ) {}

  /**
   * In-flight checkout tasks per Google sub. A double-clicked Subscribe
   * button must not create two Stripe customers/sessions: the second request
   * awaits and receives the same checkout URL. Single-instance dedup — one
   * backend instance serves all website traffic.
   */
  private readonly checkoutInFlight = new Map<string, Promise<{ url: string }>>();

  @Get('status')
  status(@CurrentUserSub() googleSub: string) {
    return this.paymentsService.billingStatus(googleSub);
  }

  /**
   * Public plan catalog. No authentication required — the website pricing
   * page reads this so prices always come from Stripe, never invented.
   * Empty list when Stripe is not configured.
   */
  @Get('plans')
  plans() {
    return this.stripeService.getPublicPlans();
  }

  /**
   * Creates a Stripe Checkout Session for the given price and returns the
   * hosted URL. The website redirects the buyer there; Stripe calls back to
   * POST /webhooks/stripe, which grants the entitlement to the Google sub.
   *
   * Redirects land on real website pages (`/account?upgraded=1` on success,
   * `/pricing?cancelled=1` on cancel). Checkout is throttled and rejected
   * when the account already has an active subscription — no duplicate
   * checkouts.
   */
  @Post('checkout')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async checkout(@CurrentUserSub() googleSub: string, @Body() body: CheckoutBody) {
    const inFlight = this.checkoutInFlight.get(googleSub);
    if (inFlight) return inFlight;
    const task = this.doCheckout(googleSub, body.priceId).finally(() => {
      if (this.checkoutInFlight.get(googleSub) === task) {
        this.checkoutInFlight.delete(googleSub);
      }
    });
    this.checkoutInFlight.set(googleSub, task);
    return task;
  }

  private async doCheckout(googleSub: string, priceId: string): Promise<{ url: string }> {
    const user = await this.users.findByGoogleSub(googleSub);
    if (await this.paymentsService.hasActiveSubscription(googleSub)) {
      throw new ConflictException({
        code: 'BILLING_ALREADY_PREMIUM',
        message: 'This account already has an active premium subscription.',
      });
    }
    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const { url } = await this.stripeService.createCheckoutSession({
      cancelUrl: `${frontendUrl}/pricing?cancelled=1`,
      customerId: user?.stripeCustomerId,
      email: user?.email,
      googleSub,
      priceId,
      successUrl: `${frontendUrl}/account?upgraded=1`,
    });
    return { url };
  }

  /** Creates a Stripe Customer Portal session for managing the subscription. */
  @Post('portal')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async portal(@CurrentUserSub() googleSub: string) {
    const user = await this.users.findByGoogleSub(googleSub);
    if (!user?.stripeCustomerId) {
      return { url: null as string | null };
    }
    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    return this.stripeService.createPortalSession(user.stripeCustomerId, `${frontendUrl}/account`);
  }
}
