import { RemoteData } from '@/models/remote';
import { LastBackup } from '@/store/settings/registry';
import { LocalDate, ZoneId } from '@js-joda/core';

export interface DayLabels {
  today: string;
  yesterday: string;
  /** Shown when a backup succeeded but its timestamp was never recorded. */
  unknownTime: string;
}

/** Clock honoring Preferences → "24-Hour Time" (off: every clock shows AM/PM). */
function formatTimeOfDay(millis: number, locale: string | undefined, use24HourTime: boolean): string {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24HourTime,
  }).format(new Date(millis));
}

function formatDate(millis: number, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(millis));
}

/**
 * Human "Last backup" label from the real `lastBackup` RemoteData:
 * "Today, 6:12 AM", "Yesterday, 6:12 AM", or "Jun 8, 6:12 AM".
 * Returns the honest "time unknown" label when a backup succeeded but its
 * timestamp was never recorded, and null when no backup has ever succeeded.
 */
export function lastBackupLabel(
  lastBackup: RemoteData<LastBackup, string>,
  labels: DayLabels,
  locale: string | undefined,
  use24HourTime = false,
): string | null {
  return lastBackup.match({
    success: (data) => {
      if (!data.lastBackupTime) {
        return labels.unknownTime;
      }
      const zoned = data.lastBackupTime.atZone(ZoneId.systemDefault());
      const today = LocalDate.now(ZoneId.systemDefault());
      const date = zoned.toLocalDate();
      const time = formatTimeOfDay(data.lastBackupTime.toEpochMilli(), locale, use24HourTime);
      if (date.equals(today)) {
        return `${labels.today}, ${time}`;
      }
      if (date.equals(today.minusDays(1))) {
        return `${labels.yesterday}, ${time}`;
      }
      return `${formatDate(data.lastBackupTime.toEpochMilli(), locale)}, ${time}`;
    },
    error: () => null,
    loading: () => null,
    notAsked: () => null,
  });
}

/** True when the last remote backup succeeded (drives "Synced" subtitles). */
export function didLastBackupSucceed(lastBackup: RemoteData<LastBackup, string>): boolean {
  return lastBackup.match({
    success: () => true,
    error: () => false,
    loading: () => false,
    notAsked: () => false,
  });
}

/** True while a backup is in flight. */
export function isBackingUp(lastBackup: RemoteData<LastBackup, string>): boolean {
  return lastBackup.match({
    success: () => false,
    error: () => false,
    loading: () => true,
    notAsked: () => false,
  });
}
