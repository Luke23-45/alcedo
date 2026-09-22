import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @MaxLength(120)
  @IsOptional()
  title?: string;
}
