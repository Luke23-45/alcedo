import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user-repository.interface';

/**
 * Admin guard. The global JwtAuthGuard already verified the access token and
 * attached `{ googleSub }` to the request; this checks the `isAdmin` flag on
 * the user record. Admin is bootstrapped from ADMIN_EMAILS on login
 * (verified emails only).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly users: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ user?: { googleSub?: string } }>();
    const googleSub = req.user?.googleSub;
    if (!googleSub) {
      throw new ForbiddenException({ code: 'ADMIN_UNAUTHORIZED', message: 'Not signed in.' });
    }
    if (!(await this.users.isAdmin(googleSub))) {
      throw new ForbiddenException({ code: 'ADMIN_FORBIDDEN', message: 'Admin access required.' });
    }
    return true;
  }
}
