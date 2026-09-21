import { PEOPLE, type FeedPerson } from '../shared/people';

/**
 * Feed timeline data contract — Screen 1 of docs/new_design/social-dark.md.
 *
 * People: the locked social graph lives in shared/people.ts (contract order).
 * Reference posts (Mia, Jon, Sofia) are fictional sample content: their ages
 * are seeded truthfully relative to `now` at build time so the "2h / 18h /
 * 1d" labels are always honest. Alex's own post is assembled by the screen
 * container from the user's real latest session (composer-data derivation).
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
}

export type TimelinePost = TimelineWorkoutPost | TimelineMilestonePost;

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

/** Reference ages, seeded truthfully relative to now (contract: 2h, 18h, 1d). */
const HOUR = 3_600_000;
const REFERENCE_AGES: Record<'mia' | 'jon' | 'sofia', number> = {
  mia: 2 * HOUR,
  jon: 18 * HOUR,
  sofia: 24 * HOUR,
};

/**
 * The three fictional sample posts. Captions are the contract copy with the
 * single emoji stripped (no emojis anywhere in the app). Gradients are the
 * exact contract values.
 */
export function buildReferencePosts(now: number): TimelinePost[] {
  return [
    {
      kind: 'workout',
      id: 'mia',
      person: PEOPLE.mia!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: now - REFERENCE_AGES.mia,
      caption: 'Squat 125 for five — third attempt at this weight, and the belt finally stayed on.',
      poster: {
        kicker: 'KINETIC · MONDAY, JUNE 9',
        heroValue: '7,860',
        heroUnit: 'kg',
        workoutName: 'Legs · Hypertrophy',
        duration: '52:40',
        sets: '22',
        prPills: ['SQUAT PR', '125 KG × 5', 'PERSONAL BEST'],
        gradient: { colors: ['#FF5AC8', '#6A1B7A'] },
      },
      kudos: {
        faceIds: ['alex', 'jon', 'sofia'],
        total: 14,
      },
      comments: 5,
      inChallenge: true,
    },
    {
      kind: 'milestone',
      id: 'jon',
      person: PEOPLE.jon!,
      isOwn: false,
      badge: 'milestone',
      audience: 'public',
      postedAt: now - REFERENCE_AGES.jon,
      caption: 'Three years, one hundred sessions. Started at 40 kg on the bar and no idea what a split was.',
      kudos: {
        faceIds: ['alex', 'mia', 'sofia'],
        total: 32,
      },
      comments: 11,
      inChallenge: true,
    },
    {
      kind: 'workout',
      id: 'sofia',
      person: PEOPLE.sofia!,
      isOwn: false,
      badge: null,
      audience: 'friends',
      postedAt: now - REFERENCE_AGES.sofia,
      caption: 'Deadlift 160 for three. Two years of chipping away at the same bar.',
      poster: {
        kicker: 'KINETIC · SUNDAY, JUNE 8',
        heroValue: '6,240',
        heroUnit: 'kg',
        workoutName: 'Pull Day',
        duration: '48:15',
        sets: '18',
        prPills: ['DEADLIFT PR', '160 KG × 3'],
        gradient: { colors: ['#4ADE80', '#0B5C46'] },
      },
      kudos: {
        faceIds: ['alex', 'mia', 'jon'],
        total: 21,
      },
      comments: 4,
      inChallenge: true,
    },
  ];
}

/** Weekly-challenge banner contract values (Screen 1 spec). */
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
} as const;

/** Circle post total shown in the footer ("Showing N of 128 posts"). */
export const CIRCLE_POST_TOTAL = 128;

export function formatChallengePoints(points: number): string {
  return points.toLocaleString('en-US');
}
