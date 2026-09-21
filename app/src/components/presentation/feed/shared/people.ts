/**
 * The locked social graph for the Phase 5 Kinetic Feed.
 *
 * Source of truth: docs/new_design/social-dark.md — SOCIAL DATA CONTRACT.
 * Do not invent people here; the screen builders render exactly this graph.
 * Challenge ranks/points live in the contract but are owned by the challenge
 * components, not by the avatar identity this file describes.
 */

export interface FeedPerson {
  id: string;
  name: string;
  handle: string;
  /** Single initial rendered inside the avatar. */
  initial: string;
  /** Two-stop diagonal gradient fill, or null for a solid hue. */
  gradient: [string, string] | null;
  /** Solid hue; the primary stop for gradient avatars. */
  color: string;
}

export const PEOPLE: Record<string, FeedPerson> = {
  alex: {
    id: 'alex',
    name: 'Alex Rivera',
    handle: '@alexr',
    initial: 'A',
    gradient: ['#5856D6', '#BF5AF2'],
    color: '#5856D6',
  },
  mia: { id: 'mia', name: 'Mia Chen', handle: '@mia', initial: 'M', gradient: null, color: '#FF4FB8' },
  jon: { id: 'jon', name: 'Jon Reyes', handle: '@jonr', initial: 'J', gradient: null, color: '#0A84FF' },
  sofia: {
    id: 'sofia',
    name: 'Sofia Marques',
    handle: '@sofia',
    initial: 'S',
    gradient: null,
    color: '#30D158',
  },
  dev: { id: 'dev', name: 'Dev Patel', handle: '@dev', initial: 'D', gradient: null, color: '#FF9F0A' },
  lena: {
    id: 'lena',
    name: 'Lena Fischer',
    handle: '@lena',
    initial: 'L',
    gradient: null,
    color: '#AF52DE',
  },
  tom: { id: 'tom', name: 'Tom Okafor', handle: '@tom', initial: 'T', gradient: null, color: '#32ADE6' },
};

export type FeedPersonId = keyof typeof PEOPLE;

/** The seven contract people in contract order. */
export const FEED_PEOPLE: FeedPerson[] = [
  PEOPLE.alex!,
  PEOPLE.mia!,
  PEOPLE.jon!,
  PEOPLE.sofia!,
  PEOPLE.dev!,
  PEOPLE.lena!,
  PEOPLE.tom!,
];

export function personById(id: string): FeedPerson | undefined {
  return PEOPLE[id];
}
