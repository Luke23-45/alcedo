import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderHook } from '@testing-library/react';
import { LocalDate } from '@js-joda/core';
import { useAppSelector } from '@/store';
import { useFormatDate } from '@/hooks/useFormatDate';
import { makeSession } from '@/models/session-models/__test__/helpers';
import { deriveComposerSessionData, type ComposerFormatDate } from './composer-data';

vi.mock('@/store', () => ({ useAppSelector: vi.fn() }));

/**
 * Mirrors the conversion `useFormatDate` applies, so the pure function is
 * tested through the same Intl path the components hand it.
 */
const enUsFormatDate: ComposerFormatDate = (date, opts) =>
  new Intl.DateTimeFormat('en-US', opts).format(new Date(date.year(), date.month().ordinal(), date.dayOfMonth()));

/** Files that carried the crashing js-joda text patterns, relative to the app dir. */
const FIXED_FILES = [
  'src/components/presentation/feed/composer/composer-data.ts',
  'src/components/presentation/stats/trends/exercise-detail/progress-chart/progress-chart.tsx',
  'src/components/presentation/stats/trends/exercise-detail/last-session/last-session.tsx',
  'src/components/presentation/stats/trends/exercise-detail/session-history/session-history.tsx',
].map((rel) => join(process.cwd(), rel));

describe('no js-joda text patterns', () => {
  it.each(FIXED_FILES)('no DateTimeFormatter.ofPattern remains in %s', (path) => {
    const source = readFileSync(path, 'utf8');
    // Text patterns (MMM/MMMM/EEEE) threw IllegalArgumentException at runtime
    // without the js-joda locale plugin; every use was replaced by Intl.
    expect(source).not.toMatch(/ofPattern\(/);
  });
});

describe('deriveComposerSessionData kicker', () => {
  it('uppercases the Intl weekday/month/day date after KINETIC', () => {
    // A session with no recorded exercises is enough: the reference-time
    // fallback is session.date itself, so the date is deterministic in any TZ.
    const session = makeSession([], LocalDate.of(2026, 9, 9));
    const data = deriveComposerSessionData(session, [session], new Map(), enUsFormatDate);
    expect(data.kicker).toBe('KINETIC · WEDNESDAY, SEPTEMBER 9');
  });
});

describe('exercise-detail date labels via the Intl path', () => {
  it('formats the month-day, month-only, and day-only labels the components use', () => {
    vi.mocked(useAppSelector).mockReturnValue('en-US');
    const { result } = renderHook(() => useFormatDate());
    const formatDate = result.current;
    const date = LocalDate.of(2026, 9, 9);

    // progress-chart x-axis + subtitle, last-session title param
    expect(formatDate(date, { month: 'short', day: 'numeric' })).toBe('Sep 9');
    // session-history date tile: uppercased short month, zero-padded day
    expect(formatDate(date, { month: 'short' }).toUpperCase()).toBe('SEP');
    expect(formatDate(date, { day: '2-digit' })).toBe('09');
    // composer kicker via the real hook
    expect(formatDate(date, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()).toBe(
      'WEDNESDAY, SEPTEMBER 9',
    );
  });
});
