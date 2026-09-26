import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SiteConfigModule } from '../site-config/site-config.module';
import { UsersModule } from '../users/users.module';
import { AiConfigService } from './ai-config.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { KeywordTopicGuard } from './guardrails/keyword-topic-guard.service';
import { ModerationService } from './guardrails/moderation.service';
import { OutputCheckService } from './guardrails/output-check.service';
import { TopicGuard } from './guardrails/topic-guard.interface';
import { LiteLLMClient } from './litellm.client';
import { MemoryExtractionService } from './memory/memory-extraction.service';
import { MemoryService } from './memory/memory.interface';
import { Mem0MemoryService } from './memory/memory.service';
import { QuotaService } from './quota.service';
import { ALL_SKILLS } from './skills/skill-definitions';
import { SkillRegistry } from './skills/skill-registry.service';
import { SKILL_DEFINITIONS } from './skills/skill.interface';

// Repository bindings (ConversationRepository, MessageRepository,
// AiUsageRepository, AiDailyUsageRepository) are owned by the global
// PersistenceModule — this module injects the tokens directly.

@Module({
  controllers: [ConversationsController],
  imports: [
    // Provides EntitlementService (getStatus/isPremiumActive) for quota and
    // stream gating — owned by the users module, never reimplemented here.
    UsersModule,
    SiteConfigModule,
  ],
  providers: [
    ConversationsService,
    QuotaService,
    OutputCheckService,
    ModerationService,
    MemoryExtractionService,
    SkillRegistry,
    AiConfigService,
    { provide: SKILL_DEFINITIONS, useValue: ALL_SKILLS },
    { provide: TopicGuard, useClass: KeywordTopicGuard },
    { provide: MemoryService, useClass: Mem0MemoryService },
    {
      provide: LiteLLMClient,
      inject: [ConfigService, AiConfigService],
      useFactory: (config: ConfigService, aiConfig: AiConfigService) =>
        new LiteLLMClient(
          config.get<string>('LITELLM_URL') ?? 'http://litellm:4000',
          config.get<string>('LITELLM_API_KEY'),
          config.get<string>('LITELLM_MODEL_ALIAS') ?? 'coach-primary',
          config.get<number>('LITELLM_TIMEOUT_MS', 60000),
          aiConfig,
        ),
    },
  ],
})
export class AiModule {}
