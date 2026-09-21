import { OffsetDateTime } from '@js-joda/core';
import { useAppSelector } from '@/store';
import { useCallback } from 'react';

/**
 * Locale-cached time-of-day formatter ("9:41 AM"), mirroring useFormatDate's
 * caching: `toLocaleString` builds a whole ICU formatter per call, so one
 * formatter per locale is reused forever. Honors Preferences → "24-Hour Time":
 * off means every clock shows AM/PM; on means 13:04-style 24-hour times.
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(locale: string | undefined, use24HourTime: boolean): Intl.DateTimeFormat {
  const key = `${locale ?? 'default'}|${use24HourTime ? '24' : '12'}`;
  const existing = formatters.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24HourTime,
  });
  formatters.set(key, formatter);
  return formatter;
}

export function useFormatTimeOfDay(): (time: OffsetDateTime) => string {
  const locale = useAppSelector((x) => x.settings.preferredLanguage);
  const use24HourTime = useAppSelector((x) => x.settings.use24HourTime);
  return useCallback(
    (time) => formatterFor(locale, use24HourTime).format(new Date(2020, 0, 1, time.hour(), time.minute())),
    [locale, use24HourTime],
  );
}
