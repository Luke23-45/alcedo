import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  /** Google ID token minted by the native app (Credential Manager / Sign in with Google). */
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
