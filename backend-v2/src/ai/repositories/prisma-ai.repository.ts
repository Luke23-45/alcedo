import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { newId } from '../../common/utils/ids';
import { PrismaService } from '../../database/prisma.service';
import type { MessageRole } from '../schemas/message.schema';
import {
  AiUsageInput,
  AiUsageRepository,
  ConversationList,
  ConversationRecord,
  ConversationRepository,
  CreateMessageInput,
  MessageRecord,
  MessageRepository,
} from './ai-repository.interface';

type ConversationRow = Prisma.ConversationGetPayload<object>;
type MessageRow = Prisma.MessageGetPayload<object>;

function toConversation(row: ConversationRow): ConversationRecord {
  return {
    createdAt: row.createdAt,
    id: row.id,
    messageCount: row.messageCount,
    title: row.title ?? undefined,
    updatedAt: row.updatedAt,
    userId: row.userId,
  };
}

function toMessage(row: MessageRow): MessageRecord {
  const usage = row.usage as MessageRecord['usage'] | null;
  return {
    content: row.content,
    conversationId: row.conversationId,
    createdAt: row.createdAt,
    flagged: row.flagged,
    id: row.id,
    role: row.role as MessageRole,
    usage: usage ?? undefined,
    userId: row.userId,
  };
}

@Injectable()
export class PrismaConversationRepository extends ConversationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(userId: string, title?: string): Promise<ConversationRecord> {
    const row = await this.prisma.conversation.create({
      data: { id: newId(), title, userId },
    });
    return toConversation(row);
  }

  async listForUser(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<ConversationList> {
    const capped = Math.min(Math.max(limit, 1), 100);
    const where: Prisma.ConversationWhereInput = { userId };
    if (cursor) {
      const at = new Date(cursor);
      if (!Number.isNaN(at.getTime())) where.updatedAt = { lt: at };
    }
    const rows = await this.prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      take: capped + 1,
      where,
    });
    const items = rows.slice(0, capped).map(toConversation);
    const nextCursor =
      rows.length > capped && items.length > 0
        ? items[items.length - 1].updatedAt.toISOString()
        : null;
    return { items, nextCursor };
  }

  async findOwned(id: string, userId: string): Promise<ConversationRecord | null> {
    const row = await this.prisma.conversation.findFirst({ where: { id, userId } });
    return row ? toConversation(row) : null;
  }

  async setTitleIfEmpty(id: string, title: string): Promise<void> {
    await this.prisma.conversation.updateMany({
      data: { title },
      where: { id, OR: [{ title: null }, { title: '' }] },
    });
  }

  async incrementMessageCount(id: string, by: number): Promise<void> {
    await this.prisma.conversation.updateMany({
      data: { messageCount: { increment: by }, updatedAt: new Date() },
      where: { id },
    });
  }

  async deleteOwned(id: string, userId: string): Promise<boolean> {
    const { count } = await this.prisma.conversation.deleteMany({ where: { id, userId } });
    return count === 1;
  }
}

@Injectable()
export class PrismaMessageRepository extends MessageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: CreateMessageInput): Promise<MessageRecord> {
    const row = await this.prisma.message.create({
      data: {
        content: input.content,
        conversationId: input.conversationId,
        flagged: input.flagged ?? false,
        id: newId(),
        role: input.role,
        usage: input.usage,
        userId: input.userId,
      },
    });
    return toMessage(row);
  }

  async history(conversationId: string, limit: number): Promise<MessageRecord[]> {
    const rows = await this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 100),
      where: { conversationId },
    });
    return rows.map(toMessage).reverse();
  }

  async deleteByConversation(conversationId: string): Promise<void> {
    await this.prisma.message.deleteMany({ where: { conversationId } });
  }
}

@Injectable()
export class PrismaAiUsageRepository extends AiUsageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async record(input: AiUsageInput): Promise<void> {
    await this.prisma.aiUsage.create({
      data: {
        completionTokens: input.completionTokens,
        conversationId: input.conversationId,
        costUsd: input.costUsd ?? null,
        messageId: input.messageId,
        promptTokens: input.promptTokens,
        skillNames: input.skillNames ?? [],
        userId: input.userId,
      },
    });
  }
}
