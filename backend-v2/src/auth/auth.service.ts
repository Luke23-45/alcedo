import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginDto } from './dto/google-login.dto';
import { GoogleTokenVerifier } from './google-token-verifier.interface';
import { TokenPair, TokenService } from './token.service';
import { UsersService } from '../users/users.service';

export interface AuthResult extends TokenPair {}

@Injectable()
export class AuthService {
  constructor(
    private readonly verifier: GoogleTokenVerifier,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Google-only sign-in. The native app collects the Google ID token;
   * the backend verifies it and keys the account by Google's `sub`.
   * Admin is bootstrapped from ADMIN_EMAILS on every login.
   */
  async signInWithGoogle(dto: GoogleLoginDto): Promise<AuthResult> {
    const payload = await this.verifier.verify(dto.idToken);
    const user = await this.usersService.getOrCreate(payload.sub, {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
    await this.bootstrapAdmin(user.googleSub, payload.email, payload.emailVerified);
    const pair = await this.tokenService.issueTokenPair(user.googleSub);
    return { ...pair };
  }

  rotate(dto: { refreshToken: string }): Promise<TokenPair> {
    return this.tokenService.refresh(dto.refreshToken);
  }

  logout(dto: { refreshToken: string }): Promise<void> {
    return this.tokenService.revoke(dto.refreshToken);
  }

  /**
   * Grants admin to emails listed in ADMIN_EMAILS. Idempotent.
   * Requires a Google-verified email — an unverified email claim must never
   * mint an administrator.
   */
  private async bootstrapAdmin(
    googleSub: string,
    email: string | undefined,
    emailVerified: boolean,
  ): Promise<void> {
    if (!email || !emailVerified) return;
    const adminEmails = (this.config.get<string>('ADMIN_EMAILS') ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminEmails.includes(email.toLowerCase())) {
      await this.usersService.setAdmin(googleSub, true);
    }
  }
}
