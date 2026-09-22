import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  /** Profile picture. Must be https so the app never loads cleartext images. */
  @IsUrl({ protocols: ['https'], require_protocol: true, require_valid_protocol: true })
  @IsOptional()
  picture?: string;

  @IsIn(['metric', 'imperial'])
  @IsOptional()
  units?: 'metric' | 'imperial';
}
