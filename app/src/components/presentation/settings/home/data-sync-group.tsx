import { useCanExportHealth } from '@/components/smart/health-export-switch';
import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { lastBackupLabel } from '../shared/backup-status';

/**
 * DATA & SYNC group (settings-dark.md Screen 1).
 *
 * Honest state mapping:
 * - Apple Health: the real platform support + the real export toggle.
 *   "Connected" only when the platform supports export and the switch is on.
 * - Apple Watch: no watch integration ships. The row is a static,
 *   honestly-unavailable status row — no fake model, no fake sync claim, and
 *   no navigation affordance.
 * - Backup: the real last-backup time. The storage row shows destination
 *   categories only; no byte accounting exists, so no size is claimed.
 */
export function DataSyncGroup() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const lastBackup = useAppSelector((s) => s.settings.lastBackup);
  const preferredLanguage = useAppSelector((s) => s.settings.preferredLanguage);
  const use24HourTime = useAppSelector((s) => s.settings.use24HourTime);

  const canExportHealth = useCanExportHealth();
  const exportToHealth = useAppSelector((s) => s.settings.exportToHealthAggregator);
  const healthConnected = canExportHealth && exportToHealth;
  const healthValue = !canExportHealth
    ? t(settingsKey('settings.home.health.unavailable'))
    : exportToHealth
      ? t(settingsKey('settings.home.health.value'))
      : t(settingsKey('settings.home.health.value_off'));

  const backupTime = lastBackupLabel(
    lastBackup,
    {
      today: t(settingsKey('settings.backup.day.today')),
      yesterday: t(settingsKey('settings.backup.day.yesterday')),
    },
    preferredLanguage ?? undefined,
    use24HourTime,
  );

  return (
    <SettingsGroup label={t(settingsKey('settings.home.section.data_sync'))}>
      <SettingsRow
        icon="heartCheck"
        wellHue="#FF2D55"
        iconColor="#FF6A88"
        title={t(settingsKey('settings.home.health.title'))}
        subtitle={t(settingsKey('settings.home.health.subtitle'))}
        value={healthValue}
        valueActive={healthConnected}
        onPress={() => push('/settings/backup-and-restore')}
      />
      <SettingsRow
        icon="watch"
        wellHue="#00D9E9"
        iconColor="#5EDCF0"
        title={t(settingsKey('settings.home.watch.title'))}
        subtitle={t(settingsKey('settings.home.watch.unavailable'))}
        hideChevron
      />
      <SettingsRow
        icon="cloudUpload"
        wellHue="#0A84FF"
        iconColor="#5EB0FF"
        title={t(settingsKey('settings.home.backup.title'))}
        subtitle={
          backupTime
            ? t(settingsKey('settings.home.backup.subtitle'), { time: backupTime })
            : t(settingsKey('settings.home.backup.never'))
        }
        onPress={() => push('/settings/backup-and-restore')}
      />
      <SettingsRow
        icon="storage"
        wellHue="#FF9F0A"
        iconColor="#FFB84D"
        title={t(settingsKey('settings.home.storage.title'))}
        subtitle={t(settingsKey('settings.home.storage.subtitle'))}
        onPress={() => push('/settings/backup-and-restore')}
      />
    </SettingsGroup>
  );
}
