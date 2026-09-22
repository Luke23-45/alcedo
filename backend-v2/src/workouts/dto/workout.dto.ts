import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

function trim(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class WorkoutSetDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  reps?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  unit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rpe?: number;
}

export class WorkoutExerciseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  exerciseId!: string;

  @IsArray()
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => WorkoutSetDto)
  sets!: WorkoutSetDto[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class CreateWorkoutDto {
  /**
   * Client-generated UUID. When omitted the server mints one — prefer sending
   * your own so the workout keeps one identity across sync and CRUD.
   */
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsString()
  @Length(1, 120)
  @Transform(({ value }) => trim(value))
  name!: string;

  @IsISO8601()
  date!: string;

  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises!: WorkoutExerciseDto[];
}

export class UpdateWorkoutDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  @Transform(({ value }) => trim(value))
  name?: string;

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];
}

export class ListWorkoutsQuery {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  /** Tombstones are excluded unless this is explicitly true. */
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeDeleted?: boolean;
}
