import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import LimitedHtml from '@/components/presentation/foundation/limited-html';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { SmartKudosCard } from '@/components/smart/kudos-card';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useStartWorkout } from '@/hooks/useStartWorkout';
import { Session } from '@/models/session-models';
import { SharedSession } from '@/models/feed-models';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import {
  addUnpublishedSessionId,
  encryptAndShare,
  removeReactionsForEvents,
  selectReceivedReactionsByEvent,
} from '@/store/feed';
import { deleteStoredSession, selectActiveSession } from '@/store/stored-sessions';
import { uuid } from '@/utils/uuid';
import { LocalDate } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SessionNotesCard } from '../../summary/session-notes-card/session-notes-card';
import { ExerciseBreakdown } from '../exercise-breakdown/exercise-breakdown';
import { HistoryStatTiles } from '../history-stat-tiles/history-stat-tiles';
import { HrCurveCard } from '../hr-curve-card/hr-curve-card';
import { SessionDetailActions } from '../session-detail-actions/session-detail-actions';
import { SessionDetailAuras } from '../session-detail-auras/session-detail-auras';
import { SessionDetailHero } from '../session-detail-hero/session-detail-hero';
import { SessionDetailNav } from '../session-detail-nav/session-detail-nav';
import { SessionDetailPrCard } from '../session-detail-pr-card/session-detail-pr-card';
import { SessionDetailStrip } from '../session-detail-strip/session-detail-strip';
import { SessionDetailVsPrevious } from '../session-detail-vs-previous/session-detail-vs-previous';
import * as S from './session-detail-screen.styles';

/**
 * The archival session detail: a record, not a trophy. Same duration
 * typography as the post-workout summary, minus the celebration seal and the
 * pink label. Every figure is real except the heart-rate card, which is
 * contract sample data under a SampleBadge — Alcedo does not sync HR.
 *
 * The kudos card is the only conditional section: with no reactions it
 * renders nothing, because an empty kudos card in an archive is noise.
 */
export function SessionDetailScreen({
  session,
  onBack,
  onDeleted,
}: {
  session: Session;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const formatDate = useFormatDate();
  const { push } = useRouter();
  const startWorkoutSession = useStartWorkout();
  const activeSession = useAppSelector(selectActiveSession);
  const receivedByEvent = useAppSelector(selectReceivedReactionsByEvent);
  const hasKudos = (receivedByEvent.get(session.id) ?? []).length > 0;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [repeatOpen, setRepeatOpen] = useState(false);

  const share = () => {
    dispatch(
      encryptAndShare({
        item: new SharedSession(session),
        title: t('workout.shared_item.title'),
      }),
    );
  };

  const edit = () => {
    push(`/history/edit?sessionId=${encodeURIComponent(session.id)}`);
  };

  const confirmDelete = () => {
    dispatch(deleteStoredSession(session.id));
    dispatch(addUnpublishedSessionId(session.id));
    dispatch(removeReactionsForEvents([session.id]));
    setDeleteOpen(false);
    onDeleted();
  };

  const requestRepeat = () => {
    if (activeSession) {
      setRepeatOpen(true);
      return;
    }
    startRepeat();
  };

  const startRepeat = () => {
    setRepeatOpen(false);
    startWorkoutSession(session.withNothingCompleted().with({ date: LocalDate.now(), id: uuid() }));
    push('/(tabs)/(session)/session', { withAnchor: true });
  };

  return (
    <S.Screen>
      <FullHeightScrollView
        screenBackground={<SessionDetailAuras />}
        safeAreaEdges={{
          left: 'additive',
          right: 'additive',
          top: 'additive',
          bottom: 'additive',
        }}
      >
        <SessionDetailNav
          onBack={onBack}
          menuItems={[
            {
              label: t('history.session_detail.menu.repeat', 'Repeat Workout'),
              icon: 'reload',
              systemImage: 'arrow.clockwise',
              onPress: requestRepeat,
            },
            {
              label: t('history.session_detail.menu.delete', 'Delete Session'),
              icon: 'delete',
              systemImage: 'trash',
              destructive: true,
              onPress: () => setDeleteOpen(true),
            },
          ]}
        />
        <S.Body>
          <SessionDetailHero session={session} />
          <S.Section>
            <HistoryStatTiles session={session} />
          </S.Section>
          <S.Section>
            <SessionDetailStrip session={session} />
          </S.Section>
          <S.Section>
            <SessionDetailPrCard session={session} />
          </S.Section>
          <S.Section>
            <HrCurveCard />
          </S.Section>
          <S.Section>
            <ExerciseBreakdown session={session} />
          </S.Section>
          <S.Section>
            <SessionDetailVsPrevious session={session} />
          </S.Section>
          <S.Section>
            <SessionNotesCard notes={session.blueprint.notes} onEdit={edit} />
          </S.Section>
          {hasKudos ? (
            <S.Section>
              <SmartKudosCard sessionId={session.id} />
            </S.Section>
          ) : null}
          <S.Section>
            <SessionDetailActions onShare={share} onEdit={edit} onDelete={() => setDeleteOpen(true)} />
          </S.Section>
        </S.Body>
      </FullHeightScrollView>

      <ConfirmationDialog
        headline={t('workout.replace_current.confirm.title')}
        textContent={t('workout.replace_in_progress.confirm.body')}
        open={repeatOpen}
        okText={t('generic.replace.button')}
        onOk={startRepeat}
        onCancel={() => setRepeatOpen(false)}
      />
      <ConfirmationDialog
        headline={t('workout.delete.confirm.title')}
        textContent={
          <LimitedHtml
            value={t('workout.delete.confirm.body', {
              sessionName: session.blueprint.name,
              date: formatDate(session.date, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            })}
          />
        }
        open={deleteOpen}
        okText={t('generic.delete.button')}
        destructive
        onOk={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </S.Screen>
  );
}
