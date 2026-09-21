import { useTranslate } from '@tolgee/react';
import { feedKey } from '../shared/feed-i18n';

/**
 * Timeline-scoped `t`: keys live in app/src/i18n/fragments/feed.timeline.json
 * and are merged into en.json (which drives Tolgee's key union) by the parent
 * after parallel work lands. `feedKey` keeps typecheck green until the merge;
 * `defaultValue` keeps the UI on English fallbacks at runtime until then.
 */
export function useTimelineT() {
  const { t } = useTranslate();
  return (key: string, fallback?: string, params?: Record<string, string | number>) =>
    t(feedKey(key), { ...params, defaultValue: fallback ?? key });
}
