import { Module } from '@nestjs/common';
import { SiteConfigModule } from '../site-config/site-config.module';
import { UsersModule } from '../users/users.module';
import { BillingController } from './billing.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { WebhooksController } from './webhooks.controller';

// The WebhookEventRepository binding is owned by the global
// PersistenceModule — this module injects the token directly.

@Module({
  controllers: [BillingController, WebhooksController],
  imports: [UsersModule, SiteConfigModule],
  providers: [PaymentsService, StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}
