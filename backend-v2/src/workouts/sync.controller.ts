import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { PushMutationsDto } from './dto/push-mutations.dto';
import { SyncService } from './sync.service';

class PullQuery {
  @IsString()
  @IsOptional()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;
}

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * Pushes offline mutations. Safe to retry: every mutation carries a
   * client-generated id and an idempotency key, and stale baseVersions
   * return a per-item `conflict` instead of overwriting. The batch always
   * answers 200; check `conflicts` and each item's `status`.
   */
  @Post('push')
  @HttpCode(HttpStatus.OK)
  push(@CurrentUserSub() googleSub: string, @Body() dto: PushMutationsDto) {
    return this.syncService.push(googleSub, dto);
  }

  /** Pulls server changes (and tombstones) since the opaque cursor. */
  @Get('pull')
  pull(@CurrentUserSub() googleSub: string, @Query() query: PullQuery) {
    return this.syncService.pull(googleSub, query.cursor, query.limit);
  }
}
