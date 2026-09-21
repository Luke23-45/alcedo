import { ScrollView } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { TIMELINE_FILTERS, type TimelineFilter } from './timeline-data';
import { useTimelineT } from './timeline-i18n';
import * as S from './filter-chips.styles';

/**
 * Filter strip (Screen 1 spec): horizontal scroll, 28pt pills, the selected
 * pill inverted. The last pill bleeds past the right edge as an overflow
 * tell. Chips are 28pt tall visually; hitSlop expands the target to 44pt.
 */
export function FilterChips({
  selected,
  onSelect,
}: {
  selected: TimelineFilter;
  onSelect: (filter: TimelineFilter) => void;
}) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const t = useTimelineT();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {TIMELINE_FILTERS.map((filter) => {
        const label = t(filter.labelKey, filter.fallback);
        const isSelected = filter.id === selected;
        return (
          <S.Chip
            key={filter.id}
            $selected={isSelected}
            $dark={dark}
            onPress={() => onSelect(filter.id)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={t('feed.timeline.filter.a11y', `Show ${label} posts`, { label })}
          >
            <S.ChipLabel $selected={isSelected} $dark={dark}>
              {label}
            </S.ChipLabel>
          </S.Chip>
        );
      })}
    </ScrollView>
  );
}
