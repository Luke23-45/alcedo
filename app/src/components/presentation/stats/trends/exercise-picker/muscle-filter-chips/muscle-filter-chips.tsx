import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { MUSCLE_FILTERS, type MuscleFilter } from '../exercise-picker-model';
import { Chip, ChipsContent, ChipsScroll } from './muscle-filter-chips.styles';

const CHIP_WIDTHS: Record<MuscleFilter, number> = {
  all: 46,
  chest: 58,
  back: 50,
  legs: 52,
  shoulders: 82,
  arms: 54,
};

const LABEL_KEYS = {
  all: 'stats.exercise_picker.filter.all',
  chest: 'stats.exercise_picker.filter.chest',
  back: 'stats.exercise_picker.filter.back',
  legs: 'stats.exercise_picker.filter.legs',
  shoulders: 'stats.exercise_picker.filter.shoulders',
  arms: 'stats.exercise_picker.filter.arms',
} as const satisfies Record<MuscleFilter, string>;

/**
 * Muscle filter chips (All / Chest / Back / Legs / Shoulders / Arms),
 * horizontally scrollable. Selected chip: white fill, #1C1C1E text.
 */
export function MuscleFilterChips({
  selected,
  onSelect,
}: {
  selected: MuscleFilter;
  onSelect: (filter: MuscleFilter) => void;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const idleText = theme.isDark ? '#C7C7CC' : '#3C3C43';
  return (
    <ChipsScroll>
      <ChipsContent>
        {MUSCLE_FILTERS.map((filter) => {
          const isSelected = filter === selected;
          return (
            <Chip
              key={filter}
              $selected={isSelected}
              $width={CHIP_WIDTHS[filter]}
              onPress={() => onSelect(filter)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={t(LABEL_KEYS[filter])}
            >
              <HomeText
                weight={isSelected ? fontWeight.semibold : fontWeight.medium}
                tracking={-0.15}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  color: isSelected ? '#1C1C1E' : idleText,
                }}
              >
                {t(LABEL_KEYS[filter])}
              </HomeText>
            </Chip>
          );
        })}
      </ChipsContent>
    </ChipsScroll>
  );
}
