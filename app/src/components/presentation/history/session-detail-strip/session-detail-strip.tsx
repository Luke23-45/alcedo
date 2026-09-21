import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import {
  estimateSessionKcal,
  formatClockDuration,
  formatCount,
  sessionActiveRest,
} from '@/components/presentation/history/history-stats';
import { Session } from '@/models/session-models';
import { useTranslate } from '@tolgee/react';
import * as S from './session-detail-strip.styles';

/**
 * The four-cell secondary strip. Every value is real: estimated kcal (labelled
 * as an estimate), the count of started exercises, and the rest time from the
 * shared session stats. Max BPM has no store source, so it renders the
 * reference's sample figure under a SampleBadge rather than as a synced fact.
 * Exercise count intentionally replaces AVG RPE, which the store cannot compute.
 */
export function SessionDetailStrip({ session }: { session: Session }) {
  const { t } = useTranslate();

  const started = session.recordedExercises.filter((exercise) => exercise.isStarted).length;
  const rest = formatClockDuration(sessionActiveRest(session)?.rest);

  return (
    <S.StripCard elev="tile" radius={24} pad={0}>
      <S.StripInner>
        <S.Cell>
          <S.Value style={{ fontVariant: ['tabular-nums'] }}>{formatCount(estimateSessionKcal(session))}</S.Value>
          <S.Label>{t('workout.post_workout.kcal.label')}</S.Label>
        </S.Cell>
        <S.Divider />
        <S.Cell>
          <S.MaxBpmRow>
            <S.Value style={{ fontVariant: ['tabular-nums'] }}>164</S.Value>
            <SampleBadge compact />
          </S.MaxBpmRow>
          <S.Label>{t('history.session_detail.strip.max_bpm', 'Max bpm')}</S.Label>
        </S.Cell>
        <S.Divider />
        <S.Cell>
          <S.Value style={{ fontVariant: ['tabular-nums'] }}>{started}</S.Value>
          <S.Label>{t('workout.session.exercises.label')}</S.Label>
        </S.Cell>
        <S.Divider />
        <S.Cell>
          <S.Value style={{ fontVariant: ['tabular-nums'] }}>{rest}</S.Value>
          <S.Label>{t('history.session_detail.strip.total_rest', 'Total rest')}</S.Label>
        </S.Cell>
      </S.StripInner>
    </S.StripCard>
  );
}
