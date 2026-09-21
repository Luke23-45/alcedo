import { Path, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { trendsPalette } from '../trends-colors';
import { ActionPressable, HeaderRow } from './trends-section-header.styles';

/**
 * Section label row: 10/700/+1.35 uppercase micro-label with an optional
 * right-side action ("See All" + chevron) or badge. Geometry matches the
 * reference: label at x=24, action text ending at x=359.
 */
export function TrendsSectionHeader({
  label,
  actionLabel,
  onAction,
  actionAccessibilityLabel,
  badge,
}: {
  label: string;
  actionLabel?: string;
  onAction?: () => void;
  actionAccessibilityLabel?: string;
  badge?: React.ReactNode;
}) {
  const theme = useAppTheme();
  const palette = trendsPalette(theme.isDark);
  const seeAll = theme.home.seeAll;

  return (
    <HeaderRow>
      <HomeText
        weight={fontWeight.bold}
        micro
        tracking={1.35}
        style={{ fontSize: 10, lineHeight: 13, color: palette.secondary }}
      >
        {label}
      </HomeText>
      {actionLabel && onAction ? (
        <ActionPressable
          onPress={onAction}
          hitSlop={{ top: 15, bottom: 15, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
        >
          <HomeText
            weight={fontWeight.semibold}
            tracking={-0.1}
            style={{ fontSize: 11.5, lineHeight: 14, color: seeAll }}
          >
            {actionLabel}
          </HomeText>
          <Svg width={7} height={10} viewBox="0 0 7 10">
            <Path
              d="M1.5 1.5 L5.5 5 L1.5 8.5"
              fill="none"
              stroke={seeAll}
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </ActionPressable>
      ) : (
        badge
      )}
    </HeaderRow>
  );
}
