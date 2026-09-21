import { useId } from 'react';
import { Defs, LinearGradient, Path, Rect, Stop, Svg } from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { CardAura } from '../shared/card-aura';
import { trendsPalette } from '../trends-colors';
import {
  BetaPill,
  IconWrap,
  InsightBody,
  InsightEdge,
  InsightRow,
  InsightText,
  SparkWrap,
  TopRow,
} from './trend-insights.styles';

const SPARK =
  'M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z';

/**
 * Trend Insights: at most two rule-based insights, each tracing to a real
 * computed number (WoW volume swing, worst under-target muscle, or the
 * streak fallback). Iridescent edge, purple/cyan card auras, BETA pill.
 */
export function TrendInsights({
  insights,
  sampled,
}: {
  insights: { line1: string; line2: string }[];
  sampled: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const palette = trendsPalette(dark);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <InsightEdge>
      <InsightBody>
        <CardAura
          width={361}
          height={152}
          top={-12}
          left={-20}
          stops={[
            { cx: 330, cy: 25, r: 155, color: '#8E7BFF', opacity: 0.26 },
            { cx: 50, cy: 145, r: 130, color: '#2CE9F7', opacity: 0.14 },
          ]}
        />
        <TopRow>
          <IconWrap>
            <Svg width={34} height={34} viewBox="0 0 34 34">
              <Defs>
                <LinearGradient id={`insCo${uid}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#8E7BFF" />
                  <Stop offset="1" stopColor="#FF5AC8" />
                </LinearGradient>
                <LinearGradient id={`insGl${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.3} />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Rect width={34} height={34} rx={12} fill={`url(#insCo${uid})`} />
              <Rect
                width={34}
                height={17}
                rx={12}
                fill={`url(#insGl${uid})`}
                opacity={0.45}
              />
              <Path
                d={SPARK}
                fill="#FFFFFF"
                transform="translate(17,17) scale(0.95)"
              />
            </Svg>
          </IconWrap>
          <HomeText
            weight={fontWeight.bold}
            micro
            tracking={1.3}
            style={{
              fontSize: 9,
              lineHeight: 12,
              marginLeft: 10,
              color: dark ? '#A78BFA' : '#6D5DF6',
            }}
          >
            {t('trends.insights.title')}
          </HomeText>
          {sampled ? <SampleBadge compact /> : null}
          <BetaPill $dark={dark}>
            <HomeText
              weight={fontWeight.bold}
              micro
              tracking={0.8}
              style={{ fontSize: 8.5, lineHeight: 11, color: palette.dim }}
            >
              {t('trends.insights.beta')}
            </HomeText>
          </BetaPill>
        </TopRow>

        {insights.map((insight, index) => (
          <InsightRow key={index} $first={index === 0}>
            <SparkWrap>
              <Svg width={12} height={12} viewBox="-6 -6 12 12">
                <Path
                  d={SPARK}
                  fill={dark ? '#FF9F0A' : '#E07800'}
                  transform="scale(0.55)"
                />
              </Svg>
            </SparkWrap>
            <InsightText>
              <HomeText
                weight={fontWeight.medium}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  color: dark ? '#E5E5EA' : palette.name,
                }}
              >
                {insight.line1}
              </HomeText>
              <HomeText
                weight={fontWeight.medium}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  marginTop: 1,
                  color: dark ? '#E5E5EA' : palette.name,
                }}
              >
                {insight.line2}
              </HomeText>
            </InsightText>
          </InsightRow>
        ))}
      </InsightBody>
    </InsightEdge>
  );
}
