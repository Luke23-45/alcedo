import { RemoteData } from "@/models/remote";
import { AddEffectFn } from "@/store/store";
import {
  initializeSettingsStateSlice,
  setExportToHealthAggregator,
  setIsHydrated,
  setLastBackup,
  setPreferredLanguage,
  setProToken,
} from "@/store/settings";
import {
  buildPreferenceAction,
  isPreferenceAction,
  preferenceKeys,
  preferenceRegistry,
  PrefKey,
  PrefValue,
  setterForKey,
} from "@/store/settings/registry";
import { addExportBackupEffects } from "@/store/settings/export-backup-effects";
import { addExportPlaintextEffects } from "@/store/settings/export-plaintext-effects";
import { addExportPreviewEffects } from "@/store/settings/export-preview-effects";
import { addImportBackupEffects } from "@/store/settings/import-backup-effects";
import { addImportExternalEffects } from "@/store/settings/import-external-effects";
import { addRemoteBackupEffects } from "@/store/settings/remote-backup-effects";
import { addNotificationEffects } from "@/store/settings/notification-effects";

import Purchases from "react-native-purchases";
import { I18nManager, Platform } from "react-native";
import { detectLanguageFromDateLocale } from "@/utils/language-detector";
import { ensureLocaleLoaded, supportedLanguages } from "@/services/tolgee";
import { initializeStoredSessionsStateSlice } from "@/store/stored-sessions";
import { builtInBackendId } from "@/models/backend";

// Read every generically-hydrated key, then dispatch its setter.
// One failing key must not block every other setting from hydrating.
async function hydrateGenericPreferences(
  preferenceService: { getPreference: <K extends PrefKey>(key: K) => Promise<PrefValue<K>> },
  dispatch: (action: unknown) => void,
  onKeyError: (key: string, error: unknown) => void,
) {
  const keys = preferenceKeys.filter(
    (key) =>
      preferenceRegistry[key].codec && (preferenceRegistry[key].hydrate ?? "generic") === "generic",
  );
  await Promise.all(
    keys.map(async (key) => {
      try {
        const value = await preferenceService.getPreference(key);
        dispatch(buildPreferenceAction(key, value));
      } catch (e) {
        onKeyError(key, e);
      }
    }),
  );
}

export function applySettingsEffects(addEffect: AddEffectFn) {
  addEffect(
    initializeSettingsStateSlice,
    async (_, { cancelActiveListeners, dispatch, onFail, extra: { preferenceService, logger } }) => {
      const start = performance.now();
      cancelActiveListeners();
      // A hydration failure must never strand the app on the loading screen.
      onFail(() => dispatch(setIsHydrated(true)));

      await hydrateGenericPreferences(preferenceService, dispatch, (key, e) =>
        logger.error(`Failed to hydrate preference ${key}`, e),
      );

      // Bespoke hydration: sync read, composite keys, and composed values.
      dispatch(setPreferredLanguage(preferenceService.getPreferredLanguage()));

      // Kick off stored-sessions init NOW, in parallel with the remaining
      // settings work below (backup status, pro token). Its only settings
      // dependencies are the generic preferences and preferredLanguage, both
      // set above — it must not wait for the network/KV tail.
      dispatch(initializeStoredSessionsStateSlice());

      const [lastSuccessfulRemoteBackupHash, lastBackupTime, lastBackupBackendId] =
        await Promise.all([
          preferenceService.getLastSuccessfulRemoteBackupHash(),
          preferenceService.getLastBackupTime(),
          preferenceService.getLastBackupBackendId(),
        ]);
      dispatch(
        setLastBackup(
          lastSuccessfulRemoteBackupHash
            ? RemoteData.success({
                lastSuccessfulRemoteBackupHash: lastSuccessfulRemoteBackupHash,
                lastBackupTime: lastBackupTime,
                backendId: lastBackupBackendId ?? builtInBackendId,
              })
            : RemoteData.notAsked(),
        ),
      );

      const proToken = await preferenceService.getProToken();
      dispatch(setProToken(proToken));

      if (!__DEV__) {
        // A missing or failing RevenueCat configuration must never brick startup hydration.
        // process.env entries are untyped here — quarantine the any at the boundary.
        const rawRevenueCatKey: unknown =
          Platform.OS === "ios"
            ? process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY
            : process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY;
        const revenueCatKey = typeof rawRevenueCatKey === "string" && rawRevenueCatKey.length > 0 ? rawRevenueCatKey : undefined;
        if (revenueCatKey) {
          try {
            Purchases.configure({ apiKey: revenueCatKey });
          } catch (err) {
            logger.error("Failed to configure RevenueCat", err);
          }
        } else {
          logger.warn("RevenueCat API key is not set; purchases are disabled", {});
        }
      }
      dispatch(setIsHydrated(true));
      // initializeStoredSessionsStateSlice is dispatched earlier (right after
      // the generic preferences + language) so its DB reads run in parallel
      // with the backup-status/pro-token tail above.
      // Deferred past hydration: these are network round-trips (100ms–2s+)
      // that only matter for pro/paywall features. Blocking TTI on them is
      // pure launch latency. Fire-and-forget; failures are logged, never fatal.
      if (proToken && !proToken.startsWith("$RCAnonymousID")) {
        void (async () => {
          try {
            const customerInfo = await Purchases.getCustomerInfo();
            await Purchases.syncPurchases();
            dispatch(setProToken(customerInfo.originalAppUserId));
            await preferenceService.setProToken(customerInfo.originalAppUserId);
          } catch (err) {
            logger.error("Failed to migrate user", err);
          }
        })();
      }
      const end = performance.now();
      logger.log(`initializeSettingsStateSlice effect took ${(end - start).toFixed(2)}ms`);
    },
  );

  // Generic persistence: one matcher over every key that opts into auto write-back.
  // The isHydrated guard stops the hydration dispatches above from writing straight
  // back what they just read.
  const persistedSetters = preferenceKeys
    .filter((key) => preferenceRegistry[key].codec && preferenceRegistry[key].persist !== false)
    .map((key) => setterForKey(key));
  addEffect(
    persistedSetters,
    async (action, { stateAfterReduce, extra: { preferenceService } }) => {
      if (!stateAfterReduce.settings.isHydrated || !isPreferenceAction(action)) {
        return;
      }
      await preferenceService.setPreference(
        action.meta.prefKey,
        action.payload as PrefValue<PrefKey>,
      );
    },
  );

  // Bespoke write-back for keys the generic effect skips (persist: false).
  addEffect(
    setPreferredLanguage,
    async (action, { stateAfterReduce, extra: { preferenceService, tolgee } }) => {
      if (stateAfterReduce.settings.isHydrated) {
        await preferenceService.setPreferredLanguage(action.payload);
      }
      const languageCode =
        action.payload ??
        detectLanguageFromDateLocale(supportedLanguages.map((x) => x.code)) ??
        "en";
      const languageSettings = supportedLanguages.find((x) => x.code === languageCode);
      // Load the locale's translations before switching so there's no flash
      // of untranslated keys.
      await ensureLocaleLoaded(tolgee, languageCode);
      await tolgee.changeLanguage(languageCode);
      I18nManager.forceRTL(!!languageSettings?.isRTL);
    },
  );

  addEffect(
    setExportToHealthAggregator,
    async (
      action,
      { stateAfterReduce, dispatch, extra: { preferenceService, healthExportService } },
    ) => {
      if (action.payload && !healthExportService.canExport()) {
        dispatch(setExportToHealthAggregator(false));
        return;
      }
      if (stateAfterReduce.settings.isHydrated) {
        if (action.payload) {
          await healthExportService.requestPermission();
        }
        await preferenceService.setPreference("exportToHealthAggregator", action.payload);
      }
    },
  );

  addEffect(setProToken, async (action, { stateAfterReduce, extra: { preferenceService } }) => {
    if (stateAfterReduce.settings.isHydrated) {
      await preferenceService.setProToken(action.payload);
    }
  });

  addEffect(setLastBackup, async (action, { stateAfterReduce, extra: { preferenceService } }) => {
    if (stateAfterReduce.settings.isHydrated && action.payload.isSuccess()) {
      // The three keys are independent files; write them concurrently instead of
      // three sequential round-trips.
      await Promise.all([
        preferenceService.setLastBackupTime(action.payload.data.lastBackupTime),
        preferenceService.setLastSuccessfulRemoteBackupHash(action.payload.data.lastSuccessfulRemoteBackupHash),
        preferenceService.setLastBackupBackendId(action.payload.data.backendId),
      ]);
    }
  });

  addExportPlaintextEffects(addEffect);
  addExportPreviewEffects(addEffect);
  addExportBackupEffects(addEffect);
  addImportBackupEffects(addEffect);
  addImportExternalEffects(addEffect);
  addRemoteBackupEffects(addEffect);
  addNotificationEffects(addEffect);
}
