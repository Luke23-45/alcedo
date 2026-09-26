import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import type { UserRepository } from '../users/repositories/user-repository.interface';

function mockUsersRepository(isAdmin: boolean): UserRepository {
  return { isAdmin: () => Promise.resolve(isAdmin) } as unknown as UserRepository;
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
    const guard = new AdminGuard(mockUsersRepository(true));
    await expect(guard.canActivate(mockContext('sub-1'))).resolves.toBe(true);
  });

  it('forbids a non-admin user', async () => {
    const guard = new AdminGuard(mockUsersRepository(false));
    await expect(guard.canActivate(mockContext('sub-1'))).rejects.toThrow(ForbiddenException);
  });

  it('forbids when the user record does not exist (isAdmin=false)', async () => {
    const guard = new AdminGuard(mockUsersRepository(false));
    await expect(guard.canActivate(mockContext('sub-1'))).rejects.toThrow(ForbiddenException);
  });

  it('forbids when there is no authenticated subject', async () => {
    const guard = new AdminGuard(mockUsersRepository(true));
    await expect(guard.canActivate(mockContext(undefined))).rejects.toThrow(ForbiddenException);
  });
});
