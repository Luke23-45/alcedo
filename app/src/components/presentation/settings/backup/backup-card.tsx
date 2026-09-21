import Icon from '@/components/presentation/foundation/icon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { selectBackendForFeature } from '@/store/backends';
import { BackupMode, executeRemoteBackup, importData, setBackupMode } from '@/store/settings';
import { setStatsIsDirty } from '@/store/stats';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ReactNode } from 'react';
import { chevronColor } from '../shared/grouped-settings-list.styles';
import { lastBackupLabel } from '../shared/backup-status';
import { settingsKey } from '../shared/settings-i18n';
import { PreferenceSegmented, SegmentedOption } from '../preferences/preference-segmented';
import * as S from './backup-card.styles';
import { CardShell } from './card-shell';

/** Back Up Now gradient button with its gloss highlight. */
function BackupCtaButton({ disabled, children }: { disabled: boolean; children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.BackupCtaBase
      $disabled={disabled}
      colors={theme.isDark ? ['#FFB03A', '#FF6A3D', '#FF2D55'] : ['#FF9500', '#E8003F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.6, y: 1 }}
    >
      <S.BackupCtaGlossBase
        colors={['rgba(255,255,255,0.30)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
      />
      {children}
    </S.BackupCtaBase>
  );
}

const MODE_HINT_KEYS: Record<BackupMode, string> = {
  off: 'settings.backup.mode.off_hint',
  automatic: 'settings.backup.mode.automatic_hint',
  manual: 'settings.backup.mode.manual_hint',
};

/**
 * Backup card (settings-dark.md Screen 6), privacy-first: the Off /
 * Automatic / Manual segmented control is the consent switch. Off (the
 * default) never uploads; Automatic keeps the previous hash-change backup
 * on home focus; Manual uploads only from an explicit Back Up Now.
 * Destination assignment stays separate configuration on the
 * remote-backup screen. The status line reports the truthful last-backup
 * state — never "synced", and "time unknown" when a legacy backup has no
 * recorded timestamp.
 */
export function BackupCard() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const dispatch = useDispatch();

  const backupBackend = useAppSelector((s) => selectBackendForFeature(s, 'backup'));
  const backupMode = useAppSelector((s) => s.settings.backupMode);
  const lastBackup = useAppSelector((s) => s.settings.lastBackup);
  const preferredLanguage = useAppSelector((s) => s.settings.preferredLanguage);
  const use24HourTime = useAppSelector((s) => s.settings.use24HourTime);
  const hasBackend = backupBackend !== undefined;
  const canBackUpNow = backupMode !== 'off' && hasBackend;

  const backupTime = lastBackupLabel(
    lastBackup,
    {
      today: t(settingsKey('settings.backup.day.today')),
      yesterday: t(settingsKey('settings.backup.day.yesterday')),
      unknownTime: t(settingsKey('settings.backup.day.unknown_time')),
    },
    preferredLanguage ?? undefined,
    use24HourTime,
  );

  const modeOptions: SegmentedOption<BackupMode>[] = [
    { value: 'off', label: t(settingsKey('settings.backup.mode.off')) },
    { value: 'automatic', label: t(settingsKey('settings.backup.mode.automatic')) },
    { value: 'manual', label: t(settingsKey('settings.backup.mode.manual')) },
  ];

  return (
    <CardShell>
      <S.BackupHeader>
        <S.BackupHeaderText>
          <S.BackupTitle>{t(settingsKey('settings.backup.mode.title'))}</S.BackupTitle>
          <S.BackupSubtitle>
            {backupTime
              ? t(settingsKey('settings.backup.cloud.subtitle'), { time: backupTime })
              : t(settingsKey('settings.backup.cloud.never'))}
          </S.BackupSubtitle>
        </S.BackupHeaderText>
      </S.BackupHeader>
      <S.ModeSegmentWrap>
        <PreferenceSegmented
          options={modeOptions}
          value={backupMode}
          onChange={(mode) => dispatch(setBackupMode(mode))}
          accessibilityLabel={t(settingsKey('settings.backup.mode.title'))}
          testID="backup-mode-segmented"
        />
      </S.ModeSegmentWrap>
      <S.ModeHintText>{t(settingsKey(MODE_HINT_KEYS[backupMode]))}</S.ModeHintText>
      <S.BackupSeparator />
      <S.DestinationRow
        accessibilityRole="button"
        accessibilityLabel={t(settingsKey('settings.backup.destination.title'))}
        onPress={() => push('/settings/backup-and-restore/remote-backup')}
      >
        <S.DestinationRowTitle>{t(settingsKey('settings.backup.destination.title'))}</S.DestinationRowTitle>
        <S.DestinationRowValue>
          {backupBackend?.backend.name ?? t(settingsKey('settings.backup.destination.not_set'))}
        </S.DestinationRowValue>
        <Icon source="chevronRight" size={18} color={chevronColor} />
      </S.DestinationRow>
      {backupMode === 'off' ? undefined : (
        <>
          <S.BackupCtaWrap>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(settingsKey('settings.backup.backup_now'))}
              accessibilityState={{ disabled: !canBackUpNow }}
              disabled={!canBackUpNow}
              onPress={() => dispatch(executeRemoteBackup({ force: true, reason: 'manual' }))}
            >
              <BackupCtaButton disabled={!canBackUpNow}>
                <S.BackupCtaText>{t(settingsKey('settings.backup.backup_now'))}</S.BackupCtaText>
              </BackupCtaButton>
            </Pressable>
          </S.BackupCtaWrap>
          {hasBackend ? undefined : (
            <S.BackupHint accessibilityRole="button" onPress={() => push('/settings/backup-and-restore/remote-backup')}>
              <S.BackupHintText>{t(settingsKey('settings.backup.no_backend_hint'))}</S.BackupHintText>
            </S.BackupHint>
          )}
        </>
      )}
      <S.RestoreLink
        accessibilityRole="button"
        onPress={() => {
          dispatch(importData());
          dispatch(setStatsIsDirty(true));
        }}
      >
        <S.RestoreLinkText>{t(settingsKey('settings.backup.restore'))}</S.RestoreLinkText>
      </S.RestoreLink>
    </CardShell>
  );
}
