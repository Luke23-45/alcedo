import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DateTimeFormatter } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { useAppTheme } from '@/hooks/useAppTheme';
import { DetailSession, formatBare } from '../exercise-detail-model';
import * as S from './session-history.styles';

const MONTH = DateTimeFormatter.ofPattern('MMM');
const DAY = DateTimeFormatter.ofPattern('dd');

/** The reference previews the six most recent sessions; the header's total opens the full list. */
const PREVIEW_ROWS = 6;

function RowChevron() {
  return (
    <Svg width={8} height={12} viewBox="-4 -6 8 12">
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke="#48484A"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeaderChevron({ color }: { color: string }) {
  return (
    <Svg width={8} height={12} viewBox="-4 -6 8 12">
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Session history: one 361×76 row per recorded session with a 44×44 date
 * tile, the set's rep list and top set, and the real volume + Epley e1RM.
 * The gold tile + PR badge mark the session that set the all-time top-set
 * record (earliest on ties). The header's "{n} total" opens the full history.
 */
export function SessionHistory({
  sessions,
  unitLabel,
  sessionCount,
  onSessionPress,
  onViewAll,
}: {
  sessions: DetailSession[];
  unitLabel: string;
  sessionCount: number;
  onSessionPress: (sessionId: string) => void;
  onViewAll: () => void;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const preview = sessions.slice(0, PREVIEW_ROWS);
  return (
    <S.Section>
      <S.HeaderRow>
        <S.Eyebrow>{t('stats.exercise_detail.history.eyebrow')}</S.Eyebrow>
        <Pressable
          onPress={onViewAll}
          accessibilityRole="button"
          accessibilityLabel={t('stats.exercise_detail.history.eyebrow')}
          hitSlop={{ top: 12, bottom: 12, left: 16, right: 8 }}
        >
          <S.TotalWrap>
            <S.TotalText>{t('stats.exercise_detail.history.total', { count: sessionCount.toString() })}</S.TotalText>
            <HeaderChevron color={theme.home.seeAll} />
          </S.TotalWrap>
        </Pressable>
      </S.HeaderRow>
      {preview.map((s) => (
        <HomeCard key={s.sessionId} radius={22} pad={0} style={S.cardGap}>
          <Pressable onPress={() => onSessionPress(s.sessionId)} accessibilityRole="button">
            <S.RowInner>
              <S.DateTile $pr={s.holdsWeightPr}>
                <S.DateMonth $pr={s.holdsWeightPr}>{s.date.format(MONTH).toUpperCase()}</S.DateMonth>
                <S.DateDay $pr={s.holdsWeightPr}>{s.date.format(DAY)}</S.DateDay>
              </S.DateTile>
              <S.TextBlock>
                <S.MainLine numberOfLines={1} ellipsizeMode="tail">
                  {s.repList.join(' · ')}  @ {formatBare(s.topSet)} {unitLabel}
                </S.MainLine>
                <S.SubLine numberOfLines={1} ellipsizeMode="tail">
                  {t('stats.exercise_detail.history.row_subtitle', {
                    volume: formatBare(s.volume),
                    unit: unitLabel,
                    e1rm: formatBare(s.e1rm),
                  })}
                </S.SubLine>
              </S.TextBlock>
              {s.holdsWeightPr ? (
                <S.PrBadge>
                  <S.PrText>{t('stats.exercise_detail.history.pr')}</S.PrText>
                </S.PrBadge>
              ) : null}
              <RowChevron />
            </S.RowInner>
          </Pressable>
        </HomeCard>
      ))}
    </S.Section>
  );
}
