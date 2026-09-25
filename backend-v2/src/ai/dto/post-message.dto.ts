import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class PostMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content!: string;

  /**
   * The client's AI plan contract version (the app's aiPlanMigrations.latestVersion).
   * When behind the server's version the client cannot render the plans this
   * server produces, so the turn is rejected with an updateRequired signal
   * instead of running.
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  clientAiPlanVersion?: number;
}
