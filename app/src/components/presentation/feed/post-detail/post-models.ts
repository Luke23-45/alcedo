import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { selectFeedSessionItems, selectOwnFeedUserId } from '@/store/feed';
import type { SessionUserEvent } from '@/models/feed-models';
import type { Session } from '@/models/session-models/session';
import { type FeedPerson, personById, type FeedPersonId } from '../shared/people';

/**
 * The post behind the detail screen: Alex's own post resolves to the real
 * published session; mia/jon/sofia resolve to the contract reference posts;
 * anything else is unknown (the route renders the "item unavailable" state).
 *
 * Source of truth: docs/new_design/social-dark.md — SOCIAL DATA CONTRACT and
 * SCREEN 2. Fields marked "real" below come from the store; the poster block
 * is the contract's exact reference values, pixel-to-pixel.
 */

export interface WorkoutPosterData {
  kind: 'workout';
  /**
   * 'ember' renders the shared SharePoster as-is (Alex). 'custom' renders the
   * same shared component with the exact contract gradient override
   * (Mia's pink, Sofia's green) — one poster grid everywhere.
   */
  theme: 'ember' | 'custom';
  gradient: [string, string] | [string, string, string];
  kicker: string;
  heroValue: string;
  heroUnit: string;
  workoutName: string;
  duration: string;
  sets: string;
  prPills: string[];
}

export interface MilestonePosterData {
  kind: 'milestone';
  value: string;
  unit: string;
  subtitle: string;
  range: string;
}

export type PostPosterData = WorkoutPosterData | MilestonePosterData;

export interface PostDetailModel {
  id: string;
  authorId: FeedPersonId;
  isOwn: boolean;
  /** Real caption source (composer caption / session notes) — none exists, so omitted. Never invented. */
  caption?: string;
  /** Real posted time (event timestamp) or the contract age for reference posts. */
  postedAtMs: number;
  audience: 'friends' | 'public';
  /** Real session id when available; the contract id for the reference showcase. */
  sessionId?: string;
  /**
   * The real published session behind Alex's post. Present only when the post
   * is a real published session — the detail poster is derived from it, never
   * from the contract placeholder.
   */
  session?: Session;
  /** Real feed event id, present only when the post is a real published session. */
  eventId?: string;
  poster: PostPosterData;
  kudosSeed: { total: number; people: FeedPersonId[] };
  /** Contract top-level comment count for reference posts (0 for Alex: seeds provide it). */
  commentCountBase: number;
  /** Only Alex's post seeds the contract thread. Friend threads stay empty — never fake. */
  seedThread: boolean;
}

const HOUR = 3_600_000;

const ALEX_POSTER: WorkoutPosterData = {
  kind: 'workout',
  theme: 'ember',
  gradient: ['#FFB03A', '#FF5A3C', '#C1143C'],
  kicker: 'KINETIC · MONDAY, JUNE 9',
  heroValue: '8,420',
  heroUnit: 'kg',
  workoutName: 'Push Day · Strength',
  duration: '45:12',
  sets: '19',
  prPills: ['SHOULDER PRESS PR', 'VOLUME PR', '13-DAY STREAK'],
};

function alexModel(item: SessionUserEvent | undefined): PostDetailModel {
  return {
    id: item?.eventId ?? 'alex',
    authorId: 'alex',
    isOwn: true,
    caption: undefined,
    postedAtMs: item ? item.timestamp.toEpochMilli() : Date.now() - 21 * 60_000,
    audience: 'friends',
    sessionId: item?.session.id ?? 'S-0609-A',
    session: item?.session,
    eventId: item?.eventId,
    poster: ALEX_POSTER,
    // KUDOS ON ALEX'S JUN 9 POST = 6 → Mia, Jon, Sofia, Dev, Lena, Tom.
    kudosSeed: { total: 6, people: ['mia', 'jon', 'sofia'] },
    commentCountBase: 0,
    seedThread: true,
  };
}

function referencePost(
  id: FeedPersonId,
  partial: Omit<PostDetailModel, 'id' | 'authorId' | 'isOwn' | 'caption' | 'eventId'>,
): PostDetailModel {
  return { id, authorId: id, isOwn: false, caption: undefined, eventId: undefined, ...partial };
}

function referencePosts(now: number): Record<'mia' | 'jon' | 'sofia', PostDetailModel> {
  return {
    mia: referencePost('mia', {
      postedAtMs: now - 2 * HOUR,
      audience: 'public',
      sessionId: undefined,
      poster: {
        kind: 'workout',
        theme: 'custom',
        gradient: ['#FF5AC8', '#6A1B7A'],
        kicker: 'KINETIC · MONDAY, JUNE 9',
        heroValue: '7,860',
        heroUnit: 'kg',
        workoutName: 'Legs · Hypertrophy',
        duration: '52:40',
        sets: '22',
        prPills: ['SQUAT PR', '125 KG × 5', 'PERSONAL BEST'],
      },
      kudosSeed: { total: 14, people: ['alex', 'jon', 'sofia'] },
      commentCountBase: 5,
      seedThread: false,
    }),
    jon: referencePost('jon', {
      postedAtMs: now - 18 * HOUR,
      audience: 'public',
      sessionId: undefined,
      poster: {
        kind: 'milestone',
        value: '100',
        unit: 'SESSIONS',
        subtitle: 'Three years in the making',
        range: 'MARCH 2022 – JUNE 2025',
      },
      kudosSeed: { total: 32, people: ['alex', 'mia', 'sofia'] },
      commentCountBase: 11,
      seedThread: false,
    }),
    sofia: referencePost('sofia', {
      postedAtMs: now - 24 * HOUR,
      audience: 'friends',
      sessionId: undefined,
      poster: {
        kind: 'workout',
        theme: 'custom',
        gradient: ['#4ADE80', '#0B5C46'],
        kicker: 'KINETIC · SUNDAY, JUNE 8',
        heroValue: '6,240',
        heroUnit: 'kg',
        workoutName: 'Pull Day',
        duration: '48:15',
        sets: '18',
        prPills: ['DEADLIFT PR', '160 KG × 3'],
      },
      kudosSeed: { total: 21, people: ['alex', 'mia', 'jon'] },
      commentCountBase: 4,
      seedThread: false,
    }),
  };
}

/** Reference captions, verbatim from the contract (Screen 1). */
export const REFERENCE_CAPTIONS: Record<'mia' | 'jon' | 'sofia', string> = {
  mia: 'Squat 125 for five — third attempt at this weight, and the belt finally stayed on.',
  jon: 'Three years, one hundred sessions. Started at 40 kg on the bar and no idea what a split was.',
  sofia: 'Deadlift 160 for three. Two years of chipping away at the same bar.',
};

function resolveModel(
  items: SessionUserEvent[],
  ownUserId: string | undefined,
  postId: string,
): PostDetailModel | undefined {
  if (postId === 'mia' || postId === 'jon' || postId === 'sofia') {
    const post = referencePosts(Date.now())[postId];
    return { ...post, caption: REFERENCE_CAPTIONS[postId] };
  }
  if (postId === 'alex') {
    const own = items
      .filter((item) => item.userId === ownUserId)
      .sort((a, b) => b.timestamp.toEpochMilli() - a.timestamp.toEpochMilli());
    return alexModel(own[0]);
  }
  const item = items.find((x) => x.eventId === postId);
  if (item && item.userId === ownUserId) {
    return alexModel(item);
  }
  return undefined;
}

export const selectPostDetailModel = createSelector(
  [
    (state: RootState) => selectFeedSessionItems(state),
    (state: RootState) => selectOwnFeedUserId(state),
    (_state: RootState, postId: string) => postId,
  ],
  (items, ownUserId, postId) => resolveModel(items, ownUserId, postId),
);

/** "Mia, Jon and 4 others" — the contract's label shape for every kudos row. */
export function formatKudosLabel(people: FeedPerson[], total: number, othersText: (count: number) => string): string {
  const names = people.slice(0, 2).map((p) => p.name.split(' ')[0]);
  const rest = total - names.length;
  if (rest <= 0) {
    return names.join(' and ');
  }
  return `${names.join(', ')} ${othersText(rest)}`;
}

export function personName(id: string): string {
  return personById(id)?.name ?? id;
}
