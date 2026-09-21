import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { fontWeight } from '@/styles/theme';
import { useHistoryTranslate } from '../history-i18n';
import { Path, Svg } from 'react-native-svg';
import { FilterCircle, FilterDot, NavRow, NavTarget, TitleBlock } from './history-header.styles';

function BackChevron() {
  const theme = useAppTheme();
  return (
    <Svg width={12} height={16} viewBox="-6 -8 12 16">
      <Path
        d="M2 -5 L-2.6 0 L2 5"
        fill="none"
        stroke={theme.isDark ? '#8E8E93' : '#8E8E93'}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FilterGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={20} height={20} viewBox="-10 -10 20 20">
      <Path
        d="M-8 -5 H8 M-8 0 H8 M-8 5 H8"
        fill="none"
        stroke={theme.isDark ? '#C7C7CC' : '#636366'}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function HistoryHeader({
  totalSessions,
  earliestMonth,
  filterActive,
  canGoBack,
  onBack,
  onFilter,
}: {
  /** Real lifetime session count across the whole history. */
  totalSessions: number;
  /** Already-formatted earliest logged month ("March 2024"), if any. */
  earliestMonth: string | undefined;
  filterActive: boolean;
  canGoBack: boolean;
  onBack: () => void;
  onFilter: () => void;
}) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();

  return (
    <>
      <NavRow>
        {canGoBack ? (
          <NavTarget
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t('history.v2.back.accessibility')}
            testID="history-back"
          >
            <BackChevron />
          </NavTarget>
        ) : (
          <NavTarget />
        )}
        <NavTarget
          onPress={onFilter}
          accessibilityRole="button"
          accessibilityLabel={t('history.v2.filter.accessibility')}
          testID="history-filter"
        >
          <FilterCircle $dark={theme.isDark}>
            <FilterGlyph />
            {filterActive && <FilterDot />}
          </FilterCircle>
        </NavTarget>
      </NavRow>
      <TitleBlock>
        <HomeText
          variant="largeTitle"
          weight={fontWeight.bold}
          tracking={-0.95}
          style={{
            fontSize: 32,
            lineHeight: 36,
            color: theme.color.content.primary,
          }}
        >
          {t('history.v2.title')}
        </HomeText>
        {earliestMonth !== undefined && (
          <HomeText
            weight={fontWeight.medium}
            style={{
              fontSize: 11.5,
              lineHeight: 15,
              marginTop: 4,
              color: theme.color.content.secondary,
            }}
          >
            {totalSessions === 1
              ? t('history.v2.subtitle.one', { month: earliestMonth })
              : t('history.v2.subtitle.other', {
                  count: totalSessions.toString(),
                  month: earliestMonth,
                })}
          </HomeText>
        )}
      </TitleBlock>
    </>
  );
}
