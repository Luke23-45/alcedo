import { Injectable } from '@nestjs/common';
import { SiteConfigService } from '../site-config/site-config.service';

/**
 * AI coach configuration with admin overrides.
 * Every getter checks the database override first, then falls back to the
 * provided file default. This lets the admin panel customize the coach
 * without a redeploy.
 */
@Injectable()
export class AiConfigService {
  constructor(private readonly siteConfig: SiteConfigService) {}

  /** System instructions override, or null when not customized. */
  async getSystemInstructions(): Promise<string | null> {
    return this.siteConfig.get('ai.systemInstructions');
  }

  /** Skill instructions override for a skill, or null when not customized. */
  async getSkillInstructions(skillName: string): Promise<string | null> {
    return this.siteConfig.get(`ai.skills.${skillName}`);
  }

  /** Guardrails config override, or null when not customized. */
  async getGuardrails(): Promise<string | null> {
    return this.siteConfig.get('ai.guardrails');
  }

  /** Model alias override, or null when not customized. */
  async getModelAlias(): Promise<string | null> {
    return this.siteConfig.get('ai.model');
  }

  /** LiteLLM base URL override, or null when not customized. */
  async getLiteLlmBaseUrl(): Promise<string | null> {
    return this.siteConfig.get('providers.litellm.baseUrl');
  }

  /** LiteLLM API key override, or null when not customized. */
  async getLiteLlmApiKey(): Promise<string | null> {
    return this.siteConfig.get('providers.litellm.apiKey');
  }

  /** Mem0 API key override, or null when not customized. */
  async getMem0ApiKey(): Promise<string | null> {
    return this.siteConfig.get('providers.mem0.apiKey');
  }

  /** Mem0 base URL override, or null when not customized. */
  async getMem0BaseUrl(): Promise<string | null> {
    return this.siteConfig.get('providers.mem0.baseUrl');
  }
}
