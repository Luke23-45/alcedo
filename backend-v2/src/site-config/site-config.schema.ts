import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Admin-editable backend configuration. Keys are dot-namespaced:
 *
 * - `ai.systemInstructions` — override for the coach system prompt
 * - `ai.skills.<name>` — override for a skill's instructions
 * - `ai.guardrails` — override for guardrail config
 * - `ai.model` — model alias override
 * - `providers.litellm.baseUrl`, `providers.litellm.apiKey` (secret)
 * - `providers.mem0.apiKey` (secret)
 * - `billing.stripe.priceMonthly`, `billing.stripe.priceYearly`
 *
 * Secret values are AES-256-GCM encrypted at rest. The admin API never
 * returns plaintext secrets — only a masked preview.
 */
@Schema({ timestamps: true })
export class SiteConfig {
  @Prop({ required: true, unique: true, index: true })
  key!: string;

  /** Plaintext value, or the encrypted envelope for secrets. */
  @Prop({ required: true })
  value!: string;

  @Prop({ default: false })
  secret!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export type SiteConfigDocument = HydratedDocument<SiteConfig>;
export const SiteConfigSchema = SchemaFactory.createForClass(SiteConfig);
