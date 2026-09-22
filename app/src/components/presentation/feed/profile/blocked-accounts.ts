/**
 * Normalizes a raw blocked-username entry: trims, strips leading @, removes
 * all inner whitespace, lowercases. An empty result means "nothing to block".
 */
export function cleanBlockedUsername(raw: string): string {
  return raw.trim().replace(/^@+/, '').replace(/\s+/g, '').toLowerCase();
}
