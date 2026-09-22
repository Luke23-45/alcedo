import { LinearGradient } from 'expo-linear-gradient';
import * as S from './share-poster.styles';

export type SharePosterTheme = 'ember' | 'aurora' | 'slate';

interface SharePosterProps {
  theme: SharePosterTheme;
  /** e.g. "KINETIC · MONDAY, JUNE 9" — rendered uppercase. */
  kicker: string;
  /** Big number, e.g. "8,420". */
  heroValue: string;
  /** Unit after the hero value, e.g. "kg". */
  heroUnit: string;
  /** e.g. "Push Day · Strength". */
  workoutName: string;
  /** e.g. "45:12". */
  duration: string;
  /** e.g. "19". */
  sets: string;
  /** Rendered uppercase, e.g. ["SHOULDER PRESS PR", "VOLUME PR", "13-DAY STREAK"]. */
  prPills: string[];
  /**
   * Exact gradient override (Feed timeline contract values). Takes precedence
   * over `theme` when provided; `theme` still names the format for the
   * share-sheet preview. `start`/`end` default to the poster's own diagonal.
   */
  gradient?: {
    colors: [string, string] | [string, string, string];
    locations?: [number, number] | [number, number, number];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

type ThemeSpec = {
  colors: [string, string] | [string, string, string];
  locations: [number, number] | [number, number, number];
};

/**
 * Stop positions for a gradient override whose colours arrived without any.
 * Deriving them from the colour count matters: a hard-coded 2-stop `locations`
 * under a 3-colour ramp is a mis-placed (and loudly warned-about)
 * expo-linear-gradient mismatch.
 */
function evenLocations(
  colors: readonly string[],
): [number, number] | [number, number, number] {
  return colors.length <= 2 ? [0, 1] : [0, 0.5, 1];
}

const THEMES: Record<SharePosterTheme, ThemeSpec> = {
  ember: { colors: ['#FFB03A', '#FF5A3C', '#C1143C'], locations: [0, 0.45, 1] },
  aurora: { colors: ['#8E7BFF', '#0E7490'], locations: [0, 1] },
  slate: { colors: ['#4A4A50', '#1C1C1E'], locations: [0, 1] },
};

/**
 * The share poster — one component used byte-identical in Feed cards, Post
 * Detail, and the Composer preview. Fills its container width; the internal
 * grid (text sizes, insets, baselines) is fixed so the format is recognisable
 * regardless of theme.
 *
 * Padding decision: the spec draws the feed slot with a 16pt internal inset
 * (text x=48 on rect x=32) but composer/detail with 20pt (x=36 on x=16).
 * This component locks ONE inset — 16pt, the feed slot's value — everywhere,
 * so the three usages render the same grid. The composer/detail screen
 * builders get the 16pt grid; the spec's 20pt is not reproduced.
 *
 * Posters do not theme in light mode (they are images): the gradient, gloss,
 * edge, and every text colour are identical in both modes.
 *
 * Internal grid (feed slot 329×190, all values relative to the poster):
 *   kicker 8/700/ls1.2 white .72 @ top 18 (baseline 24)
 *   hero 40/700/-1.6 white + unit 15.5/600 white .72 @ top 42 (baseline 74)
 *   workout name 12.5/600/-0.2 white .88 @ top 86 (baseline 96)
 *   duration/sets values 14/700/-0.3 white @ top 115 (baseline 126), columns at +0/+104
 *   duration/sets labels 7.5/700/ls.7 white .62 @ top 134 (baseline 140)
 *   PR pills 22pt rx11, white .20 fill + white .30 0.8 stroke, 8/700/ls.6 @ top 154
 *   gloss white .32→0 over the top half (drawn at .4 opacity, per the spec's feed slot)
 *   edge white .22, 1pt, inset 0.5pt
 */
export function SharePoster({
  theme,
  kicker,
  heroValue,
  heroUnit,
  workoutName,
  duration,
  sets,
  prPills,
  gradient,
}: SharePosterProps) {
  const spec = gradient
    ? {
        colors: gradient.colors,
        locations: gradient.locations ?? evenLocations(gradient.colors),
        start: gradient.start ?? { x: 0, y: 0 },
        end: gradient.end ?? { x: 0.7, y: 1 },
      }
    : { ...THEMES[theme], start: { x: 0, y: 0 }, end: { x: 0.7, y: 1 } };

  return (
    <S.ShadowWrap>
      <S.Poster>
        <LinearGradient
          colors={spec.colors}
          locations={spec.locations}
          start={spec.start}
          end={spec.end}
          style={S.fill}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={S.gloss}
        />
        <S.Content>
          <S.Kicker numberOfLines={1} ellipsizeMode="tail">
            {kicker}
          </S.Kicker>
          <S.Hero numberOfLines={1} ellipsizeMode="tail">
            {heroValue}
            <S.HeroUnit> {heroUnit}</S.HeroUnit>
          </S.Hero>
          <S.WorkoutName numberOfLines={1} ellipsizeMode="tail">
            {workoutName}
          </S.WorkoutName>
          {duration.length > 0 ? (
            <>
              <S.StatValue $column={0} numberOfLines={1}>
                {duration}
              </S.StatValue>
              <S.StatLabel $column={0} numberOfLines={1}>
                Duration
              </S.StatLabel>
            </>
          ) : null}
          {sets.length > 0 ? (
            <>
              <S.StatValue $column={1} numberOfLines={1}>
                {sets}
              </S.StatValue>
              <S.StatLabel $column={1} numberOfLines={1}>
                Sets
              </S.StatLabel>
            </>
          ) : null}
          <S.PillRow>
            {prPills.map((pill) => (
              <S.Pill key={pill}>
                <S.PillText numberOfLines={1}>{pill}</S.PillText>
              </S.Pill>
            ))}
          </S.PillRow>
        </S.Content>
        <S.Edge />
      </S.Poster>
    </S.ShadowWrap>
  );
}
