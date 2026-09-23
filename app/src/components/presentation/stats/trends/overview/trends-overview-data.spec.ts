import { LocalDate } from '@js-joda/core';
import { describe, expect, it, vi } from 'vitest';

// @/store's full graph isn't importable under vitest (pre-existing); the pure
// helpers under test never touch it.
vi.mock('@/store', () => ({ useAppSelector: vi.fn() }));

import { bucketsForRange, format1, formatInt, formatSigned1, formatSignedPct } from './trends-overview-data';

const MINUS = '−'; // U+2212, the reference's minus

describe('formatSigned1', () => {
  it('signs positive values with +', () => {
    expect(formatSigned1(1.84, 'en-US')).toBe('+1.8');
  });

  it('uses U+2212 for negative values', () => {
    expect(formatSigned1(-1.84, 'en-US')).toBe(`${MINUS}1.8`);
  });

  it('renders zero without a sign', () => {
    expect(formatSigned1(0.001, 'en-US')).toBe('0.0');
  });

  it('uses the locale decimal separator', () => {
    expect(formatSigned1(1.84, 'de-DE')).toBe('+1,8');
  });
});

describe('formatSignedPct', () => {
  it('formats the hero delta with one decimal', () => {
    expect(formatSignedPct(0.18, 'en-US')).toBe('+18.0%');
    expect(formatSignedPct(-0.022, 'en-US')).toBe(`${MINUS}2.2%`);
    expect(formatSignedPct(0, 'en-US')).toBe('0.0%');
  });

  it('uses the locale decimal separator', () => {
    expect(formatSignedPct(0.18, 'de-DE')).toBe('+18,0%');
  });
});

describe('formatInt / format1', () => {
  it('groups thousands', () => {
    expect(formatInt(24480, 'en-US')).toBe('24,480');
  });

  it('groups thousands per locale', () => {
    expect(formatInt(24480, 'de-DE')).toBe('24.480');
  });

  it('rounds to one decimal', () => {
    expect(format1(116.74, 'en-US')).toBe('116.7');
  });

  it('uses the locale decimal separator', () => {
    expect(format1(116.74, 'de-DE')).toBe('116,7');
  });
});

describe('bucketsForRange', () => {
  const today = LocalDate.of(2026, 9, 22);

  it('builds 7 daily buckets for 7D, ending today', () => {
    const buckets = bucketsForRange('7D', today, undefined);
    expect(buckets).toHaveLength(7);
    expect(buckets[6]!.end.equals(today)).toBe(true);
    expect(buckets[0]!.end.equals(today.minusDays(6))).toBe(true);
  });

  it('builds 4 weekly buckets for 4W', () => {
    expect(bucketsForRange('4W', today, undefined)).toHaveLength(4);
  });

  it('builds 26 weekly buckets for 6M', () => {
    expect(bucketsForRange('6M', today, undefined)).toHaveLength(26);
  });

  it('builds 12 monthly buckets for 1Y', () => {
    expect(bucketsForRange('1Y', today, undefined)).toHaveLength(12);
  });

  it('covers the full history for ALL', () => {
    const earliest = today.minusDays(200);
    const buckets = bucketsForRange('ALL', today, earliest);
    // 201 days → 7 thirty-day buckets.
    expect(buckets).toHaveLength(7);
    expect(buckets[buckets.length - 1]!.end.equals(today)).toBe(true);
  });

  it('falls back to a single bucket for ALL with no history (first run)', () => {
    const buckets = bucketsForRange('ALL', today, undefined);
    expect(buckets).toHaveLength(1);
  });
});
