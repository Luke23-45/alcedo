import type { ReactNode } from 'react';
import { G, Path, Rect, Svg } from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { fontWeight } from '@/styles/theme';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import * as S from './today-session.styles';

export interface TodaySessionProps {
  title: string;
  subtitle: string;
  startLabel: string;
  /** Optional difficulty pill (e.g. "INTERMEDIATE"); hidden when the session has no difficulty. */
  difficultyLabel?: string;
  onStart: () => void;
  onNutrition?: () => void;
  onTimer?: () => void;
}

/** Reference ic-dumbbell: five rounded rects, drawn at 1.25× in the badge. */
function DumbbellGlyph() {
  return (
    <Svg width={33} height={21} viewBox="-14 -9 28 18">
      <G fill="#FFFFFF">
        <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
        <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
        <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
      </G>
    </Svg>
  );
}

/** Reference ic-play triangle. */
function PlayGlyph({ size = 14, stroke = 2.6 }: { size?: number; stroke?: number }) {
  return (
    <Svg width={size} height={size} viewBox="-8 -8 16 16">
      <Path
        d="M-4.4 -6.6 L7.4 0 L-4.4 6.6 Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Reference ic-meal: fork (strokes) + spoon (filled), tinted per action. */
function MealGlyph({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="-10 -10 20 20">
      <G fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-7.4 -8.6 V-3.8" />
        <Path d="M-4.8 -8.6 V-3.8" />
        <Path d="M-2.2 -8.6 V-3.8" />
        <Path d="M-7.4 -3.8 C-7.4 -1.2 -6.2 0.2 -4.8 0.2 C-3.4 0.2 -2.2 -1.2 -2.2 -3.8" />
        <Path d="M-4.8 0.2 V8.6" />
      </G>
      <Path d="M2.6 -8.6 C5.8 -5.4 7.0 -1.6 6.4 1.4 L4.4 2.6 V8.6 H2.6 Z" fill={color} />
    </Svg>
  );
}

/** Reference ic-stopwatch, tinted per action. */
function StopwatchGlyph({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="-10 -10 20 20">
      <G fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M0 1.8 m-7.4 0 a7.4 7.4 0 1 0 14.8 0 a7.4 7.4 0 1 0 -14.8 0" />
        <Path d="M0 1.8 V-2.4" />
        <Path d="M-2.4 -9.4 H2.4" />
        <Path d="M0 -9.4 V-5.6" />
        <Path d="M6.4 -4.6 L8.2 -6.4" />
      </G>
    </Svg>
  );
}

/** A secondary quick-action tile: pressable when a handler exists, plain view otherwise. */
function SecondaryTile({ label, glyph, onPress }: { label: string; glyph: ReactNode; onPress?: () => void }) {
  const theme = useAppTheme();
  const body = (
    <S.TileBody>
      {glyph}
      <HomeText
        weight={fontWeight.semibold}
        tracking={-0.1}
        style={{ fontSize: 11.5, lineHeight: 14, color: theme.isDark ? '#F5F5F7' : '#1C1C1E', marginTop: 8 }}
      >
        {label}
      </HomeText>
    </S.TileBody>
  );
  if (onPress) {
    return (
      <S.TilePressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
        {body}
      </S.TilePressable>
    );
  }
  return <S.TilePlain>{body}</S.TilePlain>;
}

export function TodaySession({
  title,
  subtitle,
  startLabel,
  difficultyLabel,
  onStart,
  onNutrition,
  onTimer,
}: TodaySessionProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const labelColor = theme.isDark ? '#86868B' : '#8E8E93';
  const titleColor = theme.isDark ? '#FFFFFF' : '#1C1C1E';
  const subtitleColor = theme.isDark ? '#98989F' : '#6E6E73';
  const chipColor = theme.isDark ? '#C7C7CC' : '#48484A';

  return (
    <>
      <HomeCard pad={14} style={{ height: 104 }}>
        <S.CardBody>
          <S.IconBadge>
            <S.Gloss />
            <DumbbellGlyph />
          </S.IconBadge>
          <S.TextColumn>
            <HomeText
              weight={fontWeight.bold}
              micro
              tracking={1.25}
              style={{ fontSize: 9, lineHeight: 11, color: labelColor }}
            >
              {t('home.today_session.label').toUpperCase() /* en: "TODAY'S SESSION" */}
            </HomeText>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.35}
              numberOfLines={1}
              style={{ fontSize: 17, lineHeight: 21, color: titleColor, marginTop: 4 }}
            >
              {title}
            </HomeText>
            <HomeText
              weight={fontWeight.medium}
              numberOfLines={1}
              style={{ fontSize: 11.5, lineHeight: 14, color: subtitleColor, marginTop: 3 }}
            >
              {subtitle}
            </HomeText>
            {difficultyLabel != null && (
              <S.DifficultyChip>
                <HomeText
                  weight={fontWeight.bold}
                  micro
                  tracking={0.55}
                  style={{ fontSize: 9.5, lineHeight: 12, color: chipColor }}
                >
                  {difficultyLabel.toUpperCase()}
                </HomeText>
              </S.DifficultyChip>
            )}
          </S.TextColumn>
          <S.PlayPressable
            onPress={onStart}
            accessibilityRole="button"
            accessibilityLabel={startLabel}
            style={{ borderCurve: 'continuous' }}
          >
            <S.PlayGradient>
              <PlayGlyph />
            </S.PlayGradient>
          </S.PlayPressable>
        </S.CardBody>
      </HomeCard>

      <S.ActionsRow>
        <S.StartTilePressable
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel={startLabel}
          style={{ borderCurve: 'continuous' }}
        >
          <S.StartTileGradient>
            <S.StartGloss />
            <PlayGlyph size={13} stroke={2.4} />
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.1}
              style={{ fontSize: 11.5, lineHeight: 14, color: '#FFFFFF', marginTop: 8 }}
            >
              {startLabel}
            </HomeText>
          </S.StartTileGradient>
        </S.StartTilePressable>
        <SecondaryTile
          label={t('home.today_session.nutrition') /* en: "Nutrition" */}
          glyph={<MealGlyph color="#FFB84D" />}
          onPress={onNutrition}
        />
        <SecondaryTile
          label={t('home.today_session.timer') /* en: "Timer" */}
          glyph={<StopwatchGlyph color="#5EDCF0" />}
          onPress={onTimer}
        />
      </S.ActionsRow>
    </>
  );
}
