import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LiteLLMClient } from '../litellm.client';

export interface ModerationVerdict {
  flagged: boolean;
  categories: string[];
}

/**
 * Real input moderation backed by the LiteLLM /v1/moderations endpoint.
 *
 * Enabled via MODERATION_ENABLED. When enabled and the endpoint is
 * unreachable, slow, or errors, we FAIL CLOSED with 503 rather than silently
 * skipping a safety control the operator explicitly turned on: a missing
 * moderation check must never look like a clean verdict.
 */
@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly litellm: LiteLLMClient,
  ) {}

  /**
   * Returns the verdict for the text. Never throws on a flagged result —
   * the caller decides how to refuse. Throws 503 (fail closed) when
   * moderation is enabled but unavailable.
   */
  async moderate(text: string, signal?: AbortSignal): Promise<ModerationVerdict> {
    if (!this.config.get<boolean>('MODERATION_ENABLED', false)) {
      return { categories: [], flagged: false };
    }
    try {
      return await this.litellm.moderate(text, { signal });
    } catch (err) {
      this.logger.error(`Moderation endpoint failed: ${(err as Error)?.message ?? err}`);
      throw new ServiceUnavailableException({
        code: 'AI_MODERATION_UNAVAILABLE',
        message: 'Safety check is temporarily unavailable. Please try again in a moment.',
      });
    }
  }
}
