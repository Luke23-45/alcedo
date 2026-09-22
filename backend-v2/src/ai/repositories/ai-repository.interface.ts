import type { MessageRole } from '../schemas/message.schema';

export interface ConversationRecord {
  id: string;
  userId: string;
  title?: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationList {
  items: ConversationRecord[];
  /** Opaque cursor for the next page (updatedAt ISO), or null when done. */
  nextCursor: string | null;
}

export abstract class ConversationRepository {
  abstract create(userId: string, title?: string): Promise<ConversationRecord>;
  abstract listForUser(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<ConversationList>;
  abstract findOwned(id: string, userId: string): Promise<ConversationRecord | null>;
  abstract setTitleIfEmpty(id: string, title: string): Promise<void>;
  abstract incrementMessageCount(id: string, by: number): Promise<void>;
  /** Deletes the conversation only when owned; returns true when deleted. */
  abstract deleteOwned(id: string, userId: string): Promise<boolean>;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  userId: string;
  role: MessageRole;
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    costUsd?: number | null;
    model?: string;
  };
  flagged?: boolean;
  createdAt: Date;
}

export interface CreateMessageInput {
  conversationId: string;
  userId: string;
  role: MessageRole;
  content: string;
  usage?: MessageRecord['usage'];
  flagged?: boolean;
}

export abstract class MessageRepository {
  abstract create(input: CreateMessageInput): Promise<MessageRecord>;
  /** History oldest-first, capped. */
  abstract history(conversationId: string, limit: number): Promise<MessageRecord[]>;
  abstract deleteByConversation(conversationId: string): Promise<void>;
}

export interface AiUsageInput {
  userId: string;
  conversationId: string;
  /** The assistant message this usage belongs to (uuid). */
  messageId: string;
  promptTokens?: number;
  completionTokens?: number;
  /** From the upstream cost header; null when not reported — never invented. */
  costUsd?: number | null;
  /** Skill names injected into the prompt for this turn (observability). */
  skillNames?: string[];
}

export abstract class AiUsageRepository {
  abstract record(input: AiUsageInput): Promise<void>;
}
