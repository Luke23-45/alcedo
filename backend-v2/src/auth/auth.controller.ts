import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /** Google-only login. Public — this is how tokens are obtained. */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  signInWithGoogle(@Body() dto: GoogleLoginDto) {
    return this.authService.signInWithGoogle(dto);
  }

  /** Rotating refresh. Public — presents the refresh token as the credential. */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.rotate(dto);
  }

  /**
   * Revokes the presented refresh token. Always 200 — unknown tokens are a
   * silent no-op so logout can't be used to probe token validity.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Body() dto: RefreshDto) {
    await this.authService.logout(dto);
    return { ok: true };
  }

  /**
   * Own profile: identity, premium entitlement, and admin flag.
   * The website and the mobile app both read this to sync premium state —
   * the entitlement is keyed by Google sub, so a website purchase unlocks
   * the app automatically.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUserSub() googleSub: string) {
    const user = await this.usersService.getProfile(googleSub);
    return {
      googleSub: user.googleSub,
      email: user.email ?? null,
      name: user.name ?? null,
      picture: user.picture ?? null,
      isAdmin: user.isAdmin,
      premium: {
        status: user.premium.status,
        source: user.premium.source ?? null,
        expiresAt: user.premium.expiresAt ? new Date(user.premium.expiresAt).toISOString() : null,
      },
    };
  }
}
