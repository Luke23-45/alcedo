import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { newId } from '../../common/utils/ids';
import { AiUsage, AiUsageDocument } from '../schemas/ai-usage.schema';
import { Conversation, ConversationDocument } from '../schemas/conversation.schema';
import { Message, MessageDocument } from '../schemas/message.schema';
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

function toConversation(doc: ConversationDocument): ConversationRecord {
  return {
    createdAt: doc.createdAt,
    id: doc._id,
    messageCount: doc.messageCount,
    title: doc.title,
    updatedAt: doc.updatedAt,
    userId: doc.userId,
  };
}

function toMessage(doc: MessageDocument): MessageRecord {
  return {
    content: doc.content,
    conversationId: doc.conversationId,
    createdAt: doc.createdAt,
    flagged: doc.flagged,
    id: doc._id,
    role: doc.role,
    usage: doc.usage,
    userId: doc.userId,
  };
}

@Injectable()
export class MongoConversationRepository extends ConversationRepository {
  constructor(
    @InjectModel(Conversation.name) private readonly model: Model<ConversationDocument>,
  ) {
    super();
  }

  async create(userId: string, title?: string): Promise<ConversationRecord> {
    const doc = await this.model.create({ _id: newId(), title, userId });
    return toConversation(doc);
  }

  async listForUser(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<ConversationList> {
    const capped = Math.min(Math.max(limit, 1), 100);
    const filter: FilterQuery<ConversationDocument> = { userId };
    if (cursor) {
      const at = new Date(cursor);
      if (!Number.isNaN(at.getTime())) filter.updatedAt = { $lt: at };
    }
    const docs = await this.model
      .find(filter)
      .sort({ updatedAt: -1 })
      .limit(capped + 1)
      .exec();
    const items = docs.slice(0, capped).map(toConversation);
    const nextCursor =
      docs.length > capped && items.length > 0
        ? items[items.length - 1].updatedAt.toISOString()
        : null;
    return { items, nextCursor };
  }

  async findOwned(id: string, userId: string): Promise<ConversationRecord | null> {
    const doc = await this.model.findOne({ _id: id, userId }).exec();
    return doc ? toConversation(doc) : null;
  }

  async setTitleIfEmpty(id: string, title: string): Promise<void> {
    await this.model.updateOne({ _id: id, title: { $in: [null, ''] } }, { $set: { title } }).exec();
  }

  async incrementMessageCount(id: string, by: number): Promise<void> {
    await this.model
      .updateOne({ _id: id }, { $inc: { messageCount: by }, $set: { updatedAt: new Date() } })
      .exec();
  }

  async deleteOwned(id: string, userId: string): Promise<boolean> {
    const res = await this.model.deleteOne({ _id: id, userId }).exec();
    return res.deletedCount === 1;
  }
}

@Injectable()
export class MongoMessageRepository extends MessageRepository {
  constructor(@InjectModel(Message.name) private readonly model: Model<MessageDocument>) {
    super();
  }

  async create(input: CreateMessageInput): Promise<MessageRecord> {
    const doc = await this.model.create({ _id: newId(), ...input });
    return toMessage(doc);
  }

  async history(conversationId: string, limit: number): Promise<MessageRecord[]> {
    const docs = await this.model
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(Math.min(Math.max(limit, 1), 100))
      .exec();
    return docs.map(toMessage).reverse();
  }

  async deleteByConversation(conversationId: string): Promise<void> {
    await this.model.deleteMany({ conversationId }).exec();
  }
}

@Injectable()
export class MongoAiUsageRepository extends AiUsageRepository {
  constructor(
    @InjectModel(AiUsage.name) private readonly model: Model<AiUsageDocument>,
  ) {
    super();
  }

  async record(input: AiUsageInput): Promise<void> {
    await this.model.create({
      completionTokens: input.completionTokens,
      conversationId: input.conversationId,
      costUsd: input.costUsd ?? null,
      messageId: input.messageId,
      promptTokens: input.promptTokens,
      userId: input.userId,
    });
  }
}
