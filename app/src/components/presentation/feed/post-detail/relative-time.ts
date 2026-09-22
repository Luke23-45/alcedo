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

/** The author subline's spelled-out form, e.g. "@luke · 21 minutes ago". */
export function relativeAgeLong(fromMs: number, nowMs: number = Date.now()): string {
  const diffSeconds = Math.max(0, Math.floor((nowMs - fromMs) / 1000));
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}
