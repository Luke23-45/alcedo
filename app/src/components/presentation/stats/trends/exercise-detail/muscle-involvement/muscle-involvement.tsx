import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { useAppTheme } from '@/hooks/useAppTheme';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { useTranslate } from '@tolgee/react';
import * as S from './muscle-involvement.styles';

/**
 * Involvement percentages are NOT in the data model — the spec's sampled
 * values (62/24/14 with its colors) render here under the home page's
 * SampleBadge convention: sampled and labelled, never faked. Muscle names
 * are real, from the exercise descriptor's `muscles` array. In light mode the
 * hues deepen per the heatmap precedent (data colors stay in-hue, text stays
 * legible on white).
 */
const SAMPLED_DARK: { pct: number; bar: string; text: string }[] = [
  { pct: 62, bar: '#FF2D55', text: '#FF6A88' },
  { pct: 24, bar: '#FF9F0A', text: '#FFB84D' },
  { pct: 14, bar: '#AF52DE', text: '#C77DFF' },
];

const SAMPLED_LIGHT: { pct: number; bar: string; text: string }[] = [
  { pct: 62, bar: '#D70015', text: '#D70015' },
  { pct: 24, bar: '#E07800', text: '#8A4B00' },
  { pct: 14, bar: '#AF52DE', text: '#AF52DE' },
];

export function MuscleInvolvement({ muscles }: { muscles: string[] }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const sampled = theme.isDark ? SAMPLED_DARK : SAMPLED_LIGHT;
  const rows = muscles.slice(0, 3).map((name, i) => ({
    name: translateExerciseMeta(t, 'muscle', name),
    ...sampled[i]!,
  }));
  return (
    <HomeCard radius={30} pad={0}>
      <S.CardInner>
        <S.TitleRow>
          <S.Title>{t('stats.exercise_detail.muscles.title')}</S.Title>
          <SampleBadge />
        </S.TitleRow>
        {rows.map((row, i) => (
          <S.Row key={row.name} $first={i === 0}>
            <S.Name numberOfLines={1} ellipsizeMode="tail">
              {row.name}
            </S.Name>
            <S.Track>
              <S.Fill $widthPct={row.pct} $color={row.bar} />
            </S.Track>
            <S.Pct $color={row.text}>{row.pct}%</S.Pct>
          </S.Row>
        ))}
      </S.CardInner>
    </HomeCard>
  );
}
