/**
 * The bundled default feed.
 *
 * Twelve sample posts from the eleven fictional default-graph people,
 * served when no backend is connected so the feed is never an empty shell.
 * Alex's slot is the real user's identity and carries no sample post.
 * This content is fictional sample data — it is presentation-layer only,
 * never uploaded, never persisted as real feed state, and never counted
 * in genuine social metrics. The screen always discloses the sample
 * nature next to this content.
 *
 * Ages are seeded truthfully relative to `now` at build time, so the
 * relative-time labels are always honest. Metrics are internally consistent
 * per post. All captions follow the Kinetic voice: no emojis, no shouting.
 */
import anaTrailPhoto from '../../../../assets/feed/posts/ana-trail.jpg';
import devRunPhoto from '../../../../assets/feed/posts/dev-run.jpg';
import sofiaDeadliftPoster from '../../../../assets/feed/posts/sofia-deadlift-poster.jpg';
import sofiaDeadliftVideo from '../../../../assets/feed/posts/sofia-deadlift.mp4';
import tomSquatPhoto from '../../../../assets/feed/posts/tom-squat.jpg';
import zoeKettlebellPhoto from '../../../../assets/feed/posts/zoe-kettlebell.jpg';
import { PEOPLE } from './shared/people';
import type { TimelinePost } from './timeline/timeline-data';

const HOUR = 3_600_000;

/** Ages of the twelve default posts, seeded relative to build time. */
const POST_AGES: Record<string, number> = {
  'mia-squat-pr': 2 * HOUR,
  'dev-sunrise-run': 5 * HOUR,
  'sofia-deadlift-video': 9 * HOUR,
  'jon-100-sessions': 18 * HOUR,
  'lena-bench-pr': 24 * HOUR,
  'tom-leg-day': 31 * HOUR,
  'priya-first-pullup': 38 * HOUR,
  'marcus-press': 46 * HOUR,
  'ana-trail-run': 55 * HOUR,
  'kenji-front-squat': 64 * HOUR,
  'zoe-park-circuit': 72 * HOUR,
  'dev-push-day': 80 * HOUR,
};

export function buildDefaultPosts(now: number): TimelinePost[] {
  const at = (id: string): number => now - (POST_AGES[id] ?? 24 * HOUR);
  // The poster kicker names the workout's own day, so it is derived from the
  // seeded timestamp — never a frozen calendar date that would disagree with
  // the relative "2h" age beside it.
  const kickerDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const kickerFor = (postedAt: number): string => `KINETIC · ${kickerDate.format(new Date(postedAt)).toUpperCase()}`;
  return [
    {
      kind: 'workout',
      id: 'mia-squat-pr',
      person: PEOPLE.mia!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: at('mia-squat-pr'),
      caption: 'Squat 125 for five — third attempt at this weight, and the belt finally stayed on.',
      poster: {
        kicker: kickerFor(at('mia-squat-pr')),
        heroValue: '7,860',
        heroUnit: 'kg',
        workoutName: 'Legs · Hypertrophy',
        duration: '52:40',
        sets: '22',
        prPills: ['SQUAT PR', '125 KG × 5', 'PERSONAL BEST'],
        gradient: { colors: ['#FF5AC8', '#6A1B7A'] },
      },
      kudos: { faceIds: ['alex', 'jon', 'sofia'], total: 14 },
      comments: 5,
      inChallenge: true,
    },
    {
      kind: 'photo',
      id: 'dev-sunrise-run',
      person: PEOPLE.dev!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: at('dev-sunrise-run'),
      caption: 'Five quiet kilometers before the city woke up. Legs still remember Tuesday.',
      photo: devRunPhoto,
      kudos: { faceIds: ['mia', 'priya', 'ana'], total: 18 },
      comments: 3,
      inChallenge: true,
    },
    {
      kind: 'video',
      id: 'sofia-deadlift-video',
      person: PEOPLE.sofia!,
      isOwn: false,
      badge: null,
      audience: 'friends',
      postedAt: at('sofia-deadlift-video'),
      caption: 'Deadlift 160 for three. Two years of chipping away at the same bar.',
      video: sofiaDeadliftVideo,
      poster: sofiaDeadliftPoster,
      kudos: { faceIds: ['mia', 'jon', 'priya'], total: 27 },
      comments: 6,
      inChallenge: true,
    },
    {
      kind: 'milestone',
      id: 'jon-100-sessions',
      person: PEOPLE.jon!,
      isOwn: false,
      badge: 'milestone',
      audience: 'public',
      postedAt: at('jon-100-sessions'),
      caption: 'Three years, one hundred sessions. Started at 40 kg on the bar and no idea what a split was.',
      milestone: {
        value: '100',
        unit: 'SESSIONS',
        tagline: 'Three years in the making',
        dateRange: 'MARCH 2022 – JUNE 2025',
      },
      kudos: { faceIds: ['alex', 'mia', 'sofia'], total: 32 },
      comments: 11,
      inChallenge: true,
    },
    {
      kind: 'workout',
      id: 'lena-bench-pr',
      person: PEOPLE.lena!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: at('lena-bench-pr'),
      caption: 'Bench 80 for five. The sticking point finally moved.',
      poster: {
        kicker: kickerFor(at('lena-bench-pr')),
        heroValue: '5,410',
        heroUnit: 'kg',
        workoutName: 'Push · Strength',
        duration: '47:20',
        sets: '19',
        prPills: ['BENCH PR', '80 KG × 5'],
        gradient: { colors: ['#5AC8FA', '#0A3D62'] },
      },
      kudos: { faceIds: ['tom', 'ana', 'zoe'], total: 16 },
      comments: 4,
      inChallenge: false,
    },
    {
      kind: 'photo',
      id: 'tom-leg-day',
      person: PEOPLE.tom!,
      isOwn: false,
      badge: null,
      audience: 'friends',
      postedAt: at('tom-leg-day'),
      caption: 'Leg day. The bar felt honest today.',
      photo: tomSquatPhoto,
      kudos: { faceIds: ['lena', 'marcus', 'dev'], total: 12 },
      comments: 2,
      inChallenge: false,
    },
    {
      kind: 'milestone',
      id: 'priya-first-pullup',
      person: PEOPLE.priya!,
      isOwn: false,
      badge: 'milestone',
      audience: 'public',
      postedAt: at('priya-first-pullup'),
      caption: 'First strict pull-up. Two years of bands and negatives.',
      milestone: {
        value: '1',
        unit: 'STRICT PULL-UP',
        tagline: 'Two years in the making',
        dateRange: 'SEPT 2024 – SEPT 2026',
      },
      kudos: { faceIds: ['dev', 'zoe', 'ana'], total: 24 },
      comments: 7,
      inChallenge: false,
    },
    {
      kind: 'workout',
      id: 'marcus-press',
      person: PEOPLE.marcus!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: at('marcus-press'),
      caption: 'Press 60 for five. Shoulders are finally catching up.',
      poster: {
        kicker: kickerFor(at('marcus-press')),
        heroValue: '4,980',
        heroUnit: 'kg',
        workoutName: 'Shoulders · Strength',
        duration: '43:05',
        sets: '16',
        prPills: ['PRESS PR', '60 KG × 5'],
        gradient: { colors: ['#FF9F0A', '#B34700'] },
      },
      kudos: { faceIds: ['tom', 'kenji', 'jon'], total: 11 },
      comments: 2,
      inChallenge: true,
    },
    {
      kind: 'photo',
      id: 'ana-trail-run',
      person: PEOPLE.ana!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: at('ana-trail-run'),
      caption: 'Ten slow kilometers through the pines. No watch, no splits.',
      photo: anaTrailPhoto,
      kudos: { faceIds: ['lena', 'zoe', 'priya'], total: 15 },
      comments: 3,
      inChallenge: false,
    },
    {
      kind: 'workout',
      id: 'kenji-front-squat',
      person: PEOPLE.kenji!,
      isOwn: false,
      badge: null,
      audience: 'friends',
      postedAt: at('kenji-front-squat'),
      caption: 'Front squat 100 for three. Elbows stayed up the whole set.',
      poster: {
        kicker: kickerFor(at('kenji-front-squat')),
        heroValue: '6,120',
        heroUnit: 'kg',
        workoutName: 'Legs · Strength',
        duration: '49:50',
        sets: '20',
        prPills: ['FRONT SQUAT PR', '100 KG × 3'],
        gradient: { colors: ['#AF52DE', '#3A1B5C'] },
      },
      kudos: { faceIds: ['marcus', 'dev', 'tom'], total: 9 },
      comments: 1,
      inChallenge: false,
    },
    {
      kind: 'photo',
      id: 'zoe-park-circuit',
      person: PEOPLE.zoe!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: at('zoe-park-circuit'),
      caption: 'Park circuit: swings, goblet squats, carries. Sixty minutes, zero walls.',
      photo: zoeKettlebellPhoto,
      kudos: { faceIds: ['ana', 'priya', 'lena'], total: 21 },
      comments: 5,
      inChallenge: true,
    },
    {
      kind: 'workout',
      id: 'dev-push-day',
      person: PEOPLE.dev!,
      isOwn: false,
      badge: null,
      audience: 'public',
      postedAt: at('dev-push-day'),
      caption: 'Dips finally moved past bodyweight plus ten.',
      poster: {
        kicker: kickerFor(at('dev-push-day')),
        heroValue: '5,940',
        heroUnit: 'kg',
        workoutName: 'Push · Hypertrophy',
        duration: '44:10',
        sets: '17',
        prPills: ['DIP PR', '+10 KG × 8'],
        gradient: { colors: ['#64D2FF', '#0A4D7A'] },
      },
      kudos: { faceIds: ['mia', 'marcus', 'jon'], total: 8 },
      comments: 0,
      inChallenge: false,
    },
  ];
}

/** The bundled default post ids, newest first. */
export const DEFAULT_POST_IDS: string[] = Object.keys(POST_AGES);
