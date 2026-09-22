import { Injectable, Logger } from '@nestjs/common';
import { LiteLLMClient } from '../litellm.client';
import { MemoryService } from './memory.interface';

const EXTRACTION_SYSTEM_PROMPT = `You extract durable facts about the user from a fitness coaching exchange. Durable means worth remembering across conversations: training goals, injuries or pain, equipment or schedule constraints, preferences, personal records.

Return ONLY a JSON array of short strings, e.g. ["Goal: squat 140 kg", "Left knee pain when squatting deep", "Trains at home with dumbbells only"]. If nothing is worth remembering, return [].`;

const MAX_FACTS = 10;
const MAX_FACT_CHARS = 280;

/** Tolerantly parses the model's JSON array output; [] on any failure. */
function parseFactList(content: string): string[] {
  const start = content.indexOf('[');
  const end = content.lastIndexOf(']');
  if (start === -1 || end <= start) return [];
  try {
    const parsed: unknown = JSON.parse(content.slice(start, end + 1));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((f): f is string => typeof f === 'string')
      .map((f) => f.trim().slice(0, MAX_FACT_CHARS))
      .filter((f) => f.length > 3)
      .slice(0, MAX_FACTS);
  } catch {
    return [];
  }
}

/**
 * Extracts durable user facts from a completed exchange via a cheap,
 * non-streaming model call (temperature 0, 300 max tokens). Runs AFTER the
 * response is delivered — never on the request hot path. The LLM acts as a
 * relevance gate: the exchange is stored in long-term memory only when at
 * least one durable fact was found, so routine small talk never pollutes
 * memory. Any failure is logged and skipped.
 */
@Injectable()
export class MemoryExtractionService {
  private readonly logger = new Logger(MemoryExtractionService.name);

  constructor(
    private readonly litellm: LiteLLMClient,
    private readonly memory: MemoryService,
  ) {}

  async extractMemory(
    userId: string,
    userText: string,
    assistantText: string,
  ): Promise<void> {
    try {
      const result = await this.litellm.chat(
        [
          { content: EXTRACTION_SYSTEM_PROMPT, role: 'system' },
          {
            content: `User message:\n${userText}\n\nAssistant reply:\n${assistantText}`,
            role: 'user',
          },
        ],
        { maxTokens: 300, temperature: 0 },
      );
      const facts = parseFactList(result.content);
      if (facts.length === 0) return;
      await this.memory.remember(userId, [
        { content: userText, role: 'user' },
        { content: assistantText, role: 'assistant' },
      ]);
    } catch (err) {
      this.logger.warn(`Memory extraction skipped: ${(err as Error)?.message ?? err}`);
    }
  }
}
