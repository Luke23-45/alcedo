/**
 * Honest byte/duration formatters for backup copy. Both measure real values —
 * the snackbar subtitles and the last-tested card render exactly these strings.
 */

/** "412 MB", "1.4 GB", "96 KB", "512 B" — decimal units, one decimal place. */
export function formatBackupBytes(bytes: number): string {
  if (bytes >= 1e9) {
    return `${(bytes / 1e9).toFixed(1)} GB`;
  }
  if (bytes >= 1e6) {
    return `${(bytes / 1e6).toFixed(1)} MB`;
  }
  if (bytes >= 1e3) {
    return `${(bytes / 1e3).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

/** "2.1s" — the real measured duration of the Test upload. */
export function formatBackupDuration(durationMs: number): string {
  return `${(durationMs / 1000).toFixed(1)}s`;
}
