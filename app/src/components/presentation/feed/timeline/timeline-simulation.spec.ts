/**
 * Page 8/20 — Feed timeline simulation.
 *
 * Drives the timeline's pure logic the way the real screen does: filter
 * semantics across all five chips, kudos-label derivation, reference-post
 * truthfulness (ages seeded relative to now), the challenge-banner math,
 * post-age formatting, the composer derivation feeding Alex's card, the
 * persisted hidden/bookmark sets, and a regression guard for the caption
 * clamp that keeps long drafts inside the fixed-height card.
 * React Native is stubbed out in this repo's test setup, so the simulation
 * runs at the model/hook-logic level — the same level the shipped page-1..7
 * suites used.
 */
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, renderHook, waitFor } from '@testing-library/react';
import { LocalDate, OffsetDateTime, ZoneOffset } from '@js-joda/core';
import { v4 as uuid } from 'uuid';
import { SessionBlueprint } from '@/models/blueprint-models';
import { Session } from '@/models/session-models';
import { Weight } from '@/models/weight';
import { makeRecordedExercise, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import type { KeyValueStore } from '@/services/key-value-store';
import {
  buildReferencePosts,
  CHALLENGE,
  CIRCLE_POST_TOTAL,
  describeKudosLabel,
  formatChallengePoints,
  postMatchesFilter,
  TIMELINE_FILTERS,
  type TimelinePost,
  type TimelineWorkoutPost,
} from './timeline-data';
import { deriveComposerSessionData, formatPostAge, type ComposerFormatDate, type ComposerFormatNumber } from '../composer/composer-data';
import { useBookmarks, useHiddenPosts } from './timeline-state';
import { PEOPLE } from '../shared/people';

const NOW = 1_750_000_000_000;
const HOUR = 3_600_000;

/** Simple {count} interpolator standing in for Tolgee in age/format tests. */
const t = (key: string, fallback: string, params?: Record<string, string | number>) =>
  fallback.replace(/\{(\w+)\}/g, (_, name: string) => String(params?.[name] ?? ''));

const enUsFormatDate: ComposerFormatDate = (date, opts) =>
  new Intl.DateTimeFormat('en-US', opts).format(new Date(date.year(), date.month().ordinal(), date.dayOfMonth()));

const enUsFormatNumber: ComposerFormatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

function ownPostWith(prPills: string[]): TimelineWorkoutPost {
  return {
    kind: 'workout',
    id: 'alex',
    person: PEOPLE.alex!,
    isOwn: true,
    badge: 'you',
    audience: 'friends',
    postedAt: NOW,
    caption: null,
    poster: {
      kicker: 'KINETIC · TUESDAY, SEPTEMBER 22',
      heroValue: '8,420',
      heroUnit: 'kg',
      workoutName: 'Push Day · Strength',
      duration: '45:12',
      sets: '19',
      prPills,
    },
    kudos: { faceIds: ['mia', 'jon', 'sofia'], total: 6 },
    comments: 3,
    inChallenge: true,
  };
}

describe('timeline filters', () => {
  const refs = buildReferencePosts(NOW);
  const ownWithPrs = ownPostWith(['SHOULDER PRESS PR']);
  const ownWithoutPrs = ownPostWith([]);

  it('exposes the five contract chips in order', () => {
    expect(TIMELINE_FILTERS.map((f) => f.id)).toEqual(['all', 'following', 'prs', 'milestones', 'challenge']);
  });

  it('all shows every post', () => {
    const posts = [ownWithPrs, ...refs];
    expect(posts.filter((p) => postMatchesFilter(p, 'all'))).toHaveLength(4);
  });

  it('following excludes your own post', () => {
    const posts = [ownWithPrs, ...refs];
    const shown = posts.filter((p) => postMatchesFilter(p, 'following'));
    expect(shown.map((p) => p.id).sort()).toEqual(['jon', 'mia', 'sofia']);
  });

  it('prs shows only posts carrying a PR pill', () => {
    // Mia and Sofia carry PR pills; Jon's milestone has none; Alex's depends.
    expect(
      refs
        .filter((p) => postMatchesFilter(p, 'prs'))
        .map((p) => p.id)
        .sort(),
    ).toEqual(['mia', 'sofia']);
    expect(postMatchesFilter(ownWithPrs, 'prs')).toBe(true);
    expect(postMatchesFilter(ownWithoutPrs, 'prs')).toBe(false);
  });

  it('milestones shows only milestone posts', () => {
    expect(refs.filter((p) => postMatchesFilter(p, 'milestones')).map((p) => p.id)).toEqual(['jon']);
    expect(postMatchesFilter(ownWithPrs, 'milestones')).toBe(false);
  });

  it('challenge shows every in-challenge post', () => {
    const posts: TimelinePost[] = [ownWithPrs, ...refs];
    expect(posts.every((p) => postMatchesFilter(p, 'challenge'))).toBe(true);
  });

  it('every filter has a non-empty empty-state copy pair', () => {
    for (const filter of TIMELINE_FILTERS) {
      expect(filter.emptyTitleFallback.length).toBeGreaterThan(0);
      expect(filter.emptyBodyFallback.length).toBeGreaterThan(0);
    }
  });
});

describe('kudos label derivation', () => {
  it('renders nothing with no kudos', () => {
    expect(describeKudosLabel([], 0)).toEqual({ kind: 'none' });
    expect(describeKudosLabel(['Mia'], 0)).toEqual({ kind: 'none' });
  });

  it('renders a single name', () => {
    expect(describeKudosLabel(['Mia'], 1)).toEqual({ kind: 'one', name: 'Mia' });
  });

  it('renders two names', () => {
    expect(describeKudosLabel(['Mia', 'Jon'], 2)).toEqual({ kind: 'two', first: 'Mia', second: 'Jon' });
  });

  it('renders "Mia, Jon and 4 others" for the contract six', () => {
    expect(describeKudosLabel(['Mia', 'Jon', 'Sofia'], 6)).toEqual({
      kind: 'many',
      first: 'Mia',
      second: 'Jon',
      others: 4,
    });
  });

  it('counts the tail from the total, not the visible faces', () => {
    expect(describeKudosLabel(['Mia', 'Jon', 'Sofia'], 14)).toEqual({
      kind: 'many',
      first: 'Mia',
      second: 'Jon',
      others: 12,
    });
  });
});

describe('reference posts stay truthful', () => {
  const refs = buildReferencePosts(NOW);

  it('seeds exactly the three contract sample posts', () => {
    expect(refs.map((p) => p.id)).toEqual(['mia', 'jon', 'sofia']);
  });

  it('ages are the contract 2h / 18h / 1d, always relative to now', () => {
    const [mia, jon, sofia] = refs;
    expect(formatPostAge(mia!.postedAt, NOW, t)).toBe('2h');
    expect(formatPostAge(jon!.postedAt, NOW, t)).toBe('18h');
    expect(formatPostAge(sofia!.postedAt, NOW, t)).toBe('1d');
  });

  it('carries the contract kudos totals and audience mix', () => {
    const byId = new Map(refs.map((p) => [p.id, p]));
    expect(byId.get('mia')!.kudos.total).toBe(14);
    expect(byId.get('jon')!.kudos.total).toBe(32);
    expect(byId.get('sofia')!.kudos.total).toBe(21);
    expect(byId.get('mia')!.audience).toBe('public');
    expect(byId.get('sofia')!.audience).toBe('friends');
  });

  it('marks every reference post as a challenge participant', () => {
    expect(refs.every((p) => p.inChallenge)).toBe(true);
  });
});

describe('challenge banner math', () => {
  it('fills 165.7pt of the 200pt track from real points', () => {
    expect(CHALLENGE.trackFill).toBeCloseTo(165.7, 1);
  });

  it('keeps the contract rank, participants, and days-left', () => {
    expect(CHALLENGE.rank).toBe(3);
    expect(CHALLENGE.participants).toBe(128);
    expect(CHALLENGE.daysLeft).toBe(3);
    expect(CIRCLE_POST_TOTAL).toBe(128);
  });

  it('formats points with the en-US grouping the banner shows', () => {
    expect(formatChallengePoints(10_340)).toBe('10,340');
    expect(formatChallengePoints(12_480)).toBe('12,480');
  });
});

describe('formatPostAge', () => {
  it('renders the contract compact forms', () => {
    expect(formatPostAge(NOW - 21 * 60_000, NOW, t)).toBe('21m');
    expect(formatPostAge(NOW - 2 * HOUR, NOW, t)).toBe('2h');
    expect(formatPostAge(NOW - 18 * HOUR, NOW, t)).toBe('18h');
    expect(formatPostAge(NOW - 24 * HOUR, NOW, t)).toBe('1d');
  });

  it('renders "now" under a minute and never goes negative', () => {
    expect(formatPostAge(NOW - 30_000, NOW, t)).toBe('now');
    expect(formatPostAge(NOW + HOUR, NOW, t)).toBe('now');
  });

  it('falls back to a short date at seven days and beyond', () => {
    const postedAt = NOW - 9 * 24 * HOUR;
    const expected = new Date(postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    expect(formatPostAge(postedAt, NOW, t)).toBe(expected);
  });
});

describe('deriveComposerSessionData feeding the timeline card', () => {
  const at = (hour: number, minute = 0) => OffsetDateTime.of(2026, 9, 22, hour, minute, 0, 0, ZoneOffset.UTC);

  function sessionWithSets(name: string, date: LocalDate, reps: (number | undefined)[]): Session {
    const blueprint = makeWeightedBlueprint({ name: 'Bench Press' });
    const recorded = makeRecordedExercise(blueprint, reps, new Weight(60, 'kilograms'), (i) =>
      i === 0 ? at(10) : at(10, 45),
    );
    return new Session(uuid(), new SessionBlueprint(name, [blueprint], ''), [recorded], date, undefined, undefined);
  }

  it('computes volume, sets, and duration from real completed sets', () => {
    const session = sessionWithSets('Push Day', LocalDate.of(2026, 9, 22), [10, 8]);
    const data = deriveComposerSessionData(session, [session], new Map(), enUsFormatDate, enUsFormatNumber);
    // 60kg x 10 + 60kg x 8 = 1,080 kg
    expect(data.volumeLabel).toBe('1,080');
    expect(data.volumeUnit).toBe('kg');
    expect(data.setsLabel).toBe('2');
    expect(data.durationLabel).toBe('45:00');
    expect(data.name).toBe('Push Day');
    expect(data.kindLabel).toBe('Strength');
  });

  it('ignores unlogged sets in volume and the set count', () => {
    const session = sessionWithSets('Push Day', LocalDate.of(2026, 9, 22), [10, undefined]);
    const data = deriveComposerSessionData(session, [session], new Map(), enUsFormatDate, enUsFormatNumber);
    expect(data.volumeLabel).toBe('600');
    expect(data.setsLabel).toBe('1');
  });

  it('uppercases exercise PR names and adds a VOLUME PR when this session leads', () => {
    const big = sessionWithSets('Push Day', LocalDate.of(2026, 9, 22), [10, 8]);
    const small = sessionWithSets('Push Day', LocalDate.of(2026, 9, 15), [10]);
    const records = new Map([[big.id, [{ exerciseName: 'bench press', oneRepMax: new Weight(80, 'kilograms') }]]]);
    const data = deriveComposerSessionData(big, [big, small], records, enUsFormatDate, enUsFormatNumber);
    expect(data.prPills).toContain('BENCH PRESS PR');
    expect(data.prPills).toContain('VOLUME PR');
  });

  it('does not claim a VOLUME PR when another session lifted more', () => {
    const small = sessionWithSets('Push Day', LocalDate.of(2026, 9, 22), [10]);
    const big = sessionWithSets('Push Day', LocalDate.of(2026, 9, 15), [10, 8]);
    const data = deriveComposerSessionData(small, [small, big], new Map(), enUsFormatDate, enUsFormatNumber);
    expect(data.prPills).not.toContain('VOLUME PR');
  });

  it('formats the kicker through the cached Intl path (no js-joda text patterns)', () => {
    const session = sessionWithSets('Push Day', LocalDate.of(2026, 9, 22), [10, 8]);
    const data = deriveComposerSessionData(session, [session], new Map(), enUsFormatDate, enUsFormatNumber);
    expect(data.kicker).toBe('KINETIC · TUESDAY, SEPTEMBER 22');
  });
});

describe('persisted timeline state', () => {
  function memoryStore(initial: Record<string, string> = {}): {
    store: KeyValueStore;
    backing: Map<string, string>;
  } {
    const backing = new Map(Object.entries(initial));
    const store = {
      getItem: vi.fn(async (key: string) => backing.get(key)),
      setItem: vi.fn(async (key: string, value: string) => {
        backing.set(key, value);
      }),
    } as unknown as KeyValueStore;
    return { store, backing };
  }

  it('hidden posts load from the store and stay hidden across restarts', async () => {
    const { store, backing } = memoryStore({
      'feed.timeline.hidden.v1': JSON.stringify(['mia', 'sofia']),
    });
    const { result } = renderHook(() => useHiddenPosts(store));
    await waitFor(() => expect(result.current.has('mia')).toBe(true));
    expect(result.current.has('sofia')).toBe(true);
    expect(result.current.has('jon')).toBe(false);

    act(() => {
      result.current.add('jon');
    });
    expect(result.current.has('jon')).toBe(true);
    const persisted = JSON.parse(backing.get('feed.timeline.hidden.v1')!) as string[];
    expect(persisted.sort()).toEqual(['jon', 'mia', 'sofia']);
  });

  it('bookmarks toggle on and off and persist as JSON', async () => {
    const { store, backing } = memoryStore();
    const { result } = renderHook(() => useBookmarks(store));
    await waitFor(() => expect(result.current.has('mia')).toBe(false));

    act(() => {
      result.current.toggle('mia');
    });
    expect(result.current.has('mia')).toBe(true);

    act(() => {
      result.current.toggle('mia');
    });
    expect(result.current.has('mia')).toBe(false);
    expect(JSON.parse(backing.get('feed.timeline.bookmarks.v1')!)).toEqual([]);
  });

  it('corrupt persisted JSON degrades to an empty set instead of crashing', async () => {
    const { store } = memoryStore({ 'feed.timeline.hidden.v1': 'not-json{{' });
    const { result } = renderHook(() => useHiddenPosts(store));
    await waitFor(() => expect(result.current.has('mia')).toBe(false));
  });

  it('non-string entries in the persisted array are dropped', async () => {
    const { store } = memoryStore({ 'feed.timeline.bookmarks.v1': JSON.stringify(['mia', 42, null]) });
    const { result } = renderHook(() => useBookmarks(store));
    await waitFor(() => expect(result.current.has('mia')).toBe(true));
    expect(result.current.has('42')).toBe(false);
  });
});

describe('timeline caption clamp regression', () => {
  const frame = readFileSync(join(process.cwd(), 'src/components/presentation/feed/timeline/post-frame.tsx'), 'utf8');

  it('clamps the caption to two lines so long drafts stay inside the fixed-height card', () => {
    expect(frame).toContain('numberOfLines={2}');
    expect(frame).toContain('ellipsizeMode="tail"');
  });

  it('keeps the card at the uniform 388pt height', () => {
    expect(frame).toContain('height: TIMELINE_CARD_HEIGHT');
  });
});

describe('feed footer honesty', () => {
  const footer = readFileSync(join(process.cwd(), 'src/components/presentation/feed/timeline/feed-footer.tsx'), 'utf8');

  it('marks the fictional sample posts with the SampleBadge', () => {
    expect(footer).toContain('SampleBadge');
  });

  it('wires the "Load earlier" pill to a real refresh handler', () => {
    expect(footer).toContain('onLoadEarlier');
    expect(footer).toContain('onPress={onLoadEarlier}');
  });
});
