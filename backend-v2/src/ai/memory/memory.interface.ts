/** A single chat message as passed to the memory backend. */
export interface MemoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Long-term memory for the coach. MongoDB keeps the canonical conversation
 * history; this stores derived facts so the coach remembers what matters
 * across conversations. Every implementation degrades gracefully — memory
 * must never break the chat path.
 */
export abstract class MemoryService {
  abstract remember(userId: string, messages: MemoryMessage[]): Promise<void>;
  abstract recall(userId: string, query: string): Promise<string[]>;
}
