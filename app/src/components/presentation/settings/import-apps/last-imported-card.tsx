import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { CardShell } from '../backup/card-shell';
import { SectionLabel } from './section-label';
import * as S from './last-imported-card.styles';

/** "Jun 4" — month/day in the user's preferred language, from the stored Instant. */
function formatImportDate(epochMillis: number, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(epochMillis));
}

/**
 * S5 §2: LAST IMPORTED card (backup-redesign.md §5). Reads the persisted
 * `lastExternalImport` — "Nothing imported yet." before the first successful
 * accepted import, otherwise the date, workout count, format label, and set
 * count. Read-only; the import effect owns writes and snackbars.
 */
export function LastImportedCard() {
  const { t } = useTranslate();
  const lastImport = useAppSelector((s) => s.settings.lastExternalImport);
  const preferredLanguage = useAppSelector((s) => s.settings.preferredLanguage);
  const locale = preferredLanguage ?? undefined;

  const formatKey =
    lastImport?.format === 'StrongLifts'
      ? 'backup.import_from_other_apps.format.stronglifts_short'
      : 'backup.import_from_other_apps.format.fitnotes_short';

  return (
    <>
      <SectionLabel>{t('backup.import_from_other_apps.last_imported.title')}</SectionLabel>
      <CardShell radius={20}>
        <S.CardRow>
          <S.StatusDot $empty={!lastImport} />
          {lastImport ? (
            <S.TextColumn>
              <S.PrimaryLine>
                {formatImportDate(lastImport.time.toEpochMilli(), locale)} ·{' '}
                {t('backup.import_from_other_apps.last_imported.workouts', { count: lastImport.workoutCount })}
              </S.PrimaryLine>
              <S.SecondaryLine>
                {t(formatKey)} ·{' '}
                {t('backup.import_from_other_apps.last_imported.sets', { count: lastImport.setCount })}
              </S.SecondaryLine>
            </S.TextColumn>
          ) : (
            <S.PrimaryLine $muted>{t('backup.import_from_other_apps.last_imported.never')}</S.PrimaryLine>
          )}
        </S.CardRow>
      </CardShell>
    </>
  );
}
