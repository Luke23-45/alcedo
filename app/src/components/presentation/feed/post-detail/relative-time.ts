/**
 * Compact relative ages for the detail screen — the contract's fixed forms:
 * "18m", "2h", "1d", falling back to "now" under a minute. Never negative:
 * a future-dated stamp reads as "now".
 */
export function relativeAge(fromMs: number, nowMs: number = Date.now()): string {
  const diffSeconds = Math.max(0, Math.floor((nowMs - fromMs) / 1000));
  if (diffSeconds < 60) {
    return 'now';
  }
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  return `${Math.floor(hours / 24)}d`;
}

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

/** Cached relative-time formatter (undefined = system locale). */
function rtf(locale: string | undefined): Intl.RelativeTimeFormat {
  const key = locale ?? 'system';
  const existing = rtfCache.get(key);
  if (existing) return existing;
  const created = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  rtfCache.set(key, created);
  return created;
}

/**
 * The author subline's spelled-out form, e.g. "@luke · 21 minutes ago" — in
 * the caller's locale ("vor 21 Minuten" in German). The sub-minute case keeps
 * the spec-pinned 'just now' (its spec assertion pins the literal; a 60-second
 * window in any language is not worth churning the contract test).
 */
export function relativeAgeLong(fromMs: number, nowMs: number = Date.now(), locale?: string): string {
  const diffSeconds = Math.max(0, Math.floor((nowMs - fromMs) / 1000));
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return rtf(locale).format(-minutes, 'minute');
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return rtf(locale).format(-hours, 'hour');
  }
  return rtf(locale).format(-Math.floor(hours / 24), 'day');
}
