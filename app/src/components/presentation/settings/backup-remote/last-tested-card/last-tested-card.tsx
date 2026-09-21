import { useAppSelector } from '@/store';
import type { LastRemoteBackupTest } from '@/store/settings/registry';
import { formatBackupBytes, formatBackupDuration } from '@/utils/backup-format';
import { formatDateTimeMedium } from '@/utils/format-date';
import { useTranslate } from '@tolgee/react';
import { SettingsGroup } from '../../shared/grouped-settings-list';
import * as S from './last-tested-card.styles';

function LastTestedContent({ test }: { test: LastRemoteBackupTest | undefined }) {
  const { t } = useTranslate();

  /** Maps the stored error variant onto the honest error subtitle copy. */
  const errorDetail = (() => {
    if (test?.status !== 'error') {
      return undefined;
    }
    switch (test.errorVariant) {
      case 'connection':
        return t('backup.remote.error.connection');
      case 'http401':
        return t('backup.remote.error.unauthorized');
      case 'http500':
        return t('backup.remote.error.server');
      case 'http413':
        return t('backup.remote.error.payload_too_large');
      case 'httpOther':
        return t('backup.remote.error.http_other', { code: String(test.errorCode ?? '') });
      default:
        return t('backup.remote.error.unknown');
    }
  })();

  if (!test) {
    return (
      <S.LastTestedRow accessibilityRole="text">
        <S.StatusDot $color="#48484A" />
        <S.LastTestedText>
          <S.NeverTitle>{t('backup.remote.last_tested.never')}</S.NeverTitle>
          <S.LastTestedDetail>
            {t('backup.remote.last_tested.never_hint')}
          </S.LastTestedDetail>
        </S.LastTestedText>
      </S.LastTestedRow>
    );
  }

  const date = formatDateTimeMedium(test.time);
  if (test.status === 'success') {
    return (
      <S.LastTestedRow accessibilityRole="text">
        <S.StatusDot $color="#30D158" />
        <S.LastTestedText>
          <S.LastTestedTitle>
            {t('backup.remote.last_tested.success')} · {date}
          </S.LastTestedTitle>
          <S.LastTestedDetail>
            {t('backup.remote.last_tested.success_detail', {
              bytes: formatBackupBytes(test.uploadedBytes ?? 0),
              duration: formatBackupDuration(test.durationMs ?? 0),
            })}
          </S.LastTestedDetail>
        </S.LastTestedText>
      </S.LastTestedRow>
    );
  }

  return (
    <S.LastTestedRow accessibilityRole="text">
      <S.StatusDot $color="#FF6B60" />
      <S.LastTestedText>
        <S.LastTestedTitle $color="#FF6B60">
          {t('backup.remote.last_tested.failed')} · {date}
        </S.LastTestedTitle>
        <S.LastTestedDetail>{t('backup.remote.last_tested.error_detail', { error: errorDetail })}</S.LastTestedDetail>
      </S.LastTestedText>
    </S.LastTestedRow>
  );
}

/**
 * LAST TESTED card (backup-redesign.md S1 + S3): persists between sessions,
 * shows the real result of the last Test run — success time and byte count,
 * or the honestly classified last error. The snackbar itself is raised by the
 * remote-backup effects layer.
 */
export function LastTestedCard() {
  const { t } = useTranslate();
  const lastTest = useAppSelector((s) => s.settings.lastRemoteBackupTest);

  return (
    <SettingsGroup label={t('backup.remote.last_tested.title')}>
      <LastTestedContent test={lastTest} />
    </SettingsGroup>
  );
}
