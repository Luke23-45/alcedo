import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isDuplicateKeyError } from '../../common/utils/persistence-errors';
import { WebhookEvent, WebhookEventDocument } from '../schemas/webhook-event.schema';
import {
  ClaimWebhookEventInput,
  WebhookClaimResult,
  WebhookEventRepository,
} from './webhook-event-repository.interface';

@Injectable()
export class MongoWebhookEventRepository extends WebhookEventRepository {
  private readonly logger = new Logger(MongoWebhookEventRepository.name);

  constructor(
    @InjectModel(WebhookEvent.name) private readonly model: Model<WebhookEventDocument>,
  ) {
    super();
  }

  async claim(input: ClaimWebhookEventInput): Promise<WebhookClaimResult> {
    try {
      await this.model.create({
        eventId: input.eventId,
        googleSub: input.googleSub,
        payload: input.payload,
        provider: input.provider,
        receivedAt: new Date(),
        status: 'claimed',
        type: input.type,
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const existing = await this.model
          .findOne({ eventId: input.eventId })
          .select('status')
          .lean()
          .exec();
        if (existing?.status === 'processed') {
          this.logger.log(
            `Duplicate ${input.provider} webhook ${input.eventId}; already applied; acking.`,
          );
          return 'duplicate-processed';
        }
        this.logger.log(
          `Duplicate ${input.provider} webhook ${input.eventId}; inflight elsewhere; acking.`,
        );
        return 'duplicate-inflight';
      }
      throw error;
    }
    return 'claimed';
  }

  async markProcessed(eventId: string): Promise<void> {
    await this.model.updateOne({ eventId }, { $set: { status: 'processed' } }).exec();
  }

  async releaseClaim(eventId: string): Promise<void> {
    await this.model.deleteOne({ eventId, status: 'claimed' }).exec();
  }
}
