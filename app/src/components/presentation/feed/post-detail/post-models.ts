import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { selectFeedSessionItems, selectOwnFeedUserId } from '@/store/feed';
import type { SessionUserEvent } from '@/models/feed-models';
import type { Session } from '@/models/session-models/session';
import { type FeedPerson, personById, type FeedPersonId } from '../shared/people';

/**
 * The post behind the detail screen: Alex's own post resolves to the real
 * published session; the twelve default posts resolve to the shared seed
 * catalog (see ../feed-seed.ts); anything else is unknown (the route renders
 * the "item unavailable" state).
 *
 * Source of truth: docs/new_design/social-dark.md — SOCIAL DATA CONTRACT and
 * SCREEN 2. Fields marked "real" below come from the store; the poster block
 * is the seed catalog's exact values, pixel-to-pixel.
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

export interface PhotoPosterData {
  kind: 'photo';
  photo: number;
}

export interface VideoPosterData {
  kind: 'video';
  video: number;
  poster: number;
}

export type PostPosterData = WorkoutPosterData | MilestonePosterData | PhotoPosterData | VideoPosterData;

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

import { buildDefaultPosts } from '../feed-seed';
import type { TimelinePost } from '../timeline/timeline-data';

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

function seedPoster(post: TimelinePost): PostPosterData {
  switch (post.kind) {
    case 'workout':
      return {
        kind: 'workout',
        theme: 'custom',
        // The seed sets a gradient on every workout post; the person's hue
        // is the honest fallback if a future post omits it.
        gradient: post.poster.gradient?.colors ?? [post.person.color, post.person.color],
        kicker: post.poster.kicker,
        heroValue: post.poster.heroValue,
        heroUnit: post.poster.heroUnit,
        workoutName: post.poster.workoutName,
        duration: post.poster.duration,
        sets: post.poster.sets,
        prPills: post.poster.prPills,
      };
    case 'milestone':
      return {
        kind: 'milestone',
        value: post.milestone.value,
        unit: post.milestone.unit,
        subtitle: post.milestone.tagline,
        range: post.milestone.dateRange,
      };
    case 'photo':
      return { kind: 'photo', photo: post.photo };
    case 'video':
      return { kind: 'video', video: post.video, poster: post.poster };
  }
}

/**
 * The twelve default posts, derived from the single shared seed so the
 * timeline and the detail screen can never disagree on values, ages, kudos,
 * or captions.
 */
function defaultPosts(now: number): Record<string, PostDetailModel> {
  const out: Record<string, PostDetailModel> = {};
  for (const post of buildDefaultPosts(now)) {
    out[post.id] = {
      id: post.id,
      authorId: post.person.id,
      isOwn: false,
      caption: post.caption ?? undefined,
      eventId: undefined,
      postedAtMs: post.postedAt,
      audience: post.audience,
      sessionId: undefined,
      poster: seedPoster(post),
      kudosSeed: { total: post.kudos.total, people: post.kudos.faceIds },
      commentCountBase: post.comments,
      seedThread: false,
    };
  }
  return out;
}

/** Default-post captions, from the shared seed (Screen 1). */
export const DEFAULT_CAPTIONS: Record<string, string> = Object.fromEntries(
  buildDefaultPosts(0)
    .filter((p) => p.caption != null)
    .map((p) => [p.id, p.caption!]),
);

function resolveModel(
  items: SessionUserEvent[],
  ownUserId: string | undefined,
  postId: string,
): PostDetailModel | undefined {
  const seed = defaultPosts(Date.now())[postId];
  if (seed) {
    return seed;
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
