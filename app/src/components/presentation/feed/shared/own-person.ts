import { PEOPLE, type FeedPerson } from './people';

/**
 * The user's own feed identity, derived from real data only.
 *
 * The reference contract's "Alex Rivera / @alexr" is the *sample* graph's
 * own-user. The real user's display name lives on the feed identity (set in
 * the profile editor) and the handle in `settings.profileUsername`. Own
 * posts (timeline card, composer preview, post detail) resolve through here,
 * so the name the user actually set is the name their posts carry — never
 * the contract fiction.
 */

export interface OwnIdentitySource {
  /** Display name from the feed identity, when the user set one. */
  name?: string;
  /** Local username, without the @. */
  username?: string;
}

/**
 * Avatar initial for the own user: first alphanumeric of the display name,
 * else of the username, else a neutral dot. Never invents a letter that
 * isn't the user's own.
 */
export function ownPersonInitial(name: string | undefined, username: string | undefined): string {
  const source = (name ?? '').trim() || (username ?? '').trim().replace(/^@+/, '');
  const first = source.charAt(0);
  return /[\p{L}\p{N}]/u.test(first) ? first.toLocaleUpperCase() : '•';
}

/**
 * Builds the own-user FeedPerson from the real identity sources. Visual
 * identity (gradient, colour) stays the contract's violet "you" treatment;
 * every text field is the user's own data.
 */
export function buildOwnPerson({ name, username }: OwnIdentitySource): FeedPerson {
  const cleanName = (name ?? '').trim();
  const cleanUsername = (username ?? '').trim().replace(/^@+/, '');
  return {
    ...PEOPLE.alex!,
    name: cleanName || cleanUsername,
    handle: cleanUsername ? `@${cleanUsername}` : '',
    initial: ownPersonInitial(cleanName, cleanUsername),
  };
}

/**
 * Display name the feed identity should carry for a draft: trimmed, or
 * `undefined` when the user cleared the field (clears it remotely too).
 */
export function normalizeIdentityName(draftName: string): string | undefined {
  return draftName.trim() || undefined;
}

/** True when the draft display name differs from the stored identity name. */
export function identityNameChanged(draftName: string, identityName: string): boolean {
  return draftName.trim() !== identityName.trim();
}
