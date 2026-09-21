import { describe, expect, it } from 'vitest';
import { MUSCLE_TRACK_MAX_SETS } from '../constants';
import { trackFractions } from './muscle-track';

describe('trackFractions', () => {
  it('expresses band and fill as percentages of the track', () => {
    // Reference row: 8–16 target band, 12 sets performed, 24-set track.
    const { bandLeftPct, bandWidthPct, fillPct } = trackFractions({
      low: 8,
      high: 16,
      sets: 12,
    });
    expect(bandLeftPct).toBeCloseTo((8 / MUSCLE_TRACK_MAX_SETS) * 100, 6);
    expect(bandWidthPct).toBeCloseTo((8 / MUSCLE_TRACK_MAX_SETS) * 100, 6);
    expect(fillPct).toBe(50);
  });

  it('clamps the fill at the track maximum', () => {
    const { fillPct } = trackFractions({ low: 8, high: 16, sets: 99 });
    expect(fillPct).toBe(100);
  });

  it('renders no fill when nothing was performed', () => {
    const { fillPct } = trackFractions({ low: 8, high: 16, sets: 0 });
    expect(fillPct).toBe(0);
  });

  it('starts the band at zero when the target starts at zero', () => {
    const { bandLeftPct } = trackFractions({ low: 0, high: 10, sets: 4 });
    expect(bandLeftPct).toBe(0);
  });
});
