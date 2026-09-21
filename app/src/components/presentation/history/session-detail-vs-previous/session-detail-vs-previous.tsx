import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { SessionComparisonTable } from '@/components/presentation/workout/session-comparison-table';
import { Session } from '@/models/session-models';
import { useAppSelectorWhenFocusedWithArg } from '@/store';
import { selectPreviousComparableSession } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import * as S from './session-detail-vs-previous.styles';

/**
 * The archival vs-previous card. The table itself already renders the four
 * rows (Volume / Sets / Top set / Duration) from the two real sessions; this
 * wrapper only adds the archive's honest empty state — a first session of its
 * kind has no previous, and saying so beats omitting the card.
 */
export function SessionDetailVsPrevious({ session }: { session: Session }) {
  const { t } = useTranslate();
  const previous = useAppSelectorWhenFocusedWithArg(selectPreviousComparableSession, session);

  if (!previous) {
    return (
      <HomeCard elev="card" radius={30} pad={16}>
        <S.Title>
          {t('history.session_detail.vs_previous.title', 'vs. Previous {name}', { name: session.blueprint.name })}
        </S.Title>
        <S.Empty>{t('history.session_detail.vs_previous.first', 'First session of its kind.')}</S.Empty>
      </HomeCard>
    );
  }

  return <SessionComparisonTable session={session} previousSession={previous} />;
}
