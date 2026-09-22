import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  text!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsUrl({ protocols: ['https'], require_protocol: true }, { each: true })
  mediaUrls?: string[];
}
