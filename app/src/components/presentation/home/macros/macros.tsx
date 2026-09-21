import { useTranslate } from '@tolgee/react';
import { Circle, Defs, LinearGradient as SvgGradient, Stop, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeGradient } from '../shared/home-gradient';
import { HomeText } from '../shared/home-text';
import { SampleBadge } from '../shared/sample-badge';
import * as S from './macros.styles';

/**
 * Sample macro state, kept self-consistent and matching the reference:
 * 125g protein + 200g carbs + 60g fat = 125*4 + 200*4 + 60*9 = 1,840 kcal,
 * which drives the footer bar against the 2,400 kcal goal.
 */
const PROTEIN_G = 125;
const CARBS_G = 200;
const FAT_G = 60;
const KCAL_GOAL = 2400;
const RING_R = 19;

const MACROS = [
  {
    key: 'protein',
    grams: PROTEIN_G,
    letterKey: 'home.macros.protein_letter',
    track: '#FF2D55',
    trackAlpha: 0.16,
    gradient: ['#FF2D55', '#FF9FAC'] as const,
    pct: 0.82,
  },
  {
    key: 'carbs',
    grams: CARBS_G,
    letterKey: 'home.macros.carbs_letter',
    track: '#FFD60A',
    trackAlpha: 0.15,
    gradient: ['#E0A800', '#FFE14D'] as const,
    pct: 0.64,
  },
  {
    key: 'fat',
    grams: FAT_G,
    letterKey: 'home.macros.fat_letter',
    track: '#A78BFA',
    trackAlpha: 0.16,
    gradient: ['#7B5CFF', '#C4B5FD'] as const,
    pct: 0.45,
  },
] as const;

function MacroRing({
  gradient,
  track,
  trackAlpha,
  pct,
}: {
  gradient: readonly [string, string];
  track: string;
  trackAlpha: number;
  pct: number;
}) {
  const c = 2 * Math.PI * RING_R;
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48">
      <Defs>
        <SvgGradient id={`macro-${gradient[0]}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={gradient[0]} />
          <Stop offset="1" stopColor={gradient[1]} />
        </SvgGradient>
      </Defs>
      <Circle cx={24} cy={24} r={RING_R} fill="none" stroke={track} strokeOpacity={trackAlpha} strokeWidth={5.5} />
      <Circle
        cx={24}
        cy={24}
        r={RING_R}
        fill="none"
        stroke={`url(#macro-${gradient[0]})`}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeDasharray={`${pct * c} ${c}`}
        transform="rotate(-90 24 24)"
      />
    </Svg>
  );
}

export function MacrosSection() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const valueColor = dark ? '#FFFFFF' : '#1C1C1E';
  const letterColor = dark ? '#86868B' : '#6E6E73';
  const barLabelColor = dark ? '#6C6C70' : '#AEAEB2';
  const totalKcal = PROTEIN_G * 4 + CARBS_G * 4 + FAT_G * 9;
  const barPct = (totalKcal / KCAL_GOAL) * 100;

  return (
    <HomeCard radius={28} pad={16} style={{ height: 150, width: '100%' }}>
      <S.HeaderRow>
        <HomeText
          weight={fontWeight.bold}
          micro
          tracking={1.1}
          style={{ fontSize: 9, lineHeight: 11, color: dark ? '#86868B' : '#6E6E73' }}
        >
          {t('home.macros.label').toUpperCase() /* en: "MACROS" */}
        </HomeText>
        <SampleBadge />
      </S.HeaderRow>
      <S.RingsRow>
        {MACROS.map((m) => (
          <S.RingSlot key={m.key}>
            <MacroRing gradient={m.gradient} track={m.track} trackAlpha={m.trackAlpha} pct={m.pct} />
            <S.RingCenter>
              <HomeText
                weight={fontWeight.bold}
                tabular
                tracking={-0.2}
                style={{ fontSize: 9.5, lineHeight: 12, color: valueColor }}
              >
                {m.grams.toLocaleString('en-US')}
              </HomeText>
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.5}
                style={{ fontSize: 9.5, lineHeight: 12, color: letterColor }}
              >
                {t(m.letterKey) /* en: "P" / "C" / "F" */}
              </HomeText>
            </S.RingCenter>
          </S.RingSlot>
        ))}
      </S.RingsRow>
      <S.BarTrack>
        <HomeGradient variant="brand" style={{ width: `${barPct}%`, height: '100%', borderRadius: 2.5 }} />
      </S.BarTrack>
      <HomeText weight={fontWeight.medium} style={{ fontSize: 10, lineHeight: 13, color: barLabelColor, marginTop: 6 }}>
        {
          t('home.macros.total', {
            eaten: totalKcal.toLocaleString('en-US'),
            goal: KCAL_GOAL.toLocaleString('en-US'),
          }) /* en: "{eaten} / {goal} kcal" */
        }
      </HomeText>
    </HomeCard>
  );
}
