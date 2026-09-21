import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import { SampleBadge } from '../shared/sample-badge';
import * as S from './hydration.styles';

/**
 * Sample hydration state, kept self-consistent: each droplet is 250 ml, so
 * 5 of 8 droplets = 1.25 L of a 2.0 L goal.
 */
const DROP_COUNT = 8;
const FILLED_DROPS = 5;
const ML_PER_DROP = 250;

export function HydrationSection() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const valueColor = dark ? '#FFFFFF' : '#1C1C1E';
  const unitColor = dark ? '#6C6C70' : '#6E6E73';
  const restColor = dark ? '#48484A' : '#AEAEB2';
  const emptyColor = dark ? '#FFFFFF' : '#000000';
  const currentLitres = ((FILLED_DROPS * ML_PER_DROP) / 1000).toFixed(2);

  return (
    <HomeCard radius={28} pad={16} style={{ height: 150, width: '100%' }}>
      <S.HeaderRow>
        <HomeText
          weight={fontWeight.bold}
          micro
          tracking={1.1}
          style={{ fontSize: 9, lineHeight: 11, color: dark ? '#86868B' : '#6E6E73' }}
        >
          {t('home.hydration.label').toUpperCase() /* en: "HYDRATION" */}
        </HomeText>
        <SampleBadge />
      </S.HeaderRow>
      <S.ValueRow>
        <HomeText
          weight={fontWeight.bold}
          tabular
          tracking={-0.7}
          style={{ fontSize: 24, lineHeight: 29, color: valueColor }}
        >
          {currentLitres}
        </HomeText>
        <HomeText
          weight={fontWeight.semibold}
          style={{ fontSize: 12, lineHeight: 15, color: unitColor, marginLeft: 4 }}
        >
          L
        </HomeText>
        <HomeText
          weight={fontWeight.medium}
          style={{ fontSize: 10.5, lineHeight: 14, color: restColor, marginLeft: 6 }}
        >
          / 2.0 L
        </HomeText>
      </S.ValueRow>
      <S.DropsRow>
        {Array.from({ length: DROP_COUNT }, (_, index) => (
          <S.Drop key={index} $filled={index < FILLED_DROPS} $emptyColor={emptyColor} />
        ))}
      </S.DropsRow>
      <S.AddPill>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.05}
          style={{ fontSize: 10.5, lineHeight: 14, color: '#5EDCF0' }}
        >
          {t('home.hydration.add') /* en: "+ Add 250 ml" */}
        </HomeText>
      </S.AddPill>
    </HomeCard>
  );
}
