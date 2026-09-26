import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SiteConfigService } from '../site-config/site-config.service';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { UserRepository } from '../users/repositories/user-repository.interface';
import { AdminGuard } from './admin.guard';

/** Allowlist of config keys editable from the admin panel. */
const EDITABLE_KEYS = [
  'ai.systemInstructions',
  'ai.guardrails',
  'ai.model',
  'ai.skills.program-design',
  'ai.skills.progression',
  'ai.skills.form-check',
  'ai.skills.nutrition',
  'ai.skills.recovery',
  'ai.skills.conditioning',
  'providers.litellm.baseUrl',
  'providers.litellm.apiKey',
  'providers.mem0.apiKey',
  'providers.mem0.baseUrl',
  'billing.stripe.priceMonthly',
  'billing.stripe.priceYearly',
  'billing.stripe.webhookSecret',
];

/**
 * `ai.guardrails` must be JSON like `{"extraInScope":["term", ...]}`.
 * Any other key skips this check.
 */
@ValidatorConstraint({ name: 'IsGuardrailsJson', async: false })
class IsGuardrailsJsonConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const body = args.object as { key?: string };
    if (body.key !== 'ai.guardrails') return true;
    if (typeof value !== 'string') return false;
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      return false;
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return false;
    const extra = (parsed as Record<string, unknown>).extraInScope;
    if (extra === undefined) return true;
    return (
      Array.isArray(extra) &&
      extra.length <= 200 &&
      extra.every((t) => typeof t === 'string' && t.trim().length > 0 && t.length <= 64)
    );
  }

  defaultMessage(): string {
    return 'ai.guardrails must be JSON like {"extraInScope":["term"]}.';
  }
}

/**
 * Keys ending in `baseUrl` must be well-formed http(s) URLs — a typo would
 * break the provider integration silently. Any other key skips this check.
 */
@ValidatorConstraint({ name: 'IsBaseUrlWhenKey', async: false })
class IsBaseUrlWhenKeyConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const body = args.object as { key?: string };
    if (typeof body.key !== 'string' || !body.key.endsWith('baseUrl')) return true;
    if (typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'baseUrl values must be valid http(s) URLs.';
  }
}

export class UpdateConfigBody {
  @IsString()
  @IsIn(EDITABLE_KEYS)
  key!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  @Validate(IsBaseUrlWhenKeyConstraint)
  // ai.guardrails feeds the topic guard's extra in-scope terms; it must be
  // JSON of the documented shape so a typo can't widen the guard by accident.
  @Validate(IsGuardrailsJsonConstraint)
  value!: string;
}

class UsersQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class SetAdminBody {
  @IsBoolean()
  isAdmin!: boolean;
}

/**
 * Admin API. Every route requires the AdminGuard (isAdmin flag) after the
 * global JwtAuthGuard. Used by the website admin panel to configure the
 * backend without deploys. All mutations are audit-logged with the actor.
 */
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly siteConfig: SiteConfigService,
    private readonly users: UserRepository,
  ) {}

  /** All editable config entries. Secret values are masked. */
  @Get('config')
  async getConfig() {
    const stored = await this.siteConfig.list();
    const storedKeys = new Set(stored.map((e) => e.key));
    const entries: Array<{ key: string; secret: boolean; updatedAt: string | null; value: string }> =
      stored.map((e) => ({ ...e, updatedAt: e.updatedAt ?? null }));
    for (const key of EDITABLE_KEYS) {
      if (!storedKeys.has(key)) {
        entries.push({ key, secret: key.includes('apiKey') || key.includes('webhookSecret'), updatedAt: null, value: '' });
      }
    }
    entries.sort((a, b) => a.key.localeCompare(b.key));
    return { config: entries };
  }

  /** Updates one config key. */
  @Put('config')
  async updateConfig(@CurrentUserSub() actorSub: string, @Body() body: UpdateConfigBody) {
    await this.siteConfig.set(body.key, body.value);
    this.logger.log(`Admin ${actorSub} set config '${body.key}'.`);
    return { ok: true };
  }

  /** Paginated user list with premium status. */
  @Get('users')
  async listUsers(@Query() query: UsersQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [total, users] = await Promise.all([
      this.users.count(),
      this.users.listRecent(limit, (page - 1) * limit),
    ]);
    return {
      page,
      limit,
      total,
      users: users.map((u) => ({
        googleSub: u.googleSub,
        email: u.email ?? null,
        name: u.name ?? null,
        isAdmin: u.isAdmin,
        premium: {
          status: u.premium.status,
          source: u.premium.source ?? null,
          expiresAt: u.premium.expiresAt ? new Date(u.premium.expiresAt).toISOString() : null,
        },
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      })),
    };
  }

  /**
   * Grants or revokes admin on a user. 404 when the user doesn't exist;
   * 409 when revoking the last remaining admin (that would lock everyone out).
   */
  @Put('users/:googleSub/admin')
  async setAdmin(
    @CurrentUserSub() actorSub: string,
    @Param('googleSub') googleSub: string,
    @Body() body: SetAdminBody,
  ) {
    const target = await this.users.findByGoogleSub(googleSub);
    if (!target) {
      throw new NotFoundException({ code: 'ADMIN_USER_NOT_FOUND', message: 'User not found.' });
    }
    if (!body.isAdmin && target.isAdmin) {
      const adminCount = await this.users.countAdmins();
      if (adminCount <= 1) {
        throw new ConflictException({
          code: 'ADMIN_LAST_ADMIN',
          message: 'Cannot revoke the last admin.',
        });
      }
    }
    await this.users.setAdmin(googleSub, body.isAdmin);
    this.logger.log(
      `Admin ${actorSub} set isAdmin=${body.isAdmin} for user ${googleSub}.`,
    );
    return { ok: true };
  }
}
