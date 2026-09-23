/**
 * The default social graph for the ALCEDO Feed.
 *
 * Source of truth: docs/new_design/social-dark.md — SOCIAL DATA CONTRACT.
 * These twelve people back the bundled default posts served when no backend
 * is connected (see ../seed/feed-seed.ts); the screen builders render exactly
 * this graph. Challenge ranks/points live in the contract but are owned by
 * the challenge components, not by the avatar identity this file describes.
 */
import anaPhoto from '../../../../../assets/feed/avatars/ana.jpg';
import devPhoto from '../../../../../assets/feed/avatars/dev.jpg';
import jonPhoto from '../../../../../assets/feed/avatars/jon.jpg';
import kenjiPhoto from '../../../../../assets/feed/avatars/kenji.jpg';
import lenaPhoto from '../../../../../assets/feed/avatars/lena.jpg';
import marcusPhoto from '../../../../../assets/feed/avatars/marcus.jpg';
import miaPhoto from '../../../../../assets/feed/avatars/mia.jpg';
import priyaPhoto from '../../../../../assets/feed/avatars/priya.jpg';
import sofiaPhoto from '../../../../../assets/feed/avatars/sofia.jpg';
import tomPhoto from '../../../../../assets/feed/avatars/tom.jpg';
import zoePhoto from '../../../../../assets/feed/avatars/zoe.jpg';

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
  /**
   * Bundled avatar photo (Metro asset id). Rendered when present; the
   * gradient/initial below stays as the fallback identity. `alex` carries no
   * photo: that slot is the real user's identity, never a fictional face.
   */
  photo?: number;
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
  mia: {
    id: 'mia',
    name: 'Mia Chen',
    handle: '@mia',
    initial: 'M',
    gradient: null,
    color: '#FF4FB8',
    photo: miaPhoto,
  },
  jon: {
    id: 'jon',
    name: 'Jon Reyes',
    handle: '@jonr',
    initial: 'J',
    gradient: null,
    color: '#0A84FF',
    photo: jonPhoto,
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia Marques',
    handle: '@sofia',
    initial: 'S',
    gradient: null,
    color: '#30D158',
    photo: sofiaPhoto,
  },
  dev: {
    id: 'dev',
    name: 'Dev Patel',
    handle: '@dev',
    initial: 'D',
    gradient: null,
    color: '#FF9F0A',
    photo: devPhoto,
  },
  lena: {
    id: 'lena',
    name: 'Lena Fischer',
    handle: '@lena',
    initial: 'L',
    gradient: null,
    color: '#AF52DE',
    photo: lenaPhoto,
  },
  tom: {
    id: 'tom',
    name: 'Tom Okafor',
    handle: '@tom',
    initial: 'T',
    gradient: null,
    color: '#32ADE6',
    photo: tomPhoto,
  },
  priya: {
    id: 'priya',
    name: 'Priya Nair',
    handle: '@priya',
    initial: 'P',
    gradient: null,
    color: '#64D2FF',
    photo: priyaPhoto,
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Webb',
    handle: '@marcus',
    initial: 'M',
    gradient: null,
    color: '#FF6A3D',
    photo: marcusPhoto,
  },
  ana: {
    id: 'ana',
    name: 'Ana Petrova',
    handle: '@ana',
    initial: 'A',
    gradient: null,
    color: '#7D7AFF',
    photo: anaPhoto,
  },
  kenji: {
    id: 'kenji',
    name: 'Kenji Tanaka',
    handle: '@kenji',
    initial: 'K',
    gradient: null,
    color: '#D9A441',
    photo: kenjiPhoto,
  },
  zoe: {
    id: 'zoe',
    name: 'Zoe Adams',
    handle: '@zoe',
    initial: 'Z',
    gradient: null,
    color: '#BF5AF2',
    photo: zoePhoto,
  },
};

export type FeedPersonId = keyof typeof PEOPLE;

/** The twelve default-graph people in feed order. */
export const FEED_PEOPLE: FeedPerson[] = [
  PEOPLE.alex!,
  PEOPLE.mia!,
  PEOPLE.jon!,
  PEOPLE.sofia!,
  PEOPLE.dev!,
  PEOPLE.lena!,
  PEOPLE.tom!,
  PEOPLE.priya!,
  PEOPLE.marcus!,
  PEOPLE.ana!,
  PEOPLE.kenji!,
  PEOPLE.zoe!,
];

export function personById(id: string): FeedPerson | undefined {
  return PEOPLE[id];
}
