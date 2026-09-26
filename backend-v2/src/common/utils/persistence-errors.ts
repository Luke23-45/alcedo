/**
 * Provider-neutral persistence error helpers. Both the MongoDB and
 * PostgreSQL repositories use these so error detection cannot drift between
 * backends.
 */

/**
 * True for unique-index violations on either backend: MongoDB's 11000 and
 * Prisma's P2002. Callers turn these into idempotency outcomes (duplicate
 * claims, sync conflicts) instead of 500s.
 */
export function isDuplicateKeyError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as { code?: unknown }).code;
  return code === 11000 || code === 'P2002';
}
