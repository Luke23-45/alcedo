import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { SmartKudosCard } from '@/components/smart/kudos-card';
import { PostWorkoutPrBadges } from '@/components/smart/pr-badges';
import { PostWorkoutStreak } from '@/components/smart/post-workout-streak';
import { SmartSessionNotesCard } from '@/components/smart/session-notes-card';
import { SessionComparisonTable } from '@/components/presentation/workout/session-comparison-table';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SharedSession } from '@/models/feed-models';
import { useAppSelectorWithArg } from '@/store';
import { encryptAndShare } from '@/store/feed';
import { selectPreviousComparableSession, selectSession } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { PostWorkoutActions } from '../post-workout-actions/post-workout-actions';
import { PostWorkoutAuras } from '../post-workout-auras/post-workout-auras';
import { PostWorkoutHero } from '../post-workout-hero/post-workout-hero';
import { PostWorkoutStatTiles } from '../post-workout-stat-tiles/post-workout-stat-tiles';
import * as S from './post-workout-screen.styles';

/**
 * Screen 7 — the post-workout summary, shared by both routes so the geometry
 * is identical everywhere. Eight blocks per the reference: duration hero,
 * stat tiles, PR badges, vs-previous table, streak, notes, kudos, and the
 * sticky Share/Done bar. Every number is computed from the real session.
 */
export function PostWorkoutScreen({ sessionId, onDone }: { sessionId: string; onDone: () => void }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const session = useAppSelectorWithArg(selectSession, sessionId);
  const previousSession = useAppSelectorWithArg(selectPreviousComparableSession, session);

  if (!session) {
    return null;
  }

  return (
    <FullHeightScrollView
      screenBackground={<PostWorkoutAuras />}
      scrollStyle={{ paddingHorizontal: theme.layout.screenPadding }}
      floatingChildren={
        <PostWorkoutActions
          onShare={() =>
            dispatch(
              encryptAndShare({
                item: new SharedSession(session),
                title: t('workout.shared_item.title'),
              }),
            )
          }
          onDone={onDone}
          doneLabel={t('workout.post_workout.done.button')}
        />
      }
    >
      <S.Sections>
        <PostWorkoutHero session={session} />
        <PostWorkoutStatTiles session={session} />
        <PostWorkoutPrBadges sessionId={session.id} />
        <SessionComparisonTable session={session} previousSession={previousSession} />
        <PostWorkoutStreak sessionId={session.id} />
        <SmartSessionNotesCard sessionId={session.id} />
        <SmartKudosCard sessionId={session.id} />
      </S.Sections>
    </FullHeightScrollView>
  );
}
