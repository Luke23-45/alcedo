import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { Switch } from '@/components/presentation/foundation/switch';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { fontWeight } from '@/styles/theme';
import { useHistoryTranslate } from '../history-i18n';
import { Modal, ScrollView } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { HistoryFilters } from './filter-logic';
import { EMPTY_FILTERS } from './filter-logic';
import {
  Backdrop,
  Chip,
  ChipWrap,
  ClearButton,
  ClearQuery,
  DoneButton,
  Grabber,
  SearchBox,
  SearchInput,
  SheetBody,
  SheetFooter,
  SheetHeader,
  SheetWrap,
  ToggleRow,
} from './filter-sheet.styles';

function SearchGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M11 4a7 7 0 1 0 4.9 12L21 21l-1.4 1.4-5.1-5.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
        fill={theme.color.content.tertiary}
      />
    </Svg>
  );
}

function ClearGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Path d="M3 3l8 8M11 3l-8 8" stroke={theme.color.content.tertiary} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export type { HistoryFilters };
export { EMPTY_FILTERS };

export function FilterSheet({
  visible,
  onClose,
  filters,
  onFiltersChange,
  workoutTypes,
  matchCount,
}: {
  visible: boolean;
  onClose: () => void;
  filters: HistoryFilters;
  onFiltersChange: (filters: HistoryFilters) => void;
  /** Distinct real session names, newest first. */
  workoutTypes: string[];
  matchCount: number;
}) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();
  const insets = useSafeAreaInsets();
  const reduceMotion = useAppReducedMotion();

  const toggleType = (name: string) => {
    onFiltersChange({
      ...filters,
      types: filters.types.includes(name) ? filters.types.filter((x) => x !== name) : [...filters.types, name],
    });
  };

  return (
    <Modal visible={visible} transparent animationType={reduceMotion ? 'none' : 'slide'} onRequestClose={onClose}>
      <Backdrop onPress={onClose} />
      <SheetWrap style={{ paddingBottom: insets.bottom }}>
        <HomeGradient variant="cardBody" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Grabber />
        <SheetHeader>
          <HomeText
            weight={fontWeight.semibold}
            tracking={-0.3}
            style={{
              fontSize: 17,
              lineHeight: 22,
              color: theme.color.content.primary,
            }}
          >
            {t('history.v2.filter.title')}
          </HomeText>
          <HomeText
            weight={fontWeight.medium}
            style={{
              fontSize: 13,
              lineHeight: 17,
              color: theme.color.content.secondary,
            }}
          >
            {t('history.v2.filter.match_count', {
              count: matchCount.toString(),
            })}
          </HomeText>
        </SheetHeader>
        <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ paddingBottom: 4 }}>
          <SheetBody>
            <SearchBox>
              <SearchGlyph />
              <SearchInput
                value={filters.query}
                onChangeText={(query) => onFiltersChange({ ...filters, query })}
                placeholder={t('history.v2.filter.search.placeholder')}
                placeholderTextColor={theme.color.content.tertiary}
                returnKeyType="search"
                autoCorrect={false}
                testID="history-filter-search"
              />
              {filters.query !== '' && (
                <ClearQuery
                  onPress={() => onFiltersChange({ ...filters, query: '' })}
                  accessibilityRole="button"
                  accessibilityLabel={t('history.v2.filter.search.clear.accessibility')}
                >
                  <ClearGlyph />
                </ClearQuery>
              )}
            </SearchBox>
            {workoutTypes.length > 0 && (
              <SheetBody style={{ padding: 0, gap: 0 }}>
                <HomeText
                  weight={fontWeight.semibold}
                  tracking={-0.2}
                  style={{
                    fontSize: 13,
                    lineHeight: 17,
                    color: theme.color.content.primary,
                  }}
                >
                  {t('history.v2.filter.workout_type')}
                </HomeText>
                <ChipWrap>
                  {workoutTypes.map((name) => {
                    const selected = filters.types.includes(name);
                    return (
                      <Chip
                        key={name}
                        $selected={selected}
                        onPress={() => toggleType(name)}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={name}
                        testID={`history-filter-type-${name}`}
                      >
                        <HomeText
                          weight={selected ? fontWeight.semibold : fontWeight.medium}
                          numberOfLines={1}
                          style={{
                            fontSize: 13,
                            lineHeight: 17,
                            color: selected ? theme.home.seeAll : theme.color.content.secondary,
                          }}
                        >
                          {name}
                        </HomeText>
                      </Chip>
                    );
                  })}
                </ChipWrap>
              </SheetBody>
            )}
            <ToggleRow>
              <HomeText
                weight={fontWeight.semibold}
                tracking={-0.2}
                style={{
                  fontSize: 15,
                  lineHeight: 20,
                  color: theme.color.content.primary,
                }}
              >
                {t('history.v2.filter.prs_only')}
              </HomeText>
              <Switch
                value={filters.prsOnly}
                onValueChange={(prsOnly) => onFiltersChange({ ...filters, prsOnly })}
                testID="history-filter-prs-only"
              />
            </ToggleRow>
          </SheetBody>
        </ScrollView>
        <SheetFooter>
          <ClearButton
            onPress={() => onFiltersChange(EMPTY_FILTERS)}
            accessibilityRole="button"
            testID="history-filter-clear"
          >
            <HomeText weight={fontWeight.semibold} style={{ fontSize: 15, lineHeight: 20, color: theme.home.seeAll }}>
              {t('history.v2.filter.clear')}
            </HomeText>
          </ClearButton>
          <DoneButton onPress={onClose} accessibilityRole="button" testID="history-filter-done">
            <HomeGradient
              variant="brand"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.25}
              style={{ fontSize: 15, lineHeight: 20, color: '#FFFFFF' }}
            >
              {t('history.v2.filter.done')}
            </HomeText>
          </DoneButton>
        </SheetFooter>
      </SheetWrap>
    </Modal>
  );
}
