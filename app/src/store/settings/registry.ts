import { BackendId } from '@/models/backend';
import { RemoteData } from '@/models/remote';
import { DayOfWeek, Instant } from '@js-joda/core';
import { ActionCreatorWithPreparedPayload, createAction, UnknownAction } from '@reduxjs/toolkit';
import {
  boolCodec,
  Codec,
  colorSchemeSeedCodec,
  ColorSchemeSeed,
  dayOfWeekCodec,
  dayOfWeekListCodec,
  floatCodec,
  intCodec,
  PlansSortOrder,
  plansSortOrderCodec,
  stringCodec,
  stringListCodec,
  stringUnionCodec,
  ThemeMode,
  themeModeCodec,
} from './codecs';

/** Unit and visibility choices for the social profile editor (Phase 5). */
export type WeightUnitPref = 'kg' | 'lb';
export type DistanceUnitPref = 'km' | 'mi';
export type HeightUnitPref = 'cm' | 'ft';
export type ProfileVisibility = 'public' | 'friends' | 'private';

/** AI Planner training focus (Phase 6, Screen 4). */
export type PlannerFocus = 'strength' | 'hypertrophy' | 'conditioning';

/** Legacy shape, read once by the `IMPORT_BACKENDS` data migration and never written again. */
export interface RemoteBackupSettings {
  endpoint: string;
  apiKey: string;
  includeFeedAccount: boolean;
}

export interface LastBackup {
  lastSuccessfulRemoteBackupHash: string;
  /** Undefined for legacy backups recorded before the timestamp was stored. */
  lastBackupTime: Instant | undefined;
  /** Which backend received it, so repointing backup uploads again instead of matching the hash. */
  backendId: BackendId;
}

/** Honest classification of a failed remote-backup upload, for error copy. */
export type RemoteBackupErrorKind = 'connection' | 'http401' | 'http500' | 'http413' | 'httpOther' | 'unknown';

const REMOTE_BACKUP_ERROR_KINDS: readonly RemoteBackupErrorKind[] = [
  'connection',
  'http401',
  'http500',
  'http413',
  'httpOther',
  'unknown',
];

/**
 * Remote backup consent mode (privacy-first, opt-in).
 * - 'off' (default): never uploads anything.
 * - 'automatic': backs up when data changes.
 * - 'manual': uploads only from an explicit Back Up Now action.
 */
export type BackupMode = 'off' | 'automatic' | 'manual';

const BACKUP_MODES: readonly BackupMode[] = ['off', 'automatic', 'manual'];

/**
 * One manual Test-run record for the remote backup screen. Persisted between
 * sessions; written only by Test runs, never by silent auto-backup.
 */
export interface LastRemoteBackupTest {
  status: 'success' | 'error';
  time: Instant;
  /** Raw (uncompressed) payload bytes — success only. */
  uploadedBytes?: number;
  /** Gzip payload bytes — success only. */
  gzipBytes?: number;
  /** Total Test duration in milliseconds — success only. */
  durationMs?: number;
  /** Error classification — error only. */
  errorVariant?: RemoteBackupErrorKind;
  /** HTTP status code when errorVariant is 'httpOther'. */
  errorCode?: number;
}

/** The most recent successful import from another app. Persisted between sessions. */
export interface LastExternalImport {
  time: Instant;
  workoutCount: number;
  format: 'FitNotes' | 'StrongLifts';
  setCount: number;
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Instants persist as ISO strings; the runtime type stays Instant. */
function jsonInstant(raw: unknown): Instant | undefined {
  if (typeof raw !== 'string') {
    return undefined;
  }
  try {
    return Instant.parse(raw);
  } catch {
    return undefined;
  }
}

const lastRemoteBackupTestCodec: Codec<LastRemoteBackupTest | undefined> = {
  deserialize: (raw) => {
    if (!raw) {
      return undefined;
    }
    try {
      const value: unknown = JSON.parse(raw);
      if (!isJsonObject(value)) {
        return undefined;
      }
      if (value.status !== 'success' && value.status !== 'error') {
        return undefined;
      }
      const time = jsonInstant(value.time);
      if (time === undefined) {
        return undefined;
      }
      const test: LastRemoteBackupTest = { status: value.status, time };
      if (typeof value.uploadedBytes === 'number') {
        test.uploadedBytes = value.uploadedBytes;
      }
      if (typeof value.gzipBytes === 'number') {
        test.gzipBytes = value.gzipBytes;
      }
      if (typeof value.durationMs === 'number') {
        test.durationMs = value.durationMs;
      }
      if (
        typeof value.errorVariant === 'string' &&
        (REMOTE_BACKUP_ERROR_KINDS as readonly string[]).includes(value.errorVariant)
      ) {
        test.errorVariant = value.errorVariant as RemoteBackupErrorKind;
      }
      if (typeof value.errorCode === 'number') {
        test.errorCode = value.errorCode;
      }
      return test;
    } catch {
      return undefined;
    }
  },
  serialize: (value) => (value === undefined ? undefined : JSON.stringify({ ...value, time: value.time.toString() })),
};

const lastExternalImportCodec: Codec<LastExternalImport | undefined> = {
  deserialize: (raw) => {
    if (!raw) {
      return undefined;
    }
    try {
      const value: unknown = JSON.parse(raw);
      if (!isJsonObject(value)) {
        return undefined;
      }
      const time = jsonInstant(value.time);
      if (time === undefined) {
        return undefined;
      }
      if (typeof value.workoutCount !== 'number' || typeof value.setCount !== 'number') {
        return undefined;
      }
      if (value.format !== 'FitNotes' && value.format !== 'StrongLifts') {
        return undefined;
      }
      return { time, workoutCount: value.workoutCount, format: value.format, setCount: value.setCount };
    } catch {
      return undefined;
    }
  },
  serialize: (value) => (value === undefined ? undefined : JSON.stringify({ ...value, time: value.time.toString() })),
};

/**
 * One descriptor per preference is the single source of truth: the state field,
 * its default, hydration, and persistence are all derived from this.
 */
export interface PrefDescriptor<T> {
  default: T;
  /** When present, the key participates in generic hydrate + generic persist. */
  codec?: Codec<T>;
  /** Defaults to the registry key, keeping the on-disk name identical. */
  storageKey?: string;
  /**
   * `false` => a bespoke effect owns write-back (permission gates, dev guards,
   * composite keys), so the generic persist effect skips it.
   */
  persist?: boolean;
  /**
   * `'manual'` => the init effect reads it explicitly (sync reads, composite
   * keys, values composed from several keys).
   */
  hydrate?: 'generic' | 'manual';
  /** Read via `getItemSync` during hydration. */
  sync?: boolean;
}

const pref = <T>(descriptor: PrefDescriptor<T>): PrefDescriptor<T> => descriptor;

export const preferenceRegistry = {
  useImperialUnits: pref({ default: false, codec: boolCodec }),
  showBodyweight: pref({ default: true, codec: boolCodec }),
  showFeed: pref({ default: true, codec: boolCodec }),
  restNotifications: pref({ default: true, codec: boolCodec }),
  restTimersEnabled: pref({ default: true, codec: boolCodec }),
  crashReportsEnabled: pref({ default: true, codec: boolCodec }),
  welcomeWizardCompleted: pref({ default: false, codec: boolCodec }),
  notesExpandedByDefault: pref({ default: true, codec: boolCodec }),
  keepScreenAwakeDuringWorkout: pref({ default: true, codec: boolCodec }),
  showPostWorkoutSummary: pref({ default: false, codec: boolCodec }),
  trueBlackDarkTheme: pref({ default: false, codec: boolCodec }),
  tipToShow: pref({ default: 1, codec: intCodec }),
  lastSeenWhatsNewId: pref({ default: 0, codec: intCodec }),
  colorSchemeSeed: pref<ColorSchemeSeed>({ default: 'default', codec: colorSchemeSeedCodec }),
  themeMode: pref<ThemeMode>({ default: 'system', codec: themeModeCodec }),
  plansSortOrder: pref<PlansSortOrder>({ default: 'name', codec: plansSortOrderCodec }),
  firstDayOfWeek: pref<DayOfWeek>({ default: DayOfWeek.MONDAY, codec: dayOfWeekCodec }),

  // --- Social profile editor (Phase 5). Generic hydrate + persist via the
  // --- effects below; defaults mirror the social design contract.
  ringGoalMove: pref({ default: 650, codec: intCodec }),
  ringGoalExercise: pref({ default: 60, codec: intCodec }),
  ringGoalStand: pref({ default: 12, codec: intCodec }),
  weeklyVolumeGoalKg: pref({ default: 35000, codec: intCodec }),
  unitWeight: pref<WeightUnitPref>({ default: 'kg', codec: stringUnionCodec(['kg', 'lb']) }),
  unitDistance: pref<DistanceUnitPref>({ default: 'km', codec: stringUnionCodec(['km', 'mi']) }),
  unitHeight: pref<HeightUnitPref>({ default: 'cm', codec: stringUnionCodec(['cm', 'ft']) }),
  profileUsername: pref({ default: '', codec: stringCodec }),
  profileBio: pref({ default: '', codec: stringCodec }),
  profileVisibility: pref<ProfileVisibility>({
    default: 'friends',
    codec: stringUnionCodec(['public', 'friends', 'private']),
  }),
  privacyShareSessions: pref({ default: true, codec: boolCodec }),
  privacyShowLeaderboards: pref({ default: true, codec: boolCodec }),
  privacyShowPRs: pref({ default: true, codec: boolCodec }),
  privacyAllowComments: pref({ default: true, codec: boolCodec }),
  privacyShowHeartRate: pref({ default: false, codec: boolCodec }),
  blockedAccounts: pref<string[]>({ default: [], codec: stringListCodec }),

  // Generic read, but bespoke write-back (permission gate + revert).
  exportToHealthAggregator: pref({ default: false, codec: boolCodec, persist: false }),

  // Sync read + legacy rewrite; write-back also drives Tolgee/RTL.
  preferredLanguage: pref<string | undefined>({
    default: undefined,
    codec: stringCodec,
    persist: false,
    hydrate: 'manual',
    sync: true,
  }),

  // Write-back is a no-op in __DEV__; hydration carries the RevenueCat migration.
  proToken: pref<string | undefined>({
    default: undefined,
    codec: stringCodec,
    persist: false,
    hydrate: 'manual',
  }),

  backupIncludeFeedAccount: pref({ default: false, codec: boolCodec }),

  /**
   * Backup consent mode (privacy-first, opt-in; default 'off').
   * 'automatic' keeps the previous auto-backup-on-change behavior;
   * 'manual' uploads only from an explicit Back Up Now action.
   * Generic hydrate + persist.
   */
  backupMode: pref<BackupMode>({ default: 'off', codec: stringUnionCodec(BACKUP_MODES) }),

  // --- AI Planner configuration (Phase 6, Screen 4). Generic hydrate + persist
  // --- via the effects below; defaults mirror the planner design contract.
  /** Master switch for the AI planner. */
  plannerEnabled: pref({ default: true, codec: boolCodec }),
  /** Planner focus: strength, hypertrophy, or conditioning. */
  plannerFocus: pref<PlannerFocus>({
    default: 'strength',
    codec: stringUnionCodec(['strength', 'hypertrophy', 'conditioning']),
  }),
  /** Days the planner schedules training on; the rest are rest days. */
  plannerTrainingDays: pref<DayOfWeek[]>({
    default: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY],
    codec: dayOfWeekListCodec,
  }),
  /** Target session length in minutes (slider 30–90). */
  plannerTargetSessionMinutes: pref({ default: 45, codec: intCodec }),
  /** Target effort as RPE (slider 5–10). */
  plannerTargetRpe: pref({ default: 7.5, codec: floatCodec }),
  /** Weekly overload added to main lifts, in the preferred weight unit. */
  plannerWeeklyOverloadKg: pref({ default: 2.5, codec: floatCodec }),
  /** Whether the planner schedules an automatic deload week. */
  plannerAutoDeload: pref({ default: true, codec: boolCodec }),
  /** ISO date (yyyy-MM-dd) of the next scheduled deload week; undefined means "3 weeks from now". */
  plannerDeloadWeek: pref<string | undefined>({ default: undefined, codec: stringCodec }),

  // --- Appearance (Phase 6, Screen 2). Generic hydrate + persist.
  /** Whether earned-celebration animations (kudos bursts) play. */
  celebrationAnimations: pref({ default: true, codec: boolCodec }),
  /** User-level reduced motion: calms every animation that honors the OS setting. */
  reduceMotion: pref({ default: false, codec: boolCodec }),
  /** 24-hour clock across the app; off means every clock shows AM/PM. */
  use24HourTime: pref({ default: false, codec: boolCodec }),

  // --- Notification preferences (Phase 6, Screen 3). Generic hydrate + persist.
  /** Daily workout reminder notifications. */
  notifyWorkoutReminders: pref({ default: true, codec: boolCodec }),
  /** Days the workout reminder fires; defaults mirror the training split. */
  workoutReminderDays: pref<DayOfWeek[]>({
    default: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY],
    codec: dayOfWeekListCodec,
  }),
  /** Workout reminder fire time, minutes after midnight (17:30). */
  workoutReminderTimeMinutes: pref({ default: 17 * 60 + 30, codec: intCodec }),
  /** Pause the rest timer when the phone locks mid-workout. */
  autoPauseOnPhoneLock: pref({ default: true, codec: boolCodec }),
  /** Goal-completion notifications. */
  notifyGoalCompletions: pref({ default: true, codec: boolCodec }),
  /** Personal-record notifications. */
  notifyPersonalRecords: pref({ default: true, codec: boolCodec }),
  /** Weekly summary notification, Sundays at 8:00 AM. */
  notifyWeeklySummary: pref({ default: true, codec: boolCodec }),
  /** Kudos & comments notifications. */
  notifyKudosComments: pref({ default: true, codec: boolCodec }),
  /** Challenge-update notifications. On per the contract SVG (Screen 3). */
  notifyChallengeUpdates: pref({ default: true, codec: boolCodec }),
  /**
   * New-follower notifications. Deliberately off: the contract's one quiet
   * category (settings-dark.md Screen 3 shows this toggle off).
   */
  notifyNewFollowers: pref({ default: false, codec: boolCodec }),
  /** Quiet hours start, minutes after midnight (22:00). Scheduled notifications wait. */
  quietHoursStartMinutes: pref({ default: 22 * 60, codec: intCodec }),
  /** Quiet hours end, minutes after midnight (6:00). */
  quietHoursEndMinutes: pref({ default: 6 * 60, codec: intCodec }),
  /** Whether notifications may badge the app icon. */
  badgeAppIcon: pref({ default: true, codec: boolCodec }),

  // Fully bespoke: composed from two keys + settings, persisted only on success.
  lastBackup: pref<RemoteData<LastBackup, string>>({
    default: RemoteData.notAsked(),
    persist: false,
    hydrate: 'manual',
  }),

  // --- Remote backup Test runs (backup redesign). Generic hydrate + persist;
  // --- written only by manual Test runs (or their Retry), never by silent auto-backup.
  lastRemoteBackupTest: pref<LastRemoteBackupTest | undefined>({
    default: undefined,
    codec: lastRemoteBackupTestCodec,
  }),

  // --- Import from other apps (backup redesign). Generic hydrate + persist;
  // --- written on each successful external import.
  lastExternalImport: pref<LastExternalImport | undefined>({
    default: undefined,
    codec: lastExternalImportCodec,
  }),
} satisfies Record<string, PrefDescriptor<unknown>>;

export type PreferenceRegistry = typeof preferenceRegistry;
export type PrefKey = keyof PreferenceRegistry;
export type PrefValue<K extends PrefKey> = PreferenceRegistry[K] extends PrefDescriptor<infer T> ? T : never;

export const preferenceKeys = Object.keys(preferenceRegistry) as PrefKey[];

const capitalize = <S extends string>(value: S): Capitalize<S> =>
  (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<S>;

// Marks a preference-setter action so a single matcher reducer/effect can handle
// every key generically while the wire `type` stays `settings/set<Key>`.
export interface PreferenceActionMeta {
  prefKey: PrefKey;
}

// The generated setters preserve the historical action names and payload types
// (`setColorSchemeSeed(value)` etc.) so no call site changes.
export type PreferenceSetters = {
  [K in PrefKey as `set${Capitalize<K & string>}`]: ActionCreatorWithPreparedPayload<
    [PrefValue<K>],
    PrefValue<K>,
    `settings/set${Capitalize<K & string>}`,
    never,
    PreferenceActionMeta
  >;
};

export const preferenceSetters = Object.fromEntries(
  preferenceKeys.map((key) => [
    `set${capitalize(key)}`,
    createAction(`settings/set${capitalize(key)}`, (value: unknown) => ({
      payload: value,
      meta: { prefKey: key } satisfies PreferenceActionMeta,
    })),
  ]),
) as unknown as PreferenceSetters;

export function setterForKey<K extends PrefKey>(key: K): PreferenceSetters[`set${Capitalize<K & string>}`] {
  return preferenceSetters[`set${capitalize(key)}`];
}

// Builds a setter action for a key whose type is only known generically. A
// generically-indexed action creator can't be called directly (TS infers a
// `never` parameter), so the setter is cast to a plain function of its value.
export function buildPreferenceAction<K extends PrefKey>(key: K, value: PrefValue<K>): PreferenceAction {
  const create = setterForKey(key) as unknown as (value: PrefValue<K>) => PreferenceAction;
  return create(value);
}

export interface PreferenceAction extends UnknownAction {
  payload: unknown;
  meta: PreferenceActionMeta;
}

export function isPreferenceAction(action: UnknownAction): action is PreferenceAction {
  const meta = (action as { meta?: { prefKey?: unknown } }).meta;
  return !!meta && typeof meta.prefKey === 'string' && meta.prefKey in preferenceRegistry;
}
