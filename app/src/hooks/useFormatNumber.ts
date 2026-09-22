import { useCallback } from 'react';
import { useAppSelector } from '@/store';

/**
 * `Number.prototype.toLocaleString` constructs a whole ICU formatter per
 * call, which is far too expensive to do from a render. Formatters are
 * immutable, so one per locale can be reused forever. Mirrors useFormatDate.
 */
const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(locale: string | undefined): Intl.NumberFormat {
  const key = locale ?? 'system';
  const existing = formatters.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.NumberFormat(locale);
  formatters.set(key, formatter);
  return formatter;
}

/**
 * Locale-aware number grouping for user-facing figures ("24,380" in en-US,
 * "24.380" in de-DE), honoring settings.preferredLanguage. Falls back to the
 * system locale when no preference is set.
 */
export function useFormatNumber(): (value: number) => string {
  const locale = useAppSelector((x) => x.settings.preferredLanguage);
  return useCallback((value: number) => formatterFor(locale).format(value), [locale]);
}
