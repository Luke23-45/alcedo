import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

function mockUsersModel(isAdmin: boolean | null) {
  return {
    findOne: () => ({
      select: () => ({
        lean: () => ({
          exec: () => Promise.resolve(isAdmin === null ? null : { isAdmin }),
        }),
      }),
    }),
  } as never;
}

function mockContext(googleSub?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      // Matches JwtAuthGuard: request.user = { googleSub }.
      getRequest: () => ({ user: googleSub ? { googleSub } : undefined }),
    }),
  } as unknown as ExecutionContext;
}

describe('AdminGuard', () => {
  it('allows a user with isAdmin=true', async () => {
    const guard = new AdminGuard(mockUsersModel(true));
    await expect(guard.canActivate(mockContext('sub-1'))).resolves.toBe(true);
  });

  it('forbids a non-admin user', async () => {
    const guard = new AdminGuard(mockUsersModel(false));
    await expect(guard.canActivate(mockContext('sub-1'))).rejects.toThrow(ForbiddenException);
  });

  it('forbids when the user document does not exist', async () => {
    const guard = new AdminGuard(mockUsersModel(null));
    await expect(guard.canActivate(mockContext('sub-1'))).rejects.toThrow(ForbiddenException);
  });

  it('forbids when there is no authenticated subject', async () => {
    const guard = new AdminGuard(mockUsersModel(true));
    await expect(guard.canActivate(mockContext(undefined))).rejects.toThrow(ForbiddenException);
  });
});
