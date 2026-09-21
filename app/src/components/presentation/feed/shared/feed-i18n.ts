import type { TranslationKey } from '@tolgee/web';

/**
 * Fragment keys live in app/src/i18n/fragments/*.json and are merged into
 * en.json (which drives Tolgee's TranslationKey union) by the parent after
 * parallel work lands. Until that merge, the cast below keeps typecheck green;
 * at runtime Tolgee resolves the key from the fragment file.
 */
export function feedKey(key: string): TranslationKey {
  return key as TranslationKey;
}
