import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FollowUserDto {
  /** Google `sub` of the user to follow. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  userId!: string;
}
