import { useTranslate } from '@tolgee/react';
import Svg, { Circle, Defs, G, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { alpha, fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import { SampleBadge } from '../shared/sample-badge';
import * as S from './activity-rings.styles';

/**
 * Reference ring geometry, measured off the SVG: stroke 10, radii 46/35.5/25,
 * center at (102, 250) in card coordinates. Dash = percent × 2πr exactly.
 */
const RING_STROKE = 10;
const RING_CANVAS = 102;
const RING_CENTER = RING_CANVAS / 2;
/** Card-relative ring center (102, 250); the hero pad is 20, so content-left is x=36. */
const RING_OFFSET_X = 102 - 36 - RING_CENTER;

const STREAK_DAYS = '13';
const PACE_TIME = '6:40 PM';

interface RingDatum {
  key: 'move' | 'exercise' | 'stand';
  label: string;
  value: number;
  goal: number;
  unit: string;
  radius: number;
  /** 2-stop ring gradient (gMove / gEx / gStand). */
  ringFrom: string;
  ringTo: string;
  /** Track tint per mode, extracted from the SVGs. */
  trackDark: string;
  trackLight: string;
  /** Value number color per mode. */
  valueDark: string;
  valueLight: string;
  /** 6pt bar gradient (gBarMove / gBarEx / gBarStand). */
  barFrom: string;
  barTo: string;
}

/** Static per-ring geometry and colors; labels resolve through i18n below. */
const RING_SPECS = [
  {
    key: 'move',
    labelKey: 'home.activity.move',
    value: 520,
    goal: 650,
    unitKey: 'home.activity.kcal',
    radius: 46,
    ringFrom: '#FF0A47',
    ringTo: '#FF7A96',
    trackDark: alpha('#FF0A47', 0.17),
    trackLight: alpha('#E00040', 0.14),
    valueDark: '#FF6A88',
    valueLight: '#D70015',
    barFrom: '#FF1F52',
    barTo: '#FF7A96',
  },
  {
    key: 'exercise',
    labelKey: 'home.activity.exercise',
    value: 42,
    goal: 60,
    unitKey: 'home.activity.min',
    radius: 35.5,
    ringFrom: '#8BE000',
    ringTo: '#D6FF52',
    trackDark: alpha('#A6FF00', 0.15),
    trackLight: alpha('#63C400', 0.16),
    valueDark: '#C3F53C',
    valueLight: '#4A9E00',
    barFrom: '#92E82A',
    barTo: '#D6FF52',
  },
  {
    key: 'stand',
    labelKey: 'home.activity.stand',
    value: 11,
    goal: 12,
    unitKey: 'home.activity.hr',
    radius: 25,
    ringFrom: '#009DFF',
    ringTo: '#2CE9F7',
    trackDark: alpha('#00D9E9', 0.16),
    trackLight: alpha('#00A6C9', 0.15),
    valueDark: '#5EDCF0',
    valueLight: '#0071A8',
    barFrom: '#17A9FF',
    barTo: '#2CE9F7',
  },
] as const;

/** Reference flame (ic-flame), drawn in the streak chip. */
function FlameGlyph() {
  return (
    <Svg width={11} height={15} viewBox="-6 -9 12 17">
      <Path
        d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -0.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -0.9 -1.3 -0.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"
        fill="#FF9F0A"
      />
    </Svg>
  );
}

/** Reference sparkle (ic-spark) ahead of the on-pace line. */
function SparkleGlyph() {
  return (
    <Svg width={11} height={11} viewBox="-5.2 -5.2 10.4 10.4">
      <Path
        d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z"
        fill="#FF9F0A"
        fillOpacity={0.9}
      />
    </Svg>
  );
}

/**
 * Today's activity rings. All numbers are illustrative samples — the app has no
 * health-data import — and every rendered figure (ring arc, bar width, text)
 * derives from the same per-ring constants above.
 */
export function ActivityRings() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const labelColor = theme.isDark ? '#F5F5F7' : '#1C1C1E';
  const restColor = theme.isDark ? '#6C6C70' : '#AEAEB2';

  const rings: RingDatum[] = RING_SPECS.map((spec) => ({
    ...spec,
    label: t(spec.labelKey),
    unit: t(spec.unitKey),
  }));

  return (
    <HomeCard hero>
      <S.CardContent>
        <S.CardHeaderRow>
          <S.LabelGroup>
            <HomeText
              variant="caption2"
              tone="secondary"
              weight={fontWeight.bold}
              micro
              tracking={1.35}
              style={{ fontSize: 10, lineHeight: 12 }}
            >
              {t('home.activity.title').toUpperCase() /* en: "TODAY'S ACTIVITY" */}
            </HomeText>
            <SampleBadge />
          </S.LabelGroup>
          <S.StreakChip>
            <FlameGlyph />
            <HomeText weight={fontWeight.bold} style={{ fontSize: 11, lineHeight: 13, color: '#FFB84D' }}>
              {STREAK_DAYS}
            </HomeText>
          </S.StreakChip>
        </S.CardHeaderRow>

        <S.ContentRow>
          <Svg
            width={RING_CANVAS}
            height={RING_CANVAS}
            viewBox={`0 0 ${RING_CANVAS} ${RING_CANVAS}`}
            style={{ marginLeft: RING_OFFSET_X }}
          >
            <Defs>
              {rings.map((ring) => (
                <SvgGradient key={ring.key} id={`ring-${ring.key}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={ring.ringFrom} />
                  <Stop offset="1" stopColor={ring.ringTo} />
                </SvgGradient>
              ))}
            </Defs>
            {rings.map((ring) => {
              const circumference = 2 * Math.PI * ring.radius;
              const pct = ring.value / ring.goal;
              return (
                <G key={ring.key}>
                  <Circle
                    cx={RING_CENTER}
                    cy={RING_CENTER}
                    r={ring.radius}
                    fill="none"
                    stroke={theme.isDark ? ring.trackDark : ring.trackLight}
                    strokeWidth={RING_STROKE}
                  />
                  <Circle
                    cx={RING_CENTER}
                    cy={RING_CENTER}
                    r={ring.radius}
                    fill="none"
                    stroke={`url(#ring-${ring.key})`}
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={`${pct * circumference} ${circumference}`}
                    transform={`rotate(-90 ${RING_CENTER} ${RING_CENTER})`}
                  />
                </G>
              );
            })}
          </Svg>

          <S.MetricsColumn>
            {rings.map((ring, index) => {
              const pct = ring.value / ring.goal;
              return (
                <S.MetricRow key={ring.key} style={index === rings.length - 1 ? { marginBottom: 0 } : undefined}>
                  <S.MetricLabelRow>
                    <HomeText
                      weight={fontWeight.semibold}
                      tracking={-0.1}
                      style={{ fontSize: 12, lineHeight: 15, color: labelColor }}
                    >
                      {ring.label}
                    </HomeText>
                    <HomeText weight={fontWeight.bold} tabular style={{ fontSize: 12, lineHeight: 15 }}>
                      <HomeText
                        weight={fontWeight.bold}
                        style={{ fontSize: 12, color: theme.isDark ? ring.valueDark : ring.valueLight }}
                      >
                        {ring.value}
                      </HomeText>
                      <HomeText weight={fontWeight.medium} style={{ fontSize: 12, color: restColor }}>
                        /{ring.goal} {ring.unit}
                      </HomeText>
                    </HomeText>
                  </S.MetricLabelRow>
                  <S.BarTrack>
                    <S.BarFill $from={ring.barFrom} $to={ring.barTo} $pct={pct} />
                  </S.BarTrack>
                </S.MetricRow>
              );
            })}
          </S.MetricsColumn>
        </S.ContentRow>

        <S.PaceRow>
          <SparkleGlyph />
          <HomeText
            weight={fontWeight.medium}
            style={{
              fontSize: 10.5,
              lineHeight: 13,
              color: theme.isDark ? '#86868B' : '#6E6E73',
            }}
          >
            {t('home.activity.on_pace', { time: PACE_TIME })}
          </HomeText>
        </S.PaceRow>
      </S.CardContent>
    </HomeCard>
  );
}
