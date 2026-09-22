import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthLibraryVerifier } from './google-auth-library.verifier';

jest.mock('google-auth-library', () => ({ OAuth2Client: jest.fn() }));

const MockedOAuth2Client = OAuth2Client as unknown as jest.Mock;

function makeVerifier(extraAudiences = '') {
  const verifyIdToken = jest.fn();
  MockedOAuth2Client.mockImplementation(() => ({ verifyIdToken }));
  const config = {
    get: jest.fn((key: string) => (key === 'GOOGLE_EXTRA_AUDIENCES' ? extraAudiences : undefined)),
    getOrThrow: jest.fn(() => 'web-client-id'),
  } as unknown as ConfigService;
  return { verifier: new GoogleAuthLibraryVerifier(config), verifyIdToken };
}

function payload(overrides: Record<string, unknown> = {}) {
  return {
    aud: 'web-client-id',
    email: 'alex@example.com',
    email_verified: true,
    iss: 'https://accounts.google.com',
    name: 'Alex',
    picture: 'https://example.com/pic.png',
    sub: 'google-sub-123',
    ...overrides,
  };
}

async function errorCode(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
  } catch (err) {
    expect(err).toBeInstanceOf(UnauthorizedException);
    return ((err as UnauthorizedException).getResponse() as { code: string }).code;
  }
  throw new Error('expected the promise to reject');
}

describe('GoogleAuthLibraryVerifier', () => {
  beforeEach(() => {
    MockedOAuth2Client.mockReset();
  });

  it('returns the payload keyed by sub on a valid token', async () => {
    const { verifier, verifyIdToken } = makeVerifier();
    verifyIdToken.mockResolvedValue({ getPayload: () => payload() });

    const result = await verifier.verify('id-token');

    expect(verifyIdToken).toHaveBeenCalledWith({
      audience: ['web-client-id'],
      idToken: 'id-token',
    });
    expect(result.sub).toBe('google-sub-123');
    expect(result.email).toBe('alex@example.com');
    expect(result.emailVerified).toBe(true);
  });

  it('accepts the bare accounts.google.com issuer form', async () => {
    const { verifier, verifyIdToken } = makeVerifier();
    verifyIdToken.mockResolvedValue({ getPayload: () => payload({ iss: 'accounts.google.com' }) });

    await expect(verifier.verify('id-token')).resolves.toMatchObject({ sub: 'google-sub-123' });
  });

  it('rejects an unexpected issuer', async () => {
    const { verifier, verifyIdToken } = makeVerifier();
    verifyIdToken.mockResolvedValue({ getPayload: () => payload({ iss: 'https://evil.example.com' }) });

    await expect(errorCode(verifier.verify('id-token'))).resolves.toBe('AUTH_GOOGLE_ISSUER_INVALID');
  });

  it('rejects a token whose azp is not one of our client IDs', async () => {
    const { verifier, verifyIdToken } = makeVerifier();
    verifyIdToken.mockResolvedValue({ getPayload: () => payload({ azp: 'someone-elses-client' }) });

    await expect(errorCode(verifier.verify('id-token'))).resolves.toBe(
      'AUTH_GOOGLE_AUDIENCE_MISMATCH',
    );
  });

  it('accepts azp when it matches an extra configured audience', async () => {
    const { verifier, verifyIdToken } = makeVerifier('android-client-id');
    verifyIdToken.mockResolvedValue({ getPayload: () => payload({ azp: 'android-client-id' }) });

    await expect(verifier.verify('id-token')).resolves.toMatchObject({ sub: 'google-sub-123' });
  });

  it('maps a library verification failure (e.g. wrong audience) to a coded error', async () => {
    const { verifier, verifyIdToken } = makeVerifier();
    verifyIdToken.mockRejectedValue(new Error('Wrong audience'));

    await expect(errorCode(verifier.verify('id-token'))).resolves.toBe('AUTH_GOOGLE_VERIFY_FAILED');
  });

  it('still allows a token with an unverified email (identity is keyed by sub, not email)', async () => {
    const { verifier, verifyIdToken } = makeVerifier();
    verifyIdToken.mockResolvedValue({ getPayload: () => payload({ email_verified: false }) });

    await expect(verifier.verify('id-token')).resolves.toMatchObject({
      email: 'alex@example.com',
      emailVerified: false,
      sub: 'google-sub-123',
    });
  });

  it('fails fast instead of hanging the login when Google never responds', async () => {
    jest.useFakeTimers();
    try {
      const { verifier, verifyIdToken } = makeVerifier();
      verifyIdToken.mockReturnValue(new Promise(() => {})); // never settles
      const pending = errorCode(verifier.verify('id-token'));
      await jest.advanceTimersByTimeAsync(10_000);
      await expect(pending).resolves.toBe('AUTH_GOOGLE_VERIFY_FAILED');
      expect(verifyIdToken).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
});
