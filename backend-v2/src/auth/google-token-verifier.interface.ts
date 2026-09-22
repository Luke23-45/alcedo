export interface GoogleIdPayload {
  /** Stable Google identity — the only field used to key the user. */
  sub: string;
  email?: string;
  /** True when Google confirms the email is verified. Never trust email otherwise. */
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

/**
 * Verifies a Google ID token (signature, audience, issuer, expiry).
 * Abstract class = NestJS DI token; swap implementations without touching callers.
 */
export abstract class GoogleTokenVerifier {
  abstract verify(idToken: string): Promise<GoogleIdPayload>;
}
