import { router } from 'expo-router';
import { Path, Rect, Svg } from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { trendsPalette } from '../trends-colors';
import {
  CalendarButton,
  CalendarCircle,
  HeaderRow,
  TitleBlock,
} from './trends-header.styles';

/**
 * In-content header: 32pt display title, rolling-7-day subtitle, and a
 * 44pt calendar target that opens the History tab (the closest existing
 * history capability).
 */
export function TrendsHeader({ subtitle }: { subtitle: string }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const palette = trendsPalette(theme.isDark);

  return (
    <HeaderRow>
      <TitleBlock>
        <HomeText
          variant="largeTitle"
          weight={fontWeight.bold}
          tracking={-0.95}
          style={{ fontSize: 32, lineHeight: 34, color: palette.primary }}
        >
          {t('trends.header.title')}
        </HomeText>
        <HomeText
          weight={fontWeight.medium}
          style={{
            fontSize: 11.5,
            lineHeight: 15,
            marginTop: 4,
            color: palette.secondary,
          }}
        >
          {subtitle}
        </HomeText>
      </TitleBlock>
      <CalendarButton
        onPress={() => router.push('/history')}
        accessibilityRole="button"
        accessibilityLabel={t('trends.header.calendar.accessibility')}
      >
        <CalendarCircle $dark={theme.isDark}>
          <Svg width={15} height={17} viewBox="-11 -12 22 24">
            <Rect
              x={-9}
              y={-7.4}
              width={18}
              height={16}
              rx={3.6}
              fill="none"
              stroke={palette.calendarIcon}
              strokeWidth={1.7}
            />
            <Path
              d="M-9 -2.4 H9"
              fill="none"
              stroke={palette.calendarIcon}
              strokeWidth={1.7}
              strokeLinecap="round"
            />
            <Path
              d="M-4.4 -10.4 V-5.2"
              fill="none"
              stroke={palette.calendarIcon}
              strokeWidth={1.7}
              strokeLinecap="round"
            />
            <Path
              d="M4.4 -10.4 V-5.2"
              fill="none"
              stroke={palette.calendarIcon}
              strokeWidth={1.7}
              strokeLinecap="round"
            />
          </Svg>
        </CalendarCircle>
      </CalendarButton>
    </HeaderRow>
  );
}
