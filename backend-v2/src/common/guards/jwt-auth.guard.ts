import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

export interface AuthenticatedUser {
  googleSub: string;
}

declare module 'express' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

/**
 * Exact public paths (global prefix included). Webhook routes verify their own
 * signatures and are matched by prefix. Everything else needs a valid access JWT.
 *
 * `/api/features` is probed by the mobile app before it can authenticate, and
 * `/api/billing/plans` is read by the unauthenticated website pricing page —
 * both are intentionally public and carry no user data.
 */
const PUBLIC_EXACT_PATHS = new Set([
  '/api/healthz',
  '/api/auth/google',
  '/api/auth/refresh',
  '/api/features',
  '/api/billing/plans',
]);
const PUBLIC_PATH_PREFIXES = ['/api/webhooks/'];

/**
 * Verifies the backend-issued access JWT (JWT_ACCESS_SECRET via JwtService)
 * and attaches { googleSub } to the request. Public routes (auth, webhooks,
 * health) are skipped so individual controllers stay clean — apply
 * @UseGuards(JwtAuthGuard) where needed or rely on the global skip list here.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (
      PUBLIC_EXACT_PATHS.has(request.path) ||
      PUBLIC_PATH_PREFIXES.some((prefix) => request.path.startsWith(prefix))
    ) {
      return true;
    }

    const token = this.extractBearer(request);
    if (!token) {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_MISSING',
        message: 'Missing access token.',
      });
    }

    let payload: { sub?: string; googleSub?: string; type?: string };
    try {
      payload = await this.jwtService.verifyAsync<{
        sub?: string;
        googleSub?: string;
        type?: string;
      }>(token);
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_EXPIRED',
          message: 'Access token has expired.',
        });
      }
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Invalid access token.',
      });
    }
    const googleSub = payload.googleSub ?? payload.sub;
    if (!googleSub || payload.type !== 'access') {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Malformed access token.',
      });
    }

    const user = await this.usersService.findByGoogleSub(googleSub);
    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Account no longer exists.',
      });
    }

    request.user = { googleSub };
    return true;
  }

  private extractBearer(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header) return undefined;
    const [scheme, token] = header.split(' ');
    return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
  }
}
