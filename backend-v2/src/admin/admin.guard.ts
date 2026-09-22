import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

/**
 * Admin guard. The global JwtAuthGuard already verified the access token and
 * attached `{ googleSub }` to the request; this checks the `isAdmin` flag on
 * the user document. Admin is bootstrapped from ADMIN_EMAILS on login
 * (verified emails only).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ user?: { googleSub?: string } }>();
    const googleSub = req.user?.googleSub;
    if (!googleSub) {
      throw new ForbiddenException({ code: 'ADMIN_UNAUTHORIZED', message: 'Not signed in.' });
    }
    const user = await this.users.findOne({ googleSub }).select('isAdmin').lean().exec();
    if (!user?.isAdmin) {
      throw new ForbiddenException({ code: 'ADMIN_FORBIDDEN', message: 'Admin access required.' });
    }
    return true;
  }
}
