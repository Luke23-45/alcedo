import type { ComposerSessionData } from './composer-data';
import type { ComposerStatKey, ComposerTheme } from './composer-types';
import { TOTAL_STATS } from './composer-types';

/**
 * The toggle → preview rule (missing-thing rule).
 *
 * The stat toggles drive the SharePoster preview in the composer, and the same
 * rule renders the poster in the feed timeline and post detail, so the preview
 * is byte-identical to what gets published.
 *
 * Rule:
 * - HERO = the first ON stat of [volume, duration, sets]. Volume renders as
 *   "8,420" + "kg"; duration renders "45:12" with no unit; sets renders "19"
 *   with no unit. PRs can never be the hero — it lives in the pill row.
 * - STATS ROW = the remaining ON stats of {duration, sets}, pinned to their
 *   grid columns (column 0 = duration, column 1 = sets). A stat that is OFF —
 *   or that moved up to the hero — leaves its column blank; columns never
 *   shift, so the grid language survives every toggle combination.
 * - PR PILLS = the session's PR pills when PRs is ON, otherwise none.
 * - Reps / Heart rate / Notes / RPE never render on the poster. They are
 *   card-invisible stats: they exist only as toggles and as the "N stats
 *   hidden" caption.
 * - Edge case: when volume, duration AND sets are all OFF, there is no hero
 *   candidate. The hero then renders an em dash ("—") rather than inventing
 *   a number — the kicker and workout name still carry the context.
 */
export interface PosterProps {
  theme: ComposerTheme;
  kicker: string;
  heroValue: string;
  heroUnit: string;
  workoutName: string;
  duration: string;
  sets: string;
  prPills: string[];
}

export function buildPosterProps(
  data: ComposerSessionData,
  theme: ComposerTheme,
  visible: Record<ComposerStatKey, boolean>,
): PosterProps {
  const heroKey: ComposerStatKey | undefined = (['volume', 'duration', 'sets'] as const).find((key) => visible[key]);

  let heroValue = '—';
  let heroUnit = '';
  if (heroKey === 'volume') {
    heroValue = data.volumeLabel;
    heroUnit = data.volumeUnit;
  } else if (heroKey === 'duration') {
    heroValue = data.durationLabel;
  } else if (heroKey === 'sets') {
    heroValue = data.setsLabel;
  }

  return {
    theme,
    kicker: data.kicker,
    heroValue,
    heroUnit,
    workoutName: `${data.name} · ${data.kindLabel}`,
    duration: visible.duration && heroKey !== 'duration' ? data.durationLabel : '',
    sets: visible.sets && heroKey !== 'sets' ? data.setsLabel : '',
    prPills: visible.prs ? data.prPills : [],
  };
}

/** Number of ON toggles, driving "N of 8 shown" and "M stats hidden". */
export function countVisibleStats(visible: Record<ComposerStatKey, boolean>): number {
  return Object.values(visible).filter(Boolean).length;
}

export function countHiddenStats(visible: Record<ComposerStatKey, boolean>): number {
  return TOTAL_STATS - countVisibleStats(visible);
}
