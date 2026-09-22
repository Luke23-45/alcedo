import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/** Resolves the authenticated user's stable Google `sub` (never the email). */
export const CurrentUserSub = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const sub = request.user?.googleSub;
    if (!sub) throw new UnauthorizedException('Not authenticated.');
    return sub;
  },
);
