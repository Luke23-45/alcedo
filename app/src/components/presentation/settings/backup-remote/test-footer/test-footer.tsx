import { useAppSelector } from '@/store';
import { selectAssignedBackendId } from '@/store/backends';
import { executeRemoteBackup } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import * as S from './test-footer.styles';

// The spec's `br` gradient (backup-redesign.md S1): amber → coral → crimson.
const BRAND_GRADIENT = ['#FFB03A', '#FF6A3D', '#FF2D55'] as const;

/**
 * Floating footer (backup-redesign.md S1 + S3): the Test primary button
 * fires a forced full upload; while the test is in flight it shows a spinner
 * plus "Sending…" and stays disabled. With no server assigned Test is
 * disabled — tapping it would have nowhere to send. While the backup mode
 * is Off, Test is disabled too: Off never uploads, so the caption says so
 * honestly. Manage backends opens the backend list.
 */
export function TestFooter() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { push } = useRouter();
  const testInFlight = useAppSelector((s) => s.settings.testInFlight);
  const assignedBackendId = useAppSelector((s) => selectAssignedBackendId(s, 'backup'));
  const backupMode = useAppSelector((s) => s.settings.backupMode);

  const backupsOff = backupMode === 'off';
  const disabled = !assignedBackendId || testInFlight || backupsOff;

  return (
    <S.FooterBar>
      <S.TestPressable
        accessibilityRole="button"
        accessibilityLabel={testInFlight ? t('backup.remote.test.sending') : t('backup.remote.test.button')}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => dispatch(executeRemoteBackup({ force: true, reason: 'test' }))}
      >
        {disabled && !testInFlight ? (
          <S.TestButtonDisabled>
            <S.TestLabel $disabled numberOfLines={1}>
              {t('backup.remote.test.button')}
            </S.TestLabel>
          </S.TestButtonDisabled>
        ) : (
          <S.TestButtonSurface
            colors={[...BRAND_GRADIENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={testInFlight ? { opacity: 0.55 } : undefined}
          >
            {testInFlight ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
            <S.TestLabel $disabled={false} numberOfLines={1}>
              {testInFlight ? t('backup.remote.test.sending') : t('backup.remote.test.button')}
            </S.TestLabel>
          </S.TestButtonSurface>
        )}
      </S.TestPressable>
      {disabled && !testInFlight ? (
        <S.DisabledCaption>
          {t(backupsOff ? 'backup.remote.test.disabled_off_caption' : 'backup.remote.test.disabled_caption')}
        </S.DisabledCaption>
      ) : undefined}
      <S.ManageButton
        accessibilityRole="button"
        accessibilityLabel={t('backup.remote.manage_backends.button')}
        onPress={() => push('/settings/backends')}
      >
        <S.ManageLabel numberOfLines={1}>{t('backup.remote.manage_backends.button')}</S.ManageLabel>
      </S.ManageButton>
    </S.FooterBar>
  );
}
