import type { TranslationKey } from '@tolgee/react';
import { useTranslate } from '@tolgee/react';

/**
 * t() for the History Screen 1 keys proposed in /tmp/i18n_history_s1.json.
 * Those keys are deliberately not in en.json yet, so they sit outside the
 * generated TranslationKey union and are cast in — the same pattern
 * blueprint-diff uses for computed keys. Once the keys land in en.json,
 * call sites can switch back to useTranslate() directly and this goes away.
 */
export function useHistoryTranslate(): (key: string, params?: Record<string, string>) => string {
  const { t } = useTranslate();
  return (key, params) => t(key as TranslationKey, params);
}
