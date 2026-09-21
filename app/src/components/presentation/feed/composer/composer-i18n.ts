import { useTranslate } from '@tolgee/react';
import { feedKey } from '../shared/feed-i18n';

/**
 * t() for the Share Composer keys in i18n/fragments/feed.composer.json.
 * Same pattern as history-i18n: keys are cast into TranslationKey until the
 * parent merges the fragment into en.json. A `defaultValue` is supplied at
 * every call site so the UI stays intact before that merge lands.
 */
export function useComposerT(): (key: string, fallback: string, params?: Record<string, string | number>) => string {
  const { t } = useTranslate();
  return (key, fallback, params) => t(feedKey(key), { defaultValue: fallback, ...params });
}
