import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { rowLeadingParts, tintForExercise, type PickerExercise } from '../exercise-picker-model';
import { CheckGlyph, ExerciseGlyphIcon } from '../picker-icons';
import {
  IconTile,
  RowCard,
  RowInner,
  RowPress,
  SelectCircle,
  TextBlock,
} from './exercise-row.styles';

/**
 * One exercise row: 52pt HomeCard tile, 32×32 muscle-tinted icon tile,
 * name (14/600/−.2), "{muscles} · {n} sessions" subtitle (10.5/500),
 * select circle (r11; #FF2D55 + white check when selected).
 */
export function ExerciseRow({
  exercise,
  selected,
  onPress,
  includeEquipment,
}: {
  exercise: PickerExercise;
  selected: boolean;
  onPress: () => void;
  /** ALL EXERCISES rows lead with the equipment ("Dumbbell · Shoulders"). */
  includeEquipment: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const tint = tintForExercise(exercise);
  const subtitle = [...rowLeadingParts(exercise, includeEquipment), t('stats.exercise_picker.sessions.label', { count: exercise.sessionCount })].join(
    ' · ',
  );
  return (
    <RowPress
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={exercise.name}
    >
      <RowCard>
        <RowInner>
          <IconTile $color={alpha(tint.tile, tint.tileAlpha)}>
            <ExerciseGlyphIcon glyph={tint.glyph} color={tint.icon} />
          </IconTile>
          <TextBlock>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.2}
              numberOfLines={1}
              style={{ fontSize: 14, lineHeight: 18 }}
            >
              {exercise.name}
            </HomeText>
            <HomeText
              weight={fontWeight.medium}
              numberOfLines={1}
              style={{
                fontSize: 10.5,
                lineHeight: 14,
                marginTop: 2,
                color: theme.isDark ? '#86868B' : '#6C6C70',
              }}
            >
              {subtitle}
            </HomeText>
          </TextBlock>
          <SelectCircle $selected={selected}>
            {selected ? <CheckGlyph color="#FFFFFF" width={8.6} height={7.2} /> : null}
          </SelectCircle>
        </RowInner>
      </RowCard>
    </RowPress>
  );
}
