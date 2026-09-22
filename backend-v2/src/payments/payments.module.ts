import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteConfigModule } from '../site-config/site-config.module';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { BillingController } from './billing.controller';
import { PaymentsService } from './payments.service';
import { WebhookEvent, WebhookEventSchema } from './schemas/webhook-event.schema';
import { StripeService } from './stripe.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  controllers: [BillingController, WebhooksController],
  imports: [
    UsersModule,
    SiteConfigModule,
    MongooseModule.forFeature([
      { name: WebhookEvent.name, schema: WebhookEventSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PaymentsService, StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}
