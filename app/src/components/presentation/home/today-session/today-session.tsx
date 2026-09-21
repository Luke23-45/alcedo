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

export function TodaySession({ title, subtitle, startLabel, difficultyLabel, onStart }: TodaySessionProps) {
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

      {/*
        Quick actions row: Start is the only real action. Nutrition and Timer
        tiles were here per the reference, but the app has no nutrition logging
        or standalone timer — dead tiles are worse than missing ones. They
        return when those features ship.
      */}
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
      </S.ActionsRow>
    </>
  );
}
