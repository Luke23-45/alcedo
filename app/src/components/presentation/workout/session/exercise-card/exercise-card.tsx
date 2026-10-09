import { useState } from 'react';
import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';
import BigNumber from 'bignumber.js';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import {
  RecordedCardioExercise,
  RecordedExercise,
  RecordedWeightedExercise,
} from '@/models/session-models';
import { shortFormatWeightUnit } from '@/models/weight';
import { formatDistance } from '@/utils/distance';
import { formatDuration } from '@/utils/format-date';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import {
  BottomLine,
  CardContent,
  CardPressable,
  ChevronText,
  ExerciseName,
  HeaderRow,
  IndexText,
  IndexTile,
  MetaText,
  NameRow,
  NextChip,
  NextChipText,
  NextRail,
  ProgressBarTrack,
  ProgressFraction,
  ProgressRow,
  TitleContainer,
} from './exercise-card.styles';

export interface ExerciseCardProps {
  exercise: RecordedExercise;
  index: number;
  isCurrent: boolean;
  previousExercise?: RecordedExercise;
  supersetPartnerName?: string;
  onPress: () => void;
}

/**
 * Redesigned navigation card for an exercise in the active session list.
 * Single Pressable (D10), minHeight 84, phase-encoded index tile, progress rule,
 * and previous performance summary / plan fallback line.
 */
export function ExerciseCard({
  exercise,
  index,
  isCurrent,
  previousExercise,
  supersetPartnerName,
  onPress,
}: ExerciseCardProps) {
  const { t } = useTranslate();
  const [trackWidth, setTrackWidth] = useState(0);

  const isWeighted = exercise instanceof RecordedWeightedExercise;
  const isCardio = exercise instanceof RecordedCardioExercise;

  // Completed & total sets
  const totalSets = isWeighted
    ? exercise.potentialSets.length
    : isCardio
      ? exercise.sets.length
      : 0;
  const completedSets = isWeighted
    ? exercise.potentialSets.filter((ps) => ps.set !== undefined).length
    : isCardio
      ? exercise.sets.filter((s) => s.isCompletelyFilled).length
      : 0;

  const isComplete = exercise.isComplete;
  const phase: 'complete' | 'current' | 'upcoming' = isComplete
    ? 'complete'
    : isCurrent
      ? 'current'
      : 'upcoming';

  // Progress rule geometry
  const ratio = totalSets > 0 ? Math.min(1, Math.max(0, completedSets / totalSets)) : 0;
  const fillWidth = trackWidth * ratio;
  const gradientColors = isComplete
    ? (['#7BE000', '#D6FF52'] as const)
    : (['#FF0A47', '#FF7A96'] as const);

  // Meta line: equipment/muscle for weighted, or type for cardio + superset notice
  const metaParts: string[] = [];
  if (isWeighted) {
    if (exercise.blueprint.library?.equipment) {
      metaParts.push(exercise.blueprint.library.equipment);
    }
    if (exercise.blueprint.library?.muscles && exercise.blueprint.library.muscles.length > 0) {
      metaParts.push(exercise.blueprint.library.muscles.join(', '));
    } else if (exercise.blueprint.library?.category) {
      metaParts.push(exercise.blueprint.library.category);
    }
  } else if (isCardio) {
    metaParts.push(t('exercise_type.cardio.name', { defaultValue: 'Cardio' }));
  }
  if (supersetPartnerName) {
    metaParts.push(
      t('workout.superset_with.label', {
        partner: supersetPartnerName,
        defaultValue: `🔗 Superset with ${supersetPartnerName}`,
      }),
    );
  }
  const metaLine = metaParts.join(' · ');

  // Bottom summary line (status + previous performance or plan prescription fallback)
  let bottomLine = '';
  if (isWeighted) {
    const totalTonnage = exercise.potentialSets.reduce((acc, ps) => {
      if (!ps.set) return acc;
      return acc.plus(ps.weight.convertTo('kilograms').value.multipliedBy(ps.set.repsCompleted));
    }, new BigNumber(0));
    const tonnageStr = `${localeFormatBigNumber(totalTonnage.decimalPlaces(0))} kg`;

    if (previousExercise instanceof RecordedWeightedExercise) {
      const prevSets = previousExercise.potentialSets.filter((ps) => ps.set !== undefined);
      if (prevSets.length > 0) {
        const prevSetsStr = prevSets
          .map((ps) => {
            const wVal = localeFormatBigNumber(
              ps.weight.value.decimalPlaces(ps.weight.value.isInteger() ? 0 : 1),
            );
            const u = shortFormatWeightUnit(ps.weight.unit);
            return `${wVal}${u} × ${ps.set!.repsCompleted}`.trim();
          })
          .join(', ');
        bottomLine = `${tonnageStr} · last ${prevSetsStr}`;
      }
    }

    if (!bottomLine) {
      // Fallback to plan prescription
      const firstTarget = exercise.repsTargetForSet(0);
      const firstWeight = exercise.potentialSets[0]?.weight;
      const weightStr =
        firstWeight && !firstWeight.value.isZero()
          ? ` · ${localeFormatBigNumber(firstWeight.value.decimalPlaces(firstWeight.value.isInteger() ? 0 : 1))} ${shortFormatWeightUnit(firstWeight.unit)}`
          : '';
      const repRange =
        firstTarget.min === firstTarget.max
          ? `${firstTarget.max}`
          : `${firstTarget.min}–${firstTarget.max}`;
      bottomLine = `${tonnageStr} · Plan: ${totalSets} sets · ${repRange} reps${weightStr}`;
    }
  } else if (isCardio) {
    const durationStr = exercise.duration ? formatDuration(exercise.duration, 'hours-mins') : '0m';
    const filledDistances = exercise.sets
      .map((s) => s.distance)
      .filter((d): d is NonNullable<typeof d> => d !== undefined);
    const distanceStr =
      filledDistances.length > 0
        ? ` · ${filledDistances.map(formatDistance).join(', ')}`
        : '';
    bottomLine = `${durationStr}${distanceStr}`;
  }

  const a11yLabel = `${exercise.blueprint.name}, ${completedSets} of ${totalSets} sets, ${bottomLine}, opens detail`;

  return (
    <CardPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      <HomeCard elev="card" radius={24} pad={0} style={{ flex: 1 }}>
        {isCurrent && <NextRail />}
        <CardContent>
          <HeaderRow>
            <IndexTile $phase={phase}>
              <IndexText $phase={phase}>{index + 1}</IndexText>
            </IndexTile>

            <TitleContainer>
              <NameRow>
                <ExerciseName $complete={isComplete} numberOfLines={1}>
                  {exercise.blueprint.name}
                </ExerciseName>
                {isCurrent && (
                  <NextChip>
                    <NextChipText>
                      {t('workout.session.next.chip', { defaultValue: 'NEXT' }).toLocaleUpperCase()}
                    </NextChipText>
                  </NextChip>
                )}
              </NameRow>
              {metaLine.length > 0 && <MetaText numberOfLines={1}>{metaLine}</MetaText>}
            </TitleContainer>

            <ChevronText>›</ChevronText>
          </HeaderRow>

          <ProgressRow>
            <ProgressBarTrack onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
              {fillWidth > 0 && (
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 3, width: fillWidth, borderRadius: 1.5 }}
                />
              )}
            </ProgressBarTrack>
            <ProgressFraction>
              {completedSets}/{totalSets}
            </ProgressFraction>
          </ProgressRow>

          <BottomLine numberOfLines={1}>{bottomLine}</BottomLine>
        </CardContent>
      </HomeCard>
    </CardPressable>
  );
}
