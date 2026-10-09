import React from 'react';
import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { RecordedWeightedExercise } from '@/models/session-models';
import { Weight } from '@/models/weight';
import * as S from './vs-last-time.styles';

export interface VsLastTimeProps {
  exercise: RecordedWeightedExercise;
  previousExercise?: RecordedWeightedExercise | undefined;
}

interface SetComparison {
  setIndex: number;
  lastText: string;
  todayText: string;
  deltaText: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

/**
 * Computes delta and sentiment between a previous set and today's set.
 *
 * ⚠️ HONESTY RULE (P4.3b):
 * A load increase is strictly considered 'positive' ONLY when reps held (todayReps >= prevReps).
 * Lifting more weight at fewer reps is 'neutral' (a trade-off, not pure progression).
 * Drop in load or reps with no compensating gain is 'negative'.
 */
function compareSets(
  lastWeight: Weight | undefined,
  lastReps: number | undefined,
  todayWeight: Weight | undefined,
  todayReps: number | undefined,
): { deltaText: string; sentiment: 'positive' | 'negative' | 'neutral' } {
  if (!lastWeight || lastReps === undefined) {
    return { deltaText: '—', sentiment: 'neutral' };
  }
  if (!todayWeight || todayReps === undefined) {
    return { deltaText: '—', sentiment: 'neutral' };
  }

  const weightDiff = todayWeight.value.minus(lastWeight.value);
  const repsDiff = todayReps - lastReps;

  // 1. More weight
  if (weightDiff.isGreaterThan(0)) {
    if (repsDiff >= 0) {
      // Weight increased AND reps held or increased -> Genuine WIN
      const unit = todayWeight.unit;
      return {
        deltaText: `▲ +${weightDiff.toString()} ${unit}`,
        sentiment: 'positive',
      };
    }
    // More weight at fewer reps: Honesty rule -> NEUTRAL
    return {
      deltaText: `+${weightDiff.toString()} ${todayWeight.unit} (${repsDiff})`,
      sentiment: 'neutral',
    };
  }

  // 2. Same weight
  if (weightDiff.isZero()) {
    if (repsDiff > 0) {
      return {
        deltaText: `▲ +${repsDiff} ${repsDiff === 1 ? 'rep' : 'reps'}`,
        sentiment: 'positive',
      };
    }
    if (repsDiff < 0) {
      return {
        deltaText: `▼ ${repsDiff} ${repsDiff === -1 ? 'rep' : 'reps'}`,
        sentiment: 'negative',
      };
    }
    return { deltaText: '=', sentiment: 'neutral' };
  }

  // 3. Lower weight
  if (repsDiff > 0) {
    // Lower weight with more reps: trade-off
    return {
      deltaText: `${weightDiff.toString()} ${todayWeight.unit} (+${repsDiff})`,
      sentiment: 'neutral',
    };
  }

  // Lower weight and fewer or equal reps -> Definite drop
  return {
    deltaText: `▼ ${weightDiff.toString()} ${todayWeight.unit}`,
    sentiment: 'negative',
  };
}

/**
 * VS LAST TIME matrix card (§4.2.3 / P4.3).
 * Set-by-set comparison against the most recent session for this movement.
 * If no previous history exists, renders the plan's prescription instead (no empty card).
 */
export function VsLastTime({ exercise, previousExercise }: VsLastTimeProps) {
  const { t } = useTranslate();

  const totalSets = Math.max(
    exercise.potentialSets.length,
    previousExercise?.potentialSets.length ?? 0,
  );

  const comparisons: SetComparison[] = [];

  for (let i = 0; i < totalSets; i++) {
    const todayPS = exercise.potentialSets[i];
    const prevPS = previousExercise?.potentialSets[i];

    const todayRecorded = todayPS?.set;
    const prevRecorded = prevPS?.set;

    const lastText = prevRecorded
      ? `${prevPS?.weight.value.toString()} × ${prevRecorded.repsCompleted}`
      : '—';

    const todayText = todayRecorded
      ? `${todayPS?.weight.value.toString()} × ${todayRecorded.repsCompleted}`
      : todayPS
        ? `${todayPS.weight.value.toString()} × ${exercise.repsTargetForSet(i).max}`
        : '—';

    const comp = compareSets(
      prevPS?.weight,
      prevRecorded?.repsCompleted,
      todayPS?.weight,
      todayRecorded?.repsCompleted,
    );

    comparisons.push({
      setIndex: i + 1,
      lastText,
      todayText,
      deltaText: comp.deltaText,
      sentiment: comp.sentiment,
    });
  }

  const hasHistory = previousExercise !== undefined && previousExercise.potentialSets.some((ps) => ps.set);

  return (
    <HomeCard radius={24} pad={16}>
      <S.Container>
        <S.HeaderRow>
          <S.CardTitle>VS LAST TIME</S.CardTitle>
          {hasHistory && <S.Subtitle>Previous session</S.Subtitle>}
        </S.HeaderRow>

        {hasHistory ? (
          <S.MatrixTable>
            {comparisons.map((row) => (
              <S.MatrixRow key={row.setIndex}>
                <S.SetIndexText>Set {row.setIndex}</S.SetIndexText>
                <S.LastValueText numberOfLines={1}>{row.lastText}</S.LastValueText>
                <S.ArrowText>→</S.ArrowText>
                <S.TodayValueText numberOfLines={1}>{row.todayText}</S.TodayValueText>
                <S.DeltaChip $sentiment={row.sentiment}>
                  <S.DeltaChipText $sentiment={row.sentiment} numberOfLines={1}>
                    {row.deltaText}
                  </S.DeltaChipText>
                </S.DeltaChip>
              </S.MatrixRow>
            ))}
          </S.MatrixTable>
        ) : (
          <S.PrescriptionFallback>
            <S.PrescriptionText>
              First time tracking this movement in your current cycle.
            </S.PrescriptionText>
            <S.Subtitle>
              Prescribed: {exercise.potentialSets.length} sets · {exercise.repsTargetForSet(0).min}–
              {exercise.repsTargetForSet(0).max} reps
            </S.Subtitle>
          </S.PrescriptionFallback>
        )}
      </S.Container>
    </HomeCard>
  );
}
