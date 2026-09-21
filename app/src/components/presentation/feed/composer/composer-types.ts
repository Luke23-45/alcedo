import type { ComposerPostAudience, ComposerPostStatKey, ComposerPostTheme } from '@/store/feed/composer-posts';

/**
 * Composer domain types. The persisted post shape (theme / stat keys /
 * audience) is owned by the store slice — the single source of truth — and
 * re-exported here so the composer and the timeline agree on it.
 */

export type ComposerTheme = ComposerPostTheme;

export type ComposerStatKey = ComposerPostStatKey;

export type ComposerAudience = ComposerPostAudience;

/** All eight toggle stats in the order the reference lays them out. */
export interface StatDef {
  key: ComposerStatKey;
  /** Spec-drawn chip width in pt. */
  width: number;
  /** i18n key in feed.composer.json. */
  labelKey: string;
  fallback: string;
}

export const STAT_DEFS: StatDef[] = [
  { key: 'volume', width: 79, labelKey: 'feed.composer.stat.volume', fallback: 'Volume' },
  { key: 'duration', width: 91, labelKey: 'feed.composer.stat.duration', fallback: 'Duration' },
  { key: 'sets', width: 66, labelKey: 'feed.composer.stat.sets', fallback: 'Sets' },
  { key: 'reps', width: 66, labelKey: 'feed.composer.stat.reps', fallback: 'Reps' },
  { key: 'prs', width: 61, labelKey: 'feed.composer.stat.prs', fallback: 'PRs' },
  { key: 'heartrate', width: 103, labelKey: 'feed.composer.stat.heartrate', fallback: 'Heart rate' },
  { key: 'notes', width: 73, labelKey: 'feed.composer.stat.notes', fallback: 'Notes' },
  { key: 'rpe', width: 61, labelKey: 'feed.composer.stat.rpe', fallback: 'RPE' },
];

export const TOTAL_STATS = STAT_DEFS.length;

/** Stats ON in a fresh composer — the contract-locked visibility set. */
export const DEFAULT_VISIBLE_STATS: ComposerStatKey[] = ['volume', 'duration', 'sets', 'prs'];

export const AUDIENCES: ComposerAudience[] = ['friends', 'public', 'private'];

export const AUDIENCE_FRIEND_COUNT = 84;

export const CAPTION_MAX_LENGTH = 280;
