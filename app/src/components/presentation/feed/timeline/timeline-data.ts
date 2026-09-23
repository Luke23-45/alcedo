import type { FeedPerson } from '../shared/people';

/**
 * The bundled default feed: twelve posts from the default social graph,
 * served when no backend is connected so the feed is never an empty shell.
 * Ages are seeded truthfully relative to `now` at build time, so the
 * "2h / 5h / 9h …" labels are always honest. Photos and the clip are bundled
 * assets (see ../feed-seed.ts); Alex's own post is assembled separately
 * by the screen container from the user's real latest session.
 */

export type TimelineFilter = 'all' | 'following' | 'prs' | 'milestones' | 'challenge';

export interface TimelineFilterDef {
  id: TimelineFilter;
  labelKey: string;
  fallback: string;
  emptyTitleKey: string;
  emptyTitleFallback: string;
  emptyBodyKey: string;
  emptyBodyFallback: string;
}

export const TIMELINE_FILTERS: TimelineFilterDef[] = [
  {
    id: 'all',
    labelKey: 'feed.timeline.filter.all',
    fallback: 'All',
    emptyTitleKey: 'feed.timeline.empty.all.title',
    emptyTitleFallback: 'No posts yet',
    emptyBodyKey: 'feed.timeline.empty.all.body',
    emptyBodyFallback: "When your circle shares workouts, they'll appear here.",
  },
  {
    id: 'following',
    labelKey: 'feed.timeline.filter.following',
    fallback: 'Following',
    emptyTitleKey: 'feed.timeline.empty.following.title',
    emptyTitleFallback: 'Nothing from your circle',
    emptyBodyKey: 'feed.timeline.empty.following.body',
    emptyBodyFallback: 'Posts from people you follow will show up here.',
  },
  {
    id: 'prs',
    labelKey: 'feed.timeline.filter.prs',
    fallback: 'PRs',
    emptyTitleKey: 'feed.timeline.empty.prs.title',
    emptyTitleFallback: 'No PRs yet',
    emptyBodyKey: 'feed.timeline.empty.prs.body',
    emptyBodyFallback: "When your circle hits a personal record, it'll be celebrated here.",
  },
  {
    id: 'milestones',
    labelKey: 'feed.timeline.filter.milestones',
    fallback: 'Milestones',
    emptyTitleKey: 'feed.timeline.empty.milestones.title',
    emptyTitleFallback: 'No milestones yet',
    emptyBodyKey: 'feed.timeline.empty.milestones.body',
    emptyBodyFallback: 'Big moments from your circle will land here.',
  },
  {
    id: 'challenge',
    labelKey: 'feed.timeline.filter.challenge',
    fallback: 'Challenge',
    emptyTitleKey: 'feed.timeline.empty.challenge.title',
    emptyTitleFallback: 'No challenge posts yet',
    emptyBodyKey: 'feed.timeline.empty.challenge.body',
    emptyBodyFallback: "Posts from this week's challengers will show up here.",
  },
];

export interface TimelinePosterData {
  kicker: string;
  heroValue: string;
  heroUnit: string;
  workoutName: string;
  duration: string;
  sets: string;
  prPills: string[];
  gradient?: {
    colors: [string, string] | [string, string, string];
    locations?: [number, number] | [number, number, number];
  };
}

export interface TimelineKudosSeed {
  /** Person ids backing the seed faces, newest first (matches the sibling's Screen 2 seeds). */
  faceIds: string[];
  /** Baseline kudos count from the contract. */
  total: number;
}

/** Live kudos for a card: faces resolved from the shared feedComments store. */
export interface PostKudos {
  total: number;
  faces: FeedPerson[];
  kudoed: boolean;
}

export interface TimelinePostBase {
  id: string;
  person: FeedPerson;
  isOwn: boolean;
  badge: 'you' | 'milestone' | null;
  audience: 'friends' | 'public';
  postedAt: number;
  caption: string | null;
  kudos: TimelineKudosSeed;
  comments: number;
  inChallenge: boolean;
}

export interface TimelineWorkoutPost extends TimelinePostBase {
  kind: 'workout';
  poster: TimelinePosterData;
}

export interface TimelineMilestonePost extends TimelinePostBase {
  kind: 'milestone';
  milestone: {
    value: string;
    unit: string;
    tagline: string;
    dateRange: string;
  };
}

export interface TimelinePhotoPost extends TimelinePostBase {
  kind: 'photo';
  /** Bundled photo (Metro asset id), rendered as the card hero. */
  photo: number;
}

export interface TimelineVideoPost extends TimelinePostBase {
  kind: 'video';
  /** Bundled clip (Metro asset id), plays on tap. */
  video: number;
  /** Still shown until the user taps play. */
  poster: number;
}

export type TimelinePost = TimelineWorkoutPost | TimelineMilestonePost | TimelinePhotoPost | TimelineVideoPost;

export function postHasPrPills(post: TimelinePost): boolean {
  return post.kind === 'workout' && post.poster.prPills.length > 0;
}

/**
 * Filter semantics (Screen 1 contract):
 * - all: everything
 * - following: circle posts from people you follow (excludes your own post —
 *   your own posts aren't "from people you follow")
 * - prs: posts carrying at least one PR pill
 * - milestones: milestone posts
 * - challenge: posts by participants in the current weekly challenge
 */
export function postMatchesFilter(post: TimelinePost, filter: TimelineFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'following':
      return !post.isOwn;
    case 'prs':
      return postHasPrPills(post);
    case 'milestones':
      return post.kind === 'milestone';
    case 'challenge':
      return post.inChallenge;
  }
}

/** Kudos-label derivation for the card footer: "A", "A and B", "A, B and N others". */
export interface KudosLabelParts {
  kind: 'none' | 'one' | 'two' | 'many';
  first?: string;
  second?: string;
  name?: string;
  others?: number;
}

/**
 * Pure kudos-label decomposition for i18n: "Mia", "Mia and Jon",
 * "Mia, Jon and 4 others". The screen renders it through the t() keys.
 */
export function describeKudosLabel(names: string[], total: number): KudosLabelParts {
  if (total <= 0 || names.length === 0) return { kind: 'none' };
  if (total === 1) return { kind: 'one', name: names[0] };
  if (total === 2) return { kind: 'two', first: names[0], second: names[1] };
  return { kind: 'many', first: names[0], second: names[1], others: total - 2 };
}

/**
 * Weekly-challenge banner contract values (Screen 1 spec). The track fills as
 * a fraction of the leader (10,340 / 12,480 = 82.85%) — a percentage of the
 * measured track, never the 200pt reference constant (same rule as the trends
 * muscle-track fix). `trackFill` stays in points for the contract test.
 */
export const CHALLENGE = {
  titlePoints: 10_340,
  leaderPoints: 12_480,
  rank: 3,
  participants: 128,
  daysLeft: 3,
  /** Track fill: 10,340 / 12,480 × 200pt = 165.7pt. */
  trackWidth: 200,
  get trackFill(): number {
    return (this.titlePoints / this.leaderPoints) * this.trackWidth;
  },
  /** Fill as a percentage of whatever the measured track is. */
  get trackFillPct(): number {
    return (this.titlePoints / this.leaderPoints) * 100;
  },
} as const;

const pointsFormatters = new Map<string, Intl.NumberFormat>();

/**
 * Grouped points in the caller's locale. Defaults to en-US (the contract
 * catalog + its spec expectations are English-pinned); the banner passes
 * settings.preferredLanguage.
 */
export function formatChallengePoints(points: number, locale?: string): string {
  const key = locale ?? 'en-US';
  const existing = pointsFormatters.get(key);
  if (existing) return existing.format(points);
  const created = new Intl.NumberFormat(key, { maximumFractionDigits: 0 });
  pointsFormatters.set(key, created);
  return created.format(points);
}
