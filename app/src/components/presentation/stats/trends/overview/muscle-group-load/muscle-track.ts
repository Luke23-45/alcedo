import { MUSCLE_TRACK_MAX_SETS } from '../constants';

export interface MuscleTrackInput {
  low: number;
  high: number;
  sets: number;
}

export interface MuscleTrackFractions {
  bandLeftPct: number;
  bandWidthPct: number;
  fillPct: number;
}

/**
 * Bar/track geometry as percentages of the track width (0–100). Proportional
 * so the 0–24 set scale holds on any screen width — the reference's 321pt
 * track is only exact on 393pt-wide phones. Sets clamp at the track maximum.
 */
export function trackFractions(row: MuscleTrackInput): MuscleTrackFractions {
  return {
    bandLeftPct: (row.low / MUSCLE_TRACK_MAX_SETS) * 100,
    bandWidthPct: ((row.high - row.low) / MUSCLE_TRACK_MAX_SETS) * 100,
    fillPct: (Math.min(row.sets, MUSCLE_TRACK_MAX_SETS) / MUSCLE_TRACK_MAX_SETS) * 100,
  };
}
