/**
 * Opaque cursor pagination helpers. Cursors encode a timestamp + tiebreaker id
 * as base64 so clients never build queries against server internals.
 */
export interface PageResult<T> {
  items: T[];
  nextCursor: string | null;
}

export function encodeCursor(isoTimestamp: string, tiebreakerId: string): string {
  return Buffer.from(JSON.stringify({ t: isoTimestamp, id: tiebreakerId }), 'utf8').toString(
    'base64url',
  );
}

export function decodeCursor(cursor: string): { timestamp: Date; tiebreakerId: string } {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as {
      t?: string;
      id?: string;
    };
    if (typeof parsed.t !== 'string' || typeof parsed.id !== 'string') throw new Error('bad cursor');
    return { timestamp: new Date(parsed.t), tiebreakerId: parsed.id };
  } catch {
    throw new Error('Invalid cursor.');
  }
}
