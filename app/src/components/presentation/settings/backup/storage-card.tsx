import Icon from '@/components/presentation/foundation/icon';
import { useCanExportHealth } from '@/components/smart/health-export-switch';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { selectBackendForFeature } from '@/store/backends';
import { setExportToHealthAggregator } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useState } from 'react';
import { chevronColor } from '../shared/grouped-settings-list.styles';
import { SettingsToggle } from '../shared/grouped-settings-list';
import { didLastBackupSucceed } from '../shared/backup-status';
import { settingsKey } from '../shared/settings-i18n';
import { STORAGE_SEGMENTS } from './storage-segments';
import { ExportFeedDialog } from './backup-dialogs';
import * as S from './storage-card.styles';
import { CardShell } from './card-shell';
import { BackupSeparator } from './backup-card.styles';

function LegendEntry({
  color,
  title,
  sub,
  value,
  trailing,
}: {
  color: string;
  title: string;
  sub: string;
  value?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <S.LegendRow>
      <S.LegendDot $color={color} />
      <S.LegendText>
        <S.LegendTitle>{title}</S.LegendTitle>
        <S.LegendSub>{sub}</S.LegendSub>
      </S.LegendText>
      {value ? <S.LegendValue>{value}</S.LegendValue> : undefined}
      {trailing}
    </S.LegendRow>
  );
}

/**
 * Storage & backends card (settings-dark.md Screen 6): the exact-proportion
 * storage bar, legend with real backup/health status, then the real export
 * rows — plaintext CSV/JSON export, file backup (with the feed-account
 * choice), import from other apps, and the real Apple Health export switch.
 *
 * Honesty: the app has no storage-measurement API, so every size on this
 * card is an estimate, labelled with ≈ per the design law that estimates
 * are labelled as estimates. The remote-backup legend entry uses the real
 * assigned backend's name.
 */
export function StorageCard() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const [feedExportOpen, setFeedExportOpen] = useState(false);

  const backupBackend = useAppSelector((s) => selectBackendForFeature(s, 'backup'));
  const lastBackup = useAppSelector((s) => s.settings.lastBackup);
  const synced = didLastBackupSucceed(lastBackup);

  const canExportHealth = useCanExportHealth();
  const exportToHealth = useAppSelector((s) => s.settings.exportToHealthAggregator);

  const remoteTitle = backupBackend?.backend.name ?? t(settingsKey('settings.backup.legend.remote'));
  const remoteSub = backupBackend
    ? t(settingsKey(synced ? 'settings.backup.legend.primary_synced' : 'settings.backup.legend.primary_not_synced'))
    : t(settingsKey('settings.backup.legend.not_configured'));
  const dot = (i: 0 | 1 | 2) => (theme.isDark ? STORAGE_SEGMENTS[i].dark : STORAGE_SEGMENTS[i].light);

  return (
    <>
      <CardShell>
        <S.StorageHeader>
          <S.StorageTitle>{t(settingsKey('settings.backup.storage_used'))}</S.StorageTitle>
          <S.StorageTotal>{t(settingsKey('settings.backup.storage_total'))}</S.StorageTotal>
        </S.StorageHeader>
        <S.StorageBarTrack
          accessibilityRole="progressbar"
          accessibilityLabel={t(settingsKey('settings.backup.storage_used'))}
        >
          <StorageSegments />
        </S.StorageBarTrack>
        <BackupSeparator style={{ marginTop: 14 }} />
        <LegendEntry
          color={dot(0)}
          title={remoteTitle}
          sub={remoteSub}
          value={t(settingsKey('settings.backup.legend.icloud_value'))}
        />
        <BackupSeparator />
        <LegendEntry
          color={dot(1)}
          title={t(settingsKey('settings.backup.legend.local'))}
          sub={t(settingsKey('settings.backup.legend.local_sub'))}
          value={t(settingsKey('settings.backup.legend.local_value'))}
        />
        <BackupSeparator />
        <LegendEntry
          color={dot(2)}
          title={t(settingsKey('settings.backup.legend.health'))}
          sub={t(settingsKey('settings.backup.legend.health_sub'))}
          value={t(settingsKey('settings.backup.legend.health_value'))}
        />
        <BackupSeparator />
        <S.ExportRow accessibilityRole="button" onPress={() => push('/settings/backup-and-restore/plain-text-export')}>
          <S.ExportRowText>
            <S.ExportRowTitle>{t(settingsKey('settings.backup.export.title'))}</S.ExportRowTitle>
          </S.ExportRowText>
          <S.ExportRowValue>{t(settingsKey('settings.backup.export.subtitle'))}</S.ExportRowValue>
          <Icon source="chevronRight" size={18} color={chevronColor} />
        </S.ExportRow>
        <BackupSeparator />
        <S.ExportRow accessibilityRole="button" onPress={() => setFeedExportOpen(true)}>
          <S.ExportRowText>
            <S.ExportRowTitle>{t(settingsKey('settings.backup.backup_file.title'))}</S.ExportRowTitle>
            <S.ExportRowSubtitle>{t(settingsKey('settings.backup.backup_file.subtitle'))}</S.ExportRowSubtitle>
          </S.ExportRowText>
          <Icon source="chevronRight" size={18} color={chevronColor} />
        </S.ExportRow>
        <BackupSeparator />
        <S.ExportRow
          accessibilityRole="button"
          onPress={() => push('/settings/backup-and-restore/import-from-other-apps')}
        >
          <S.ExportRowText>
            <S.ExportRowTitle>{t(settingsKey('settings.backup.import_apps.title'))}</S.ExportRowTitle>
            <S.ExportRowSubtitle>{t(settingsKey('settings.backup.import_apps.subtitle'))}</S.ExportRowSubtitle>
          </S.ExportRowText>
          <Icon source="chevronRight" size={18} color={chevronColor} />
        </S.ExportRow>
        {canExportHealth ? (
          <>
            <BackupSeparator />
            <S.ExportRowStatic>
              <S.ExportRowText>
                <S.ExportRowTitle>
                  {Platform.OS === 'ios'
                    ? t(settingsKey('settings.backup.health_export.ios_title'))
                    : t(settingsKey('settings.backup.health_export.android_title'))}
                </S.ExportRowTitle>
                <S.ExportRowSubtitle>
                  {Platform.OS === 'ios'
                    ? t(settingsKey('settings.backup.health_export.ios_subtitle'))
                    : t(settingsKey('settings.backup.health_export.android_subtitle'))}
                </S.ExportRowSubtitle>
              </S.ExportRowText>
              <SettingsToggle
                value={exportToHealth}
                onValueChange={(v) => dispatch(setExportToHealthAggregator(v))}
                accessibilityLabel={t(settingsKey('settings.backup.health_export.ios_title'))}
              />
            </S.ExportRowStatic>
          </>
        ) : undefined}
      </CardShell>
      <ExportFeedDialog open={feedExportOpen} setOpen={setFeedExportOpen} />
    </>
  );
}

function StorageSegments() {
  const theme = useAppTheme();
  return (
    <>
      {STORAGE_SEGMENTS.map((seg) => (
        <S.StorageSegment key={seg.flex} $flex={seg.flex} $color={theme.isDark ? seg.dark : seg.light} />
      ))}
    </>
  );
}
