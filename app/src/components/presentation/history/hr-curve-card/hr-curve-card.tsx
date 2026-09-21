import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { Circle, Defs, LinearGradient, Path, Rect, Stop, Text } from 'react-native-svg';
import * as S from './hr-curve-card.styles';

/**
 * Reference geometry — five equal 13.5pt bands from HRmax 180, so
 * y(bpm) = 767.5 − ((bpm − 90) / 18) × 13.5. The bands ARE the scale: the
 * curve is read against them, not against an axis.
 */
const BAND_HEIGHT = 13.5;
const BANDS = [
  {
    zone: 'Z1',
    y: 767.5,
    fill: '#8E8E93',
    label: '#98989F',
    labelY: 763.5,
    dark: 0.06,
    light: 0.1,
  },
  {
    zone: 'Z2',
    y: 754,
    fill: '#30D158',
    label: '#4ADE80',
    labelY: 750,
    dark: 0.07,
    light: 0.11,
  },
  {
    zone: 'Z3',
    y: 740.5,
    fill: '#FFD60A',
    label: '#FFE14D',
    labelY: 736.5,
    dark: 0.07,
    light: 0.12,
  },
  {
    zone: 'Z4',
    y: 727,
    fill: '#FF9F0A',
    label: '#FFB84D',
    labelY: 723,
    dark: 0.08,
    light: 0.14,
  },
  {
    zone: 'Z5',
    y: 713.5,
    fill: '#FF3B30',
    label: '#FF6B60',
    labelY: 709.5,
    dark: 0.09,
    light: 0.16,
  },
];
const TOP_FILL = { y: 700, fill: '#FF3B30', dark: 0.13, light: 0.18 };

/** Reference: the 13 contract samples, mean 128.7, max 164, HRmax 180. */
const CURVE =
  'M52 770.5 L64.55 764.5 Q77.1 758.5 89.65 751.75 Q102.2 745 114.75 739 ' +
  'Q127.3 733 139.8 736 Q152.3 739 164.85 733.4 Q177.4 727.8 189.95 731.55 ' +
  'Q202.5 735.3 215.05 728.9 Q227.6 722.5 240.15 725.9 Q252.7 729.3 265.25 720.65 ' +
  'Q277.8 712 290.3 718.75 Q302.8 725.5 315.35 733.75 Q327.9 742 340.45 751 L353 760';
const AREA = `${CURVE} L353 790 L52 790 Z`;

/**
 * The heart-rate curve is contract sample data — Alcedo does not sync HR —
 * so the whole card renders under a SampleBadge (home convention). The zone
 * geometry, nodes, and duration labels are verbatim from the reference.
 */
export function HrCurveCard() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  const strokeStops = dark ? ['#0A84FF', '#FF9F0A', '#FF3B30'] : ['#007AFF', '#E07800', '#D70015'];
  const halo = dark ? '#131316' : '#FFFFFF';

  return (
    <HomeCard elev="card" radius={30} pad={16}>
      <S.CardInner>
        <S.TitleRow>
          <S.Title>{t('history.session_detail.hr.title', 'Heart Rate')}</S.Title>
          <SampleBadge compact />
        </S.TitleRow>
        <S.Subtitle>{t('history.session_detail.hr.subtitle', 'Avg 128 · Max 164 · 22 min in Z3+')}</S.Subtitle>
        <S.Plot>
          <S.PlotSvg viewBox="36 690 321 128">
            <Defs>
              {/*
               * Reference: the spec's "hr" gradient — diagonal objectBoundingBox
               * (0,1)→(1,0), blue at the start node, red at the max node.
               */}
              <LinearGradient id="hrStroke" x1={0} y1={1} x2={1} y2={0}>
                <Stop offset={0} stopColor={strokeStops[0]} />
                <Stop offset={0.5} stopColor={strokeStops[1]} />
                <Stop offset={1} stopColor={strokeStops[2]} />
              </LinearGradient>
              <LinearGradient id="hrArea" gradientUnits="userSpaceOnUse" x1={0} y1={700} x2={0} y2={790}>
                <Stop offset={0} stopColor="#FF3B30" stopOpacity={0.3} />
                <Stop offset={1} stopColor="#FF3B30" stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {BANDS.map((band) => (
              <Rect
                key={band.zone}
                x={52}
                y={band.y}
                width={301}
                height={BAND_HEIGHT}
                fill={band.fill}
                fillOpacity={dark ? band.dark : band.light}
              />
            ))}
            <Rect
              x={52}
              y={TOP_FILL.y}
              width={301}
              height={BAND_HEIGHT}
              fill={TOP_FILL.fill}
              fillOpacity={dark ? TOP_FILL.dark : TOP_FILL.light}
            />

            {BANDS.map((band) => (
              <Text
                key={band.zone}
                x={44}
                y={band.labelY}
                fontSize={7.5}
                fontWeight="700"
                letterSpacing={0.4}
                fill={band.label}
                textAnchor="middle"
              >
                {band.zone}
              </Text>
            ))}

            <Path d={AREA} fill="url(#hrArea)" />
            <Path
              d={CURVE}
              fill="none"
              stroke="url(#hrStroke)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <Circle cx={52} cy={770.5} r={3.6} fill="#0A84FF" stroke={halo} strokeWidth={2} />
            <Circle cx={353} cy={760} r={3.6} fill="#FF9F0A" stroke={halo} strokeWidth={2} />

            {/*
             * Reference: the max node carries an feDropShadow red glow (filter
             * "fh"). React Native SVG has no filter support, so the glow is a
             * flat underlay circle — same hue, same center, soft by radius.
             */}
            <Circle cx={277.8} cy={712} r={8.5} fill="#FF3B30" fillOpacity={0.22} />
            <Circle cx={277.8} cy={712} r={5} fill="#FF3B30" stroke={halo} strokeWidth={2.2} />
            <Text
              x={277.8}
              y={703}
              fontSize={9}
              fontWeight="700"
              letterSpacing={-0.1}
              fill="#FF6B60"
              textAnchor="middle"
            >
              164
            </Text>

            <Text x={52} y={808} fontSize={9} fontWeight="600" letterSpacing={0.2} fill="#6C6C70" textAnchor="start">
              0:00
            </Text>
            <Text
              x={202.5}
              y={808}
              fontSize={9}
              fontWeight="600"
              letterSpacing={0.2}
              fill="#6C6C70"
              textAnchor="middle"
            >
              22:36
            </Text>
            <Text x={353} y={808} fontSize={9} fontWeight="600" letterSpacing={0.2} fill="#6C6C70" textAnchor="end">
              45:12
            </Text>
          </S.PlotSvg>
        </S.Plot>
      </S.CardInner>
    </HomeCard>
  );
}
