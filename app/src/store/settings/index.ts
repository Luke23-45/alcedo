import { Backend } from "@/models/backend";
import { LiftLog } from "@/gen/proto";
import { whatsNewEntries, WhatsNewEntry } from "@/models/whats-new";
import type { RootState } from "@/store";
import { BackupData, FeedBackupData } from "@/models/backup";
import type { ExternalImportFormat } from "@/services/csv-import";
import { WeightUnit } from "@/models/weight";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";
import {
  isPreferenceAction,
  LastBackup,
  LastExternalImport,
  LastRemoteBackupTest,
  preferenceKeys,
  preferenceRegistry,
  preferenceSetters,
  PrefKey,
  PrefValue,
  RemoteBackupErrorKind,
  BackupMode,
  RemoteBackupSettings,
} from "./registry";

import type { ExportPreviewCounts } from "@/services/plaintext-export-preview";

export type { ColorSchemeSeed, ThemeMode } from "./codecs";
export type { RemoteBackupSettings, LastBackup, LastRemoteBackupTest, LastExternalImport, RemoteBackupErrorKind, BackupMode };
export type { ExternalImportFormat };
export type { ExportPreviewCounts } from "@/services/plaintext-export-preview";

type PreferenceState = { [K in PrefKey]: PrefValue<K> };
type SettingsState = PreferenceState & {
  isHydrated: boolean;
  /** Transient: true while a manual Test upload (or its Retry) is in flight. */
  testInFlight: boolean;
  /** Transient: live export-preview counts for the plaintext export screen. */
  exportPreview: ExportPreviewCounts | undefined;
};

const initialState: SettingsState = {
  ...(Object.fromEntries(
    preferenceKeys.map((key) => [key, preferenceRegistry[key].default]),
  ) as PreferenceState),
  isHydrated: false,
  testInFlight: false,
  exportPreview: undefined,
};

/** What the exported selectors need off the root state. */
export type SettingsRootState = { settings: SettingsState };
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
    setTestInFlight(state, action: PayloadAction<boolean>) {
      state.testInFlight = action.payload;
    },
    setExportPreview(state, action: PayloadAction<ExportPreviewCounts | undefined>) {
      state.exportPreview = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Every generated setter carries its key in `meta`, so one matcher applies
    // them all - no per-key reducer.
    builder.addMatcher(isPreferenceAction, (state, action) => {
      (state as Record<PrefKey, unknown>)[action.meta.prefKey] = action.payload;
    });
  },
  selectors: {
    selectPreferredWeightUnit: (state): WeightUnit =>
      state.useImperialUnits ? "pounds" : "kilograms",
  },
});
export const initializeSettingsStateSlice = createAction("initializeSettingsStateSlice");
export type PlaintextExportFormat = "CSV" | "JSON";

export const importData = createAction("importData");
export const importDataSql = createAction<{ db: SQLiteDatabase }>("importDataSql");
export const importDataProto = createAction<{
  dao: LiftLog.Ui.Models.ExportedDataDao.ExportedDataDaoV2;
}>("importDataProto");
export type ImportBackupDataPayload = BackupData & {
  successMessage: string;
  /**
   * Present for FitNotes/StrongLifts CSV imports. The importBackupData effect
   * records it via setLastExternalImport after the session upserts commit —
   * the real success point, not the dispatch of the import request.
   */
  externalImport?: {
    format: ExternalImportFormat;
    workoutCount: number;
    setCount: number;
  };
};
export const importBackupData = createAction<ImportBackupDataPayload>("importBackupData");
export const beginFeedImport = createAction<FeedBackupData>("beginFeedImport");
export const exportData = createAction<{ includeFeed: boolean }>("exportData");

export const exportPlainText = createAction<{ format: PlaintextExportFormat }>("exportPlainText");

/** Pick a third-party export file and merge history via importBackupData. */
export const importFromExternal = createAction<{ format: ExternalImportFormat }>(
  "importFromExternal",
);

export const executeRemoteBackup = createAction<{
  /** Overrides the assigned backup backend, so the settings screen can test one before saving it. */
  backend?: Backend;
  force?: boolean;
  /**
   * Why this backup was requested. 'automatic' invocations (home focus)
   * run only when the user chose the Automatic mode; 'manual' (Back Up Now)
   * and 'test' (destination Test) are explicit user actions and run in
   * Automatic or Manual mode. Absent means 'automatic'. Nothing uploads
   * while the backup mode is Off.
   */
  reason?: 'automatic' | 'manual' | 'test';
}>("executeRemoteBackup");

export const remoteBackupSucceeded = createAction("remoteBackupSucceeded");

/**
 * Re-sends the payload cached by the last manual Test run without re-computing
 * it. Shares the Test in-flight UI and records a fresh last-tested entry.
 * No-op when nothing was cached.
 */
export const retryRemoteBackup = createAction("retryRemoteBackup");

/** Recomputes the plaintext export "will export" preview counts from the real DB. */
export const refreshExportPreview = createAction("refreshExportPreview");

export const { setIsHydrated, setTestInFlight, setExportPreview } = settingsSlice.actions;

export const {
  setUseImperialUnits,
  setShowBodyweight,
  setTipToShow,
  setLastSeenWhatsNewId,
  setShowFeed,
  setRestNotifications,
  setRestTimersEnabled,
  setCrashReportsEnabled,
  setWelcomeWizardCompleted,
  setBackupIncludeFeedAccount,
  setBackupMode,
  setLastBackup,
  setLastRemoteBackupTest,
  setLastExternalImport,
  setColorSchemeSeed,
  setFirstDayOfWeek,
  setProToken,
  setPlansSortOrder,
  setPreferredLanguage,
  setNotesExpandedByDefault,
  setKeepScreenAwakeDuringWorkout,
  setExportToHealthAggregator,
  setShowPostWorkoutSummary,
  setTrueBlackDarkTheme,
  setThemeMode,
  setRingGoalMove,
  setRingGoalExercise,
  setRingGoalStand,
  setWeeklyVolumeGoalKg,
  setUnitWeight,
  setUnitDistance,
  setUnitHeight,
  setProfileUsername,
  setProfileBio,
  setProfileVisibility,
  setPrivacyShareSessions,
  setPrivacyShowLeaderboards,
  setPrivacyShowPRs,
  setPrivacyAllowComments,
  setPrivacyShowHeartRate,
  setBlockedAccounts,
  setPlannerEnabled,
  setPlannerFocus,
  setPlannerTrainingDays,
  setPlannerTargetSessionMinutes,
  setPlannerTargetRpe,
  setPlannerWeeklyOverloadKg,
  setPlannerAutoDeload,
  setPlannerDeloadWeek,
  setCelebrationAnimations,
  setReduceMotion,
  setUse24HourTime,
  setNotifyWorkoutReminders,
  setWorkoutReminderDays,
  setWorkoutReminderTimeMinutes,
  setAutoPauseOnPhoneLock,
  setNotifyGoalCompletions,
  setNotifyPersonalRecords,
  setNotifyWeeklySummary,
  setNotifyKudosComments,
  setNotifyChallengeUpdates,
  setNotifyNewFollowers,
  setQuietHoursStartMinutes,
  setQuietHoursEndMinutes,
  setBadgeAppIcon,
} = preferenceSetters;

export const { selectPreferredWeightUnit } = settingsSlice.selectors;

export const selectApplicableWhatsNew = (state: RootState): WhatsNewEntry[] =>
  whatsNewEntries.filter((entry) => entry.condition?.(state) ?? true);

export const selectUnseenWhatsNew = (state: RootState): WhatsNewEntry[] =>
  selectApplicableWhatsNew(state).filter((entry) => entry.id > state.settings.lastSeenWhatsNewId);

export const selectHasUnseenWhatsNew = (state: RootState): boolean =>
  selectUnseenWhatsNew(state).length > 0;

export const settingsReducer = settingsSlice.reducer;
