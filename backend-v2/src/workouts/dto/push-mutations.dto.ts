import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsObject,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class SyncMutationDto {
  /** Client-generated id for correlating the per-item result. */
  @IsUUID()
  clientId!: string;

  /** Currently only 'workout' is supported; others get status 'unsupported'. */
  @IsString()
  entityType!: string;

  /** The entity's stable id (workout UUID). */
  @IsUUID()
  entityId!: string;

  /** Version the client based this mutation on; 0 = create. */
  @IsInt()
  @Min(0)
  baseVersion!: number;

  @IsObject()
  data!: Record<string, unknown>;

  /** Dedupe key: retrying with the same key never applies twice. */
  @IsUUID()
  idempotencyKey!: string;
}

export class PushMutationsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => SyncMutationDto)
  mutations!: SyncMutationDto[];
}
