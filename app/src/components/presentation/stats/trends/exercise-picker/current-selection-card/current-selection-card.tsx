import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { tintForExercise, type PickerExercise } from '../exercise-picker-model';
import { CheckGlyph, ExerciseGlyphIcon } from '../picker-icons';
import {
  CardContent,
  CardOuter,
  CheckBadge,
  IconTile,
  StrokeLayer,
  TextBlock,
  TintLayer,
} from './current-selection-card.styles';

/**
 * "VIEWING STATS FOR" card: 361×60 rx20, gradient tint + #FF2D55 stroke,
 * green check badge. Shows the exerciseName route param, or the row the user
 * tapped most recently.
 */
export function CurrentSelectionCard({ exercise }: { exercise: PickerExercise }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const tint = tintForExercise(exercise);
  const labelColor = theme.isDark ? '#FF6A88' : '#D70015';
  return (
    <CardOuter>
      <TintLayer
        colors={
          (theme.isDark
            ? [alpha('#FF2D55', 0.16), alpha('#FF9F0A', 0.07)]
            : [alpha('#FF2D55', 0.1), alpha('#FF9F0A', 0.04)]) as [string, string]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <StrokeLayer />
      <CardContent>
        <IconTile $color={alpha(tint.tile, 0.18)}>
          <ExerciseGlyphIcon glyph={tint.glyph} color={tint.icon} />
        </IconTile>
        <TextBlock>
          <HomeText
            weight={fontWeight.bold}
            tracking={0.9}
            style={{ fontSize: 8, lineHeight: 10, color: labelColor }}
          >
            {t('stats.exercise_picker.viewing_stats_for.label')}
          </HomeText>
          <HomeText
            weight={fontWeight.semibold}
            tracking={-0.3}
            numberOfLines={1}
            style={{ fontSize: 15, lineHeight: 20, marginTop: 2 }}
          >
            {exercise.name}
          </HomeText>
        </TextBlock>
        <CheckBadge>
          <CheckGlyph color="#FFFFFF" />
        </CheckBadge>
      </CardContent>
    </CardOuter>
  );
}
