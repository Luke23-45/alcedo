import { randomBytes, randomUUID } from 'crypto';

export function newId(): string {
  return randomUUID();
}

/** URL-safe random secret for refresh tokens. */
export function newSecret(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}
