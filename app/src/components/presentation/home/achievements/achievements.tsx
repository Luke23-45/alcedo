import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import { G, Path, Rect, Svg } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SectionHeader } from '../shared/section-header';
import * as S from './achievements.styles';

/**
 * Reference badges (gBadgeA–E): six 46pt circles, five unlocked with 2-stop
 * gradients and a top shine, one locked. Light stops are deepened for white.
 * Glyphs are the reference icons in white.
 */
const BADGE_GRADIENTS: { dark: [string, string]; light: [string, string] }[] = [
  { dark: ['#FFC24A', '#FF6A2D'], light: ['#FFB03A', '#F2662B'] },
  { dark: ['#FF7A96', '#E0083F'], light: ['#FF5C7A', '#D70015'] },
  { dark: ['#FFF0BE', '#D9A441'], light: ['#FFF0BE', '#D9A441'] },
  { dark: ['#8DF5FF', '#0095FF'], light: ['#5AC8FA', '#0071C9'] },
  { dark: ['#7BE88A', '#1E8E3E'], light: ['#4CD964', '#248A3D'] },
];

type Glyph = 'flame' | 'dumbbell' | 'star' | 'bolt' | 'heart';

function BadgeGlyph({ glyph }: { glyph: Glyph }): ReactNode {
  switch (glyph) {
    case 'flame':
      return (
        <Svg width={12} height={18} viewBox="-6 -9 12 18">
          <Path
            d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -0.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -0.9 -1.3 -0.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"
            fill="#FFFFFF"
          />
        </Svg>
      );
    case 'dumbbell':
      return (
        <Svg width={22} height={14} viewBox="-14 -9 28 18">
          <G fill="#FFFFFF">
            <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
            <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
            <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
            <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
            <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
          </G>
        </Svg>
      );
    case 'star':
      return (
        <Svg width={19} height={19} viewBox="-10 -10 20 20">
          <Path
            d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"
            fill="#FFFFFF"
          />
        </Svg>
      );
    case 'bolt':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" fill="#FFFFFF" />
        </Svg>
      );
    case 'heart':
      return (
        <Svg width={18} height={14} viewBox="-9 -7 18 14">
          <Path
            d="M0 5.9 C-6.7 1.5 -8.0 -2.5 -5.9 -4.9 C-4.2 -6.7 -1.5 -6.4 0 -4.3 C1.5 -6.4 4.2 -6.7 5.9 -4.9 C8.0 -2.5 6.7 1.5 0 5.9 Z"
            fill="#FFFFFF"
          />
        </Svg>
      );
  }
}

function LockGlyph() {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#48484A"
      strokeWidth={2.2}
      strokeLinecap="round"
    >
      <Path d="M8 11V7a4 4 0 018 0v4" />
      <Path d="M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z" />
    </Svg>
  );
}

const GLYPHS: Glyph[] = ['flame', 'dumbbell', 'star', 'bolt', 'heart'];

export function AchievementsSection() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  return (
    <>
      <SectionHeader label={t('home.achievements.label') /* en: "Achievements" */} sample />
      <S.BadgeRow
        accessibilityRole="list"
        accessibilityLabel={t('home.achievements.label') /* en: "Achievements" */}
      >
        {GLYPHS.map((glyph, i) => (
          <S.Badge
            key={glyph}
            colors={dark ? BADGE_GRADIENTS[i]!.dark : BADGE_GRADIENTS[i]!.light}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderCurve: 'continuous' }}
          >
            <S.Shine />
            <BadgeGlyph glyph={glyph} />
          </S.Badge>
        ))}
        <S.LockedBadge accessibilityRole="image">
          <LockGlyph />
        </S.LockedBadge>
      </S.BadgeRow>
    </>
  );
}
