export interface ProfileHeaderData {
  /**
   * Display line: the real feed-identity name, else @username when the name
   * is empty, else empty. No fictional fallback — an unset identity renders
   * nothing rather than a made-up name.
   */
  title: string;
  /** `@username` line; empty when no real username is set. */
  handle: string;
}

/**
 * Pure derivation behind the settings home profile header
 * (settings-dark.md Screen 1). Usernames are trimmed and stripped of
 * stray leading `@`s before display so "@" never renders on its own.
 */
export function deriveProfileHeaderData(
  identityName: string | undefined,
  username: string | undefined,
): ProfileHeaderData {
  const cleanUsername = (username ?? '').trim().replace(/^@+/, '');
  const title = (identityName ?? '').trim() || (cleanUsername ? `@${cleanUsername}` : '');
  const handle = cleanUsername ? `@${cleanUsername}` : '';
  return { title, handle };
}
