import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isDuplicateKeyError } from '../../common/utils/persistence-errors';
import { PrismaService } from '../../database/prisma.service';
import {
  ClaimWebhookEventInput,
  WebhookClaimResult,
  WebhookEventRepository,
} from './webhook-event-repository.interface';

@Injectable()
export class PrismaWebhookEventRepository extends WebhookEventRepository {
  private readonly logger = new Logger(PrismaWebhookEventRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async claim(input: ClaimWebhookEventInput): Promise<WebhookClaimResult> {
    try {
      await this.prisma.webhookEvent.create({
        data: {
          eventId: input.eventId,
          googleSub: input.googleSub,
          payload: input.payload as Prisma.InputJsonValue,
          provider: input.provider,
          receivedAt: new Date(),
          status: 'claimed',
          type: input.type,
        },
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const existing = await this.prisma.webhookEvent.findUnique({
          select: { status: true },
          where: { eventId: input.eventId },
        });
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
    await this.prisma.webhookEvent.updateMany({
      data: { status: 'processed' },
      where: { eventId },
    });
  }

  async releaseClaim(eventId: string): Promise<void> {
    await this.prisma.webhookEvent.deleteMany({
      where: { eventId, status: 'claimed' },
    });
  }
}
