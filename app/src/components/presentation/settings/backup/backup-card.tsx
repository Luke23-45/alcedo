import Icon from '@/components/presentation/foundation/icon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { clearBackendAssignment, selectBackendForFeature } from '@/store/backends';
import { executeRemoteBackup, importData } from '@/store/settings';
import { setStatsIsDirty } from '@/store/stats';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ReactNode } from 'react';
import { chevronColor } from '../shared/grouped-settings-list.styles';
import { SettingsToggle } from '../shared/grouped-settings-list';
import { lastBackupLabel } from '../shared/backup-status';
import { settingsKey } from '../shared/settings-i18n';
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

/**
 * Cloud backup card (settings-dark.md Screen 6). The toggle is wired to the
 * real backup-backend assignment: on navigates to the destination picker, off
 * clears the assignment. The title is the real assigned backend's name.
 * Back Up Now runs the real remote backup and is honestly disabled (with a
 * setup hint) while no destination is assigned.
 *
 * Auto-backup is real: the app uploads (hash-compared, only when data
 * changed) whenever the session tab is focused and a destination is assigned.
 * There is no daily schedule or Wi-Fi-only mode, so the row describes the
 * real mechanism instead of the contract's sample schedule text.
 */
export function BackupCard() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const dispatch = useDispatch();

  const backupBackend = useAppSelector((s) => selectBackendForFeature(s, 'backup'));
  const lastBackup = useAppSelector((s) => s.settings.lastBackup);
  const preferredLanguage = useAppSelector((s) => s.settings.preferredLanguage);
  const use24HourTime = useAppSelector((s) => s.settings.use24HourTime);
  const hasBackend = backupBackend !== undefined;
  const cardTitle = backupBackend?.backend.name ?? t(settingsKey('settings.backup.cloud.title'));

  const backupTime = lastBackupLabel(
    lastBackup,
    {
      today: t(settingsKey('settings.backup.day.today')),
      yesterday: t(settingsKey('settings.backup.day.yesterday')),
    },
    preferredLanguage ?? undefined,
    use24HourTime,
  );

  const onToggleBackup = (on: boolean) => {
    if (on) {
      push('/settings/backup-and-restore/remote-backup');
    } else {
      dispatch(clearBackendAssignment('backup'));
    }
  };

  return (
    <CardShell>
      <S.BackupHeader>
        <S.BackupHeaderText>
          <S.BackupTitle>{cardTitle}</S.BackupTitle>
          <S.BackupSubtitle>
            {backupTime
              ? t(settingsKey('settings.backup.cloud.subtitle'), { time: backupTime })
              : t(settingsKey('settings.backup.cloud.never'))}
          </S.BackupSubtitle>
        </S.BackupHeaderText>
        <SettingsToggle value={hasBackend} onValueChange={onToggleBackup} accessibilityLabel={cardTitle} />
      </S.BackupHeader>
      <S.BackupSeparator />
      <S.AutoRow
        accessibilityRole="button"
        accessibilityLabel={t(settingsKey('settings.backup.auto.title'))}
        onPress={() => push('/settings/backup-and-restore/remote-backup')}
      >
        <S.AutoRowTitle>{t(settingsKey('settings.backup.auto.title'))}</S.AutoRowTitle>
        <S.AutoRowValue>{t(settingsKey('settings.backup.auto.subtitle'))}</S.AutoRowValue>
        <Icon source="chevronRight" size={18} color={chevronColor} />
      </S.AutoRow>
      <S.BackupCtaWrap>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(settingsKey('settings.backup.backup_now'))}
          accessibilityState={{ disabled: !hasBackend }}
          disabled={!hasBackend}
          onPress={() => dispatch(executeRemoteBackup({ force: true }))}
        >
          <BackupCtaButton disabled={!hasBackend}>
            <S.BackupCtaText>{t(settingsKey('settings.backup.backup_now'))}</S.BackupCtaText>
          </BackupCtaButton>
        </Pressable>
      </S.BackupCtaWrap>
      {hasBackend ? undefined : (
        <S.BackupHint accessibilityRole="button" onPress={() => push('/settings/backup-and-restore/remote-backup')}>
          <S.BackupHintText>{t(settingsKey('settings.backup.no_backend_hint'))}</S.BackupHintText>
        </S.BackupHint>
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
