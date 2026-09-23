import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { Weight } from '@/models/weight';
import { RecordedCardioExercise, RecordedCardioExerciseSet } from '@/models/session-models/recorded-cardio-exercise';
import { RecordedExercise, Session } from '@/models/session-models';
import { PotentialSet, RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { sessionTotalSets } from '@/components/presentation/history/history-stats';
import { useAppSelectorWhenFocused } from '@/store';
import { selectHistoryPersonalRecords } from '@/store/stored-sessions';
import { formatDistance } from '@/utils/distance';
import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import { matchSessionPrs, ExercisePrMatch } from '../pr-match';
import { formatSessionClock, formatWeightShort } from '../../summary/post-workout-format';
import * as S from './exercise-breakdown.styles';

function formatChipWeight(weight: Weight): string {
  return localeFormatBigNumber(weight.value, weight.value.isInteger() ? 0 : 1);
}

function weightedChips(
  exercise: RecordedWeightedExercise,
  match: ExercisePrMatch,
  bodyweight: Weight | undefined,
): ReactNode[] {
  return exercise.potentialSets.flatMap((potentialSet: PotentialSet, index: number) =>
    potentialSet.set
      ? [
          <S.SetChip key={index} $pr={match.prSetIndexes.has(index)}>
            <S.SetChipText $pr={match.prSetIndexes.has(index)} style={{ fontVariant: ['tabular-nums'] }}>
              {`${formatChipWeight(exercise.effectiveWeight(potentialSet, bodyweight))}×${potentialSet.set.repsCompleted}`}
            </S.SetChipText>
          </S.SetChip>,
        ]
      : [],
  );
}

function cardioChips(exercise: RecordedCardioExercise): ReactNode[] {
  return exercise.sets.flatMap((set: RecordedCardioExerciseSet, index: number) => {
    if (!set.completionDateTime) {
      return [];
    }
    const text =
      set.blueprint.trackDuration && set.duration
        ? formatSessionClock(set.duration)
        : set.distance
          ? formatDistance(set.distance)
          : undefined;
    return text
      ? [
          <S.SetChip key={index} $pr={false}>
            <S.SetChipText $pr={false} style={{ fontVariant: ['tabular-nums'] }}>
              {text}
            </S.SetChipText>
          </S.SetChip>,
        ]
      : [];
  });
}

interface RowDatum {
  exercise: RecordedExercise;
  match: ExercisePrMatch;
  chips: ReactNode[];
  volume: string;
}

/**
 * The archival exercise ledger: every started exercise, its total volume, and
 * a chip per completed set ("100×5"). PR exercises render their volume in
 * gold and the exact record-setting set gets the gold outline — both derived
 * from the same PR match the PR card uses, so the two can never disagree.
 */
export function ExerciseBreakdown({ session }: { session: Session }) {
  const { t } = useTranslate();
  const records = useAppSelectorWhenFocused(selectHistoryPersonalRecords).get(session.id);
  const matches = matchSessionPrs(session, records);

  const rows: RowDatum[] = [];
  session.recordedExercises.forEach((exercise, index) => {
    if (!exercise.isStarted) {
      return;
    }
    const match = matches[index] ?? {
      hasPr: false,
      prSetIndexes: new Set(),
      prSet: undefined,
    };
    if (exercise instanceof RecordedWeightedExercise) {
      rows.push({
        exercise,
        match,
        chips: weightedChips(exercise, match, session.bodyweight),
        // Bodyweight counted, like the PR e1RM basis — a dip's volume includes the lifter.
        volume: formatWeightShort(exercise.totalWeightLiftedWith(session.bodyweight)),
      });
    } else if (exercise instanceof RecordedCardioExercise) {
      rows.push({ exercise, match, chips: cardioChips(exercise), volume: '—' });
    }
  });
  // The shared set counter — the same figure the stat tile shows.
  const totalSets = sessionTotalSets(session);

  return (
    <HomeCard elev="card" radius={30} pad={16}>
      <S.CardInner>
        <S.Header>
          <S.Title>{t('history.session_detail.exercises.title', 'Exercise Breakdown')}</S.Title>
          <S.SetsChip>
            <S.SetsChipText>
              {t('history.session_detail.exercises.sets', '{count} sets', {
                count: totalSets.toString(),
              }).toLocaleUpperCase()}
            </S.SetsChipText>
          </S.SetsChip>
        </S.Header>
        {rows.length > 0 ? (
          <>
            <S.ColumnHeader>
              <S.ColumnLabel>{t('history.session_detail.exercises.exercise', 'Exercise').toLocaleUpperCase()}</S.ColumnLabel>
              <S.ColumnLabel>{t('history.session_detail.exercises.volume', 'Volume').toLocaleUpperCase()}</S.ColumnLabel>
            </S.ColumnHeader>
            <S.HeaderDivider />
            {rows.map((row, rowIndex) => (
              <S.Row key={rowIndex}>
                <S.RowTop>
                  <S.Index style={{ fontVariant: ['tabular-nums'] }}>{rowIndex + 1}</S.Index>
                  <S.Name numberOfLines={1}>{row.exercise.blueprint.name}</S.Name>
                  {row.match.hasPr ? (
                    <S.PrChip>
                      <S.PrChipText>PR</S.PrChipText>
                    </S.PrChip>
                  ) : null}
                  <S.Volume $pr={row.match.hasPr} style={{ fontVariant: ['tabular-nums'] }}>
                    {row.volume}
                  </S.Volume>
                </S.RowTop>
                {row.chips.length > 0 ? <S.Chips>{row.chips}</S.Chips> : null}
                {rowIndex < rows.length - 1 ? <S.RowDivider /> : null}
              </S.Row>
            ))}
          </>
        ) : (
          <S.Empty>{t('history.session_detail.exercises.empty', 'No sets recorded.')}</S.Empty>
        )}
      </S.CardInner>
    </HomeCard>
  );
}
