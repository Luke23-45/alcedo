import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GoogleTokenVerifier } from './google-token-verifier.interface';
import { TokenService } from './token.service';
import { UsersService } from '../users/users.service';

describe('AuthService (Google-only)', () => {
  it('keys the account by the Google sub claim, not the email', async () => {
    const verifier = {
      verify: jest.fn().mockResolvedValue({ email: 'alex@example.com', emailVerified: true, sub: 'google-sub-123' }),
    } as unknown as GoogleTokenVerifier;
    const usersService = {
      getOrCreate: jest.fn().mockResolvedValue({ googleSub: 'google-sub-123' }),
    } as unknown as UsersService;
    const tokenService = {
      issueTokenPair: jest
        .fn()
        .mockResolvedValue({ accessToken: 'a', expiresIn: 900, refreshToken: 'r' }),
    } as unknown as TokenService;
    const configService = {
      get: jest.fn().mockReturnValue(''),
    } as unknown as ConfigService;
    const service = new AuthService(verifier, usersService, tokenService, configService);

    const result = await service.signInWithGoogle({ idToken: 'token' });

    expect(verifier.verify).toHaveBeenCalledWith('token');
    // The stable sub is what identifies the user — email is only metadata.
    expect(usersService.getOrCreate).toHaveBeenCalledWith(
      'google-sub-123',
      expect.objectContaining({ email: 'alex@example.com' }),
    );
    expect(tokenService.issueTokenPair).toHaveBeenCalledWith('google-sub-123');
    expect(result).toEqual({ accessToken: 'a', expiresIn: 900, refreshToken: 'r' });
  });

  it('propagates verifier failures instead of minting tokens', async () => {
    const verifier = {
      verify: jest.fn().mockRejectedValue(new Error('bad token')),
    } as unknown as GoogleTokenVerifier;
    const usersService = { getOrCreate: jest.fn() } as unknown as UsersService;
    const tokenService = { issueTokenPair: jest.fn() } as unknown as TokenService;
    const configService = {
      get: jest.fn().mockReturnValue(''),
    } as unknown as ConfigService;
    const service = new AuthService(verifier, usersService, tokenService, configService);

    await expect(service.signInWithGoogle({ idToken: 'bogus' })).rejects.toThrow('bad token');
    expect(tokenService.issueTokenPair).not.toHaveBeenCalled();
  });

  function adminHarness(emailVerified: boolean) {
    const verifier = {
      verify: jest.fn().mockResolvedValue({ email: 'boss@example.com', emailVerified, sub: 'google-sub-9' }),
    } as unknown as GoogleTokenVerifier;
    const usersService = {
      getOrCreate: jest.fn().mockResolvedValue({ googleSub: 'google-sub-9' }),
      setAdmin: jest.fn().mockResolvedValue(undefined),
    } as unknown as UsersService;
    const tokenService = {
      issueTokenPair: jest.fn().mockResolvedValue({ accessToken: 'a', expiresIn: 900, refreshToken: 'r' }),
    } as unknown as TokenService;
    const configService = {
      get: jest.fn().mockReturnValue('boss@example.com'),
    } as unknown as ConfigService;
    return { usersService, verifier, service: new AuthService(verifier, usersService, tokenService, configService) };
  }

  it('bootstraps admin for an allowlisted VERIFIED email', async () => {
    const { service, usersService } = adminHarness(true);
    await service.signInWithGoogle({ idToken: 'token' });
    expect(usersService.setAdmin).toHaveBeenCalledWith('google-sub-9', true);
  });

  it('does NOT bootstrap admin for an allowlisted but UNVERIFIED email', async () => {
    const { service, usersService } = adminHarness(false);
    await service.signInWithGoogle({ idToken: 'token' });
    expect(usersService.setAdmin).not.toHaveBeenCalled();
  });
});
