import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { GoogleIdPayload, GoogleTokenVerifier } from './google-token-verifier.interface';

const GOOGLE_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];
/**
 * Upper bound for a Google verification round-trip. Without this, a slow or
 * unreachable Google cert endpoint would hang the login request (and the
 * caller's connection) indefinitely instead of failing the login fast.
 */
const VERIFY_TIMEOUT_MS = 10_000;

/** Production verifier backed by google-auth-library. */
@Injectable()
export class GoogleAuthLibraryVerifier extends GoogleTokenVerifier {
  private readonly logger = new Logger(GoogleAuthLibraryVerifier.name);
  private readonly client: OAuth2Client;
  private readonly audiences: string[];

  constructor(config: ConfigService) {
    super();
    this.client = new OAuth2Client();
    const extra = (config.get<string>('GOOGLE_EXTRA_AUDIENCES') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    this.audiences = [config.getOrThrow<string>('GOOGLE_CLIENT_ID'), ...extra];
  }

  async verify(idToken: string): Promise<GoogleIdPayload> {
    let payload: TokenPayload | undefined;
    try {
      // Verifies the signature, expiry, and that `aud` is one of our audiences.
      // Bounded by VERIFY_TIMEOUT_MS so a stalled Google never stalls login.
      payload = (await this.verifyWithTimeout(idToken)).getPayload();
    } catch {
      throw new UnauthorizedException({
        code: 'AUTH_GOOGLE_VERIFY_FAILED',
        message: 'Google ID token verification failed.',
      });
    }
    if (!payload?.sub) {
      throw new UnauthorizedException({
        code: 'AUTH_GOOGLE_VERIFY_FAILED',
        message: 'Google ID token has no subject.',
      });
    }
    if (!payload.iss || !GOOGLE_ISSUERS.includes(payload.iss)) {
      throw new UnauthorizedException({
        code: 'AUTH_GOOGLE_ISSUER_INVALID',
        message: 'Google ID token has an unexpected issuer.',
      });
    }
    // Sanity check for tokens minted for a different client (e.g. Android vs web):
    // the authorized party must be one of our own client IDs.
    if (payload.azp && !this.audiences.includes(payload.azp)) {
      throw new UnauthorizedException({
        code: 'AUTH_GOOGLE_AUDIENCE_MISMATCH',
        message: 'Google ID token was authorized for an unexpected party.',
      });
    }
    if (payload.email_verified === false) {
      // Not a reason to reject: identity is keyed by `sub`, never by email.
      this.logger.warn(`Google ID token for sub ${payload.sub} has an unverified email.`);
    }
    // Identity is keyed ONLY by `sub` — email is metadata, never identity.
    return {
      email: payload.email,
      emailVerified: payload.email_verified === true,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
    };
  }

  private verifyWithTimeout(idToken: string) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Google token verification timed out')), VERIFY_TIMEOUT_MS);
    });
    const attempt = this.client.verifyIdToken({ audience: this.audiences, idToken });
    // The in-flight Google request is left to settle on its own after a
    // timeout; its rejection is swallowed so it never becomes unhandled.
    attempt.catch(() => undefined);
    return Promise.race([attempt, timeout]).finally(() => clearTimeout(timer));
  }
}
