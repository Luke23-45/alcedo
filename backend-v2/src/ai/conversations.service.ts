import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntitlementService } from '../users/entitlement.service';
import { AiConfigService } from './ai-config.service';
import { COACH_SYSTEM_PROMPT } from './guardrails/system-prompt';
import { ModerationService } from './guardrails/moderation.service';
import { OutputCheckService, SELF_HARM_COMPLETION } from './guardrails/output-check.service';
import { TopicGuard } from './guardrails/topic-guard.interface';
import { SelectedSkill } from './skills/skill.interface';
import { SkillRegistry } from './skills/skill-registry.service';
import { LiteLLMClient, LiteLLMError, LiteLlmMessage, LiteLlmUsage } from './litellm.client';
import { MemoryExtractionService } from './memory/memory-extraction.service';
import { MemoryService } from './memory/memory.interface';
import { QuotaService } from './quota.service';
import {
  AiUsageRepository,
  ConversationRecord,
  ConversationRepository,
  MessageRepository,
} from './repositories/ai-repository.interface';

const HISTORY_WINDOW = 20;

const OFF_TOPIC_RESPONSE =
  "I'm Alcedo Coach — I only help with training, nutrition for active people, and recovery. What are we working on today?";

export interface PostMessageResult {
  conversationId: string;
  /** Id of the persisted user message (uuid). */
  messageId: string;
  /** Id of the assistant reply — fixed redirect or model output (uuid). */
  replyMessageId: string;
}

export type CoachStreamEvent =
  | { type: 'start'; conversationId: string; messageId: string }
  | { type: 'token'; delta: string }
  | { type: 'done'; replyMessageId: string; usage?: LiteLlmUsage };

/** Callbacks the pipeline uses to feed the SSE layer; unused by the non-streaming path. */
interface TurnListener {
  onUserMessagePersisted?(messageId: string): void;
  onToken?(delta: string): void;
}

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(
    private readonly conversations: ConversationRepository,
    private readonly messages: MessageRepository,
    private readonly aiUsage: AiUsageRepository,
    private readonly litellm: LiteLLMClient,
    private readonly topicGuard: TopicGuard,
    private readonly moderation: ModerationService,
    private readonly outputCheck: OutputCheckService,
    private readonly quota: QuotaService,
    private readonly memory: MemoryService,
    private readonly extraction: MemoryExtractionService,
    private readonly entitlement: EntitlementService,
    private readonly config: ConfigService,
    private readonly skills: SkillRegistry,
    private readonly aiConfig: AiConfigService,
  ) {}

  createConversation(userId: string, title?: string): Promise<ConversationRecord> {
    return this.conversations.create(userId, title);
  }

  async listConversations(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ conversations: ConversationRecord[]; nextCursor: string | null }> {
    const { items, nextCursor } = await this.conversations.listForUser(userId, limit, cursor);
    return { conversations: items, nextCursor };
  }

  async history(userId: string, conversationId: string, limit: number) {
    await this.requireOwned(userId, conversationId);
    return this.messages.history(conversationId, limit);
  }

  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    await this.requireOwned(userId, conversationId);
    await this.messages.deleteByConversation(conversationId);
    await this.conversations.deleteOwned(conversationId, userId);
  }

  private async requireOwned(userId: string, conversationId: string): Promise<ConversationRecord> {
    const convo = await this.conversations.findOwned(conversationId, userId);
    if (!convo) {
      throw new NotFoundException({
        code: 'AI_CONVERSATION_NOT_FOUND',
        message: 'Conversation not found.',
      });
    }
    return convo;
  }

  async postMessage(
    userId: string,
    conversationId: string,
    content: string,
  ): Promise<PostMessageResult> {
    const outcome = await this.runCoachTurn({
      content,
      conversationId,
      googleSub: userId,
      stream: false,
    });
    return {
      conversationId: outcome.conversationId,
      messageId: outcome.messageId,
      replyMessageId: outcome.replyMessageId,
    };
  }

  async streamMessage(
    userId: string,
    conversationId: string,
    content: string,
    opts: { signal?: AbortSignal; onEvent: (event: CoachStreamEvent) => void },
  ): Promise<void> {
    const outcome = await this.runCoachTurn({
      content,
      conversationId,
      googleSub: userId,
      listener: {
        onToken: (delta) => opts.onEvent({ delta, type: 'token' }),
        onUserMessagePersisted: (messageId) =>
          opts.onEvent({ conversationId, messageId, type: 'start' }),
      },
      signal: opts.signal,
      stream: true,
    });
    opts.onEvent({ replyMessageId: outcome.replyMessageId, type: 'done', usage: outcome.usage });
  }

  /**
   * The single coach-turn pipeline used by both the streaming and the
   * non-streaming endpoints.
   *
   * Order is load-bearing:
   *  1. load + ownership check
   *  2. persist the user turn FIRST so history survives downstream failures
   *  3. topic guard — off-topic / self-harm never reach the model or quota
   *  4. moderation (fail-closed when enabled)
   *  5. premium stream gating
   *  6. quota — reserved only when the model is actually about to be called
   *  7. prompt assembly (server-owned system prompt, delimited user data)
   *  8. model call (streamed or not), output checks, persist, usage log
   *  9. fire-and-forget memory extraction
   */
  private async runCoachTurn(args: {
    googleSub: string;
    conversationId: string;
    content: string;
    stream: boolean;
    signal?: AbortSignal;
    listener?: TurnListener;
  }): Promise<PostMessageResult & { usage?: LiteLlmUsage }> {
    const { googleSub, conversationId, content, stream, signal, listener } = args;

    // 1. Load + ownership (every access filters by userId).
    const convo = await this.requireOwned(googleSub, conversationId);

    // 2. Persist the user turn first — history must survive later failures.
    const userMessage = await this.messages.create({
      content,
      conversationId,
      role: 'user',
      userId: googleSub,
    });
    if (!convo.title) {
      const title = content.trim().slice(0, 60);
      if (title) await this.conversations.setTitleIfEmpty(convo.id, title);
    }
    listener?.onUserMessagePersisted?.(userMessage.id);

    // 3. Topic guard. Off-topic and self-harm turns get a fixed reply without
    //    touching the model and without consuming quota.
    const topic = await this.topicGuard.classify(content);
    if (topic.selfHarm) {
      const reply = await this.persistFixedReply(convo.id, googleSub, SELF_HARM_COMPLETION);
      return { conversationId, messageId: userMessage.id, replyMessageId: reply.id };
    }
    if (topic.verdict === 'off-topic') {
      const reply = await this.persistFixedReply(convo.id, googleSub, OFF_TOPIC_RESPONSE);
      return { conversationId, messageId: userMessage.id, replyMessageId: reply.id };
    }

    // 4. Moderation — flagged inputs are refused; an unreachable moderator
    //    fails closed (503) instead of passing silently.
    const moderation = await this.moderation.moderate(content, signal);
    if (moderation.flagged) {
      throw new BadRequestException({
        code: 'AI_MODERATION_FLAGGED',
        message: "I can't help with that one. Happy to help with your training instead.",
      });
    }

    // 5. Premium gating for live streaming.
    const isPremium = await this.entitlement.isPremiumActive(googleSub);
    if (stream && this.config.get<boolean>('AI_STREAM_PREMIUM_ONLY', false) && !isPremium) {
      throw new HttpException(
        {
          code: 'AI_STREAM_PREMIUM_ONLY',
          message:
            'Live streaming replies are a Premium feature. Upgrade to unlock them — standard replies keep working within your daily limit.',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // 6. Quota — reserved only now that a model call is certain.
    await this.quota.checkAndReserve(googleSub, isPremium);

    // 7. Prompt assembly: server-owned system prompt, selected skill blocks,
    //    trusted long-term facts, then history. The fresh user turn is
    //    delimited as data, never concatenated into instructions.
    //    Skills are trusted server instructions selected deterministically
    //    from the topic verdict + message text. They load after the base
    //    system prompt and before memory/history so the base rules win ties.
    const selectedSkills = this.skills.select(content, topic);
    const prompt = await this.buildPrompt(googleSub, conversationId, content, selectedSkills);

    // 8. Model call.
    let fullText = '';
    const usage: LiteLlmUsage = {};
    try {
      if (stream) {
        for await (const chunk of this.litellm.streamChat(prompt, { signal })) {
          if (chunk.content) {
            fullText += chunk.content;
            listener?.onToken?.(chunk.content);
          }
          if (chunk.usage) Object.assign(usage, chunk.usage);
        }
      } else {
        const result = await this.litellm.chat(prompt, { signal });
        fullText = result.content;
        Object.assign(usage, result.usage);
      }
    } catch (err) {
      if (signal?.aborted) throw err;
      if (err instanceof LiteLLMError) {
        throw new HttpException(
          {
            code: 'AI_MODEL_UNAVAILABLE',
            details: { upstreamStatus: err.status ?? null },
            message: 'The AI coach is temporarily unavailable. Please try again in a moment.',
          },
          HttpStatus.BAD_GATEWAY,
        );
      }
      throw err;
    }

    // Output checks on the completed text: blocking findings replace the
    // tail with a safe completion; PII is redacted in place.
    const checked = this.outputCheck.checkOutput(fullText);
    if (!checked.safe) {
      this.logger.warn(
        `Output check blocked model output (${checked.findings.join(', ')}) — tail replaced.`,
      );
    }

    const assistant = await this.messages.create({
      content: checked.sanitized,
      conversationId,
      flagged: !checked.safe || checked.findings.length > 0,
      role: 'assistant',
      usage: {
        completionTokens: usage.completionTokens,
        costUsd: usage.costUsd ?? null,
        promptTokens: usage.promptTokens,
      },
      userId: googleSub,
    });

    // Per-message usage log. costUsd is whatever the upstream reported —
    // null when absent, never invented.
    await this.aiUsage.record({
      completionTokens: usage.completionTokens,
      conversationId,
      costUsd: usage.costUsd ?? null,
      messageId: assistant.id,
      promptTokens: usage.promptTokens,
      skillNames: selectedSkills.map((s) => s.skill.name),
      userId: googleSub,
    });

    await this.conversations.incrementMessageCount(convo.id, 2);

    // 9. Fire-and-forget memory extraction: never blocks, never rejects.
    void this.extraction
      .extractMemory(googleSub, content, checked.sanitized)
      .catch((err: unknown) =>
        this.logger.warn(`Memory extraction failed: ${(err as Error)?.message ?? err}`),
      );

    return {
      conversationId,
      messageId: userMessage.id,
      replyMessageId: assistant.id,
      usage,
    };
  }

  /** Persists a fixed guardrail reply (off-topic / self-harm) and bumps the conversation. */
  private async persistFixedReply(conversationId: string, userId: string, content: string) {
    const reply = await this.messages.create({
      content,
      conversationId,
      flagged: true,
      role: 'assistant',
      userId,
    });
    await this.conversations.incrementMessageCount(conversationId, 2);
    return reply;
  }

  private async buildPrompt(
    googleSub: string,
    conversationId: string,
    content: string,
    selectedSkills: SelectedSkill[],
  ): Promise<LiteLlmMessage[]> {
    const [history, facts] = await Promise.all([
      this.messages.history(conversationId, HISTORY_WINDOW),
      this.memory.recall(googleSub, content).catch(() => [] as string[]),
    ]);
    // Admin can override the system instructions from the website admin panel.
    const systemInstructions = (await this.aiConfig.getSystemInstructions()) ?? COACH_SYSTEM_PROMPT;
    const prompt: LiteLlmMessage[] = [{ content: systemInstructions, role: 'system' }];
    // Skill instructions can also be customized per-skill from the admin panel.
    const rendered = await this.skills.renderWithOverrides(selectedSkills);
    if (rendered) {
      prompt.push({ content: rendered, role: 'system' });
      this.logger.debug(
        `Injected skills: ${selectedSkills.map((s) => `${s.skill.name}(${s.reason})`).join(', ')}`,
      );
    }
    if (facts.length > 0) {
      prompt.push({
        content: `Known facts about the user (from your long-term memory, trusted):\n${facts
          .map((f) => `- ${f}`)
          .join('\n')}`,
        role: 'system',
      });
    }
    const mapped: LiteLlmMessage[] = history
      .filter((m) => m.role !== 'system')
      .map((m) => ({ content: m.content, role: m.role }));
    // The freshly persisted user turn is the tail of history: wrap it in
    // delimiters so the model always treats it as data, never instructions.
    const last = mapped[mapped.length - 1];
    if (last && last.role === 'user') {
      last.content = `<user_message>\n${last.content}\n</user_message>`;
    }
    prompt.push(...mapped);
    return prompt;
  }
}
