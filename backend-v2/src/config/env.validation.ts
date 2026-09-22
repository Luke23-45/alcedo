import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  return false;
}

/**
 * Every environment variable the backend reads. Validation runs once at
 * startup via ConfigModule; a missing/typo'd required variable fails fast
 * instead of surfacing as a mysterious 500 later.
 */
export class EnvironmentVariables {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 3000))
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  MONGODB_URI!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID!: string;

  /** Extra audiences accepted for the Google ID token (Android/iOS client IDs). */
  @IsString()
  @IsOptional()
  GOOGLE_EXTRA_AUDIENCES?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string;

  @IsInt()
  @Min(60)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 900))
  JWT_ACCESS_TTL_SECONDS = 900;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 30))
  JWT_REFRESH_TTL_DAYS = 30;

  @IsString()
  @IsNotEmpty()
  @MinLength(16)
  REVENUECAT_WEBHOOK_SECRET!: string;

  /** Entitlement identifier in RevenueCat that maps to premium. */
  @IsString()
  @IsOptional()
  REVENUECAT_PREMIUM_ENTITLEMENT = 'premium';

  @IsString()
  @IsNotEmpty()
  @MinLength(16)
  WEB_CHECKOUT_SECRET!: string;

  /** Stripe secret key. When unset, Stripe checkout/portal/webhooks are disabled. */
  @IsString()
  @IsOptional()
  STRIPE_SECRET_KEY?: string;

  /** Stripe webhook signing secret for POST /webhooks/stripe. */
  @IsString()
  @IsOptional()
  STRIPE_WEBHOOK_SECRET?: string;

  /** Stripe price ID for the Pro monthly plan. */
  @IsString()
  @IsOptional()
  STRIPE_PRICE_MONTHLY?: string;

  /** Stripe price ID for the Pro yearly plan. */
  @IsString()
  @IsOptional()
  STRIPE_PRICE_YEARLY?: string;

  /** Comma-separated emails granted admin on login (bootstrap). */
  @IsString()
  @IsOptional()
  ADMIN_EMAILS?: string;

  /**
   * 64-char hex (32 bytes) key for AES-256-GCM encryption of admin-stored
   * secrets. Required only when secret config values are written.
   */
  @IsString()
  @IsOptional()
  CONFIG_ENCRYPTION_KEY?: string;

  /** Public website URL, used for Stripe checkout return URLs. */
  @IsString()
  @IsOptional()
  FRONTEND_URL = 'http://localhost:3000';

  @IsString()
  @IsOptional()
  LITELLM_URL = 'http://litellm:4000';

  @IsString()
  @IsOptional()
  LITELLM_API_KEY?: string;

  /** Stable model alias configured in litellm.yaml — never a user-facing picker. */
  @IsString()
  @IsOptional()
  LITELLM_MODEL_ALIAS = 'coach-primary';

  /** Upper bound for a single LiteLLM request (proxy + provider round trip). */
  @IsInt()
  @Min(1000)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 60000))
  LITELLM_TIMEOUT_MS = 60000;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 20))
  AI_FREE_DAILY_QUOTA = 20;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 200))
  AI_PREMIUM_DAILY_QUOTA = 200;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  MODERATION_ENABLED = false;

  /** Restrict AI streaming endpoints to premium users (non-streaming stays quota-gated). */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  AI_STREAM_PREMIUM_ONLY = false;

  @IsString()
  @IsOptional()
  MEM0_API_KEY?: string;

  /** Base URL of the Mem0 long-term memory service. */
  @IsString()
  @IsOptional()
  MEM0_URL = 'https://api.mem0.ai/v1';

  /** Upper bound for a single Mem0 API call. */
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 10000))
  MEM0_TIMEOUT_MS = 10000;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 120))
  THROTTLE_LIMIT = 120;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 60))
  THROTTLE_TTL_SECONDS = 60;

  /** Soft-deleted (tombstoned) records are hard-purged after this many days. */
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 90))
  TOMBSTONE_RETENTION_DAYS = 90;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    const details = errors
      .map((e) => `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`)
      .join('; ');
    throw new Error(`Environment validation failed: ${details}`);
  }
  return validated;
}
