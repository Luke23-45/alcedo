import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import {
  clearAppIconBadge,
  configureNotificationBadge,
  rescheduleWeeklySummary,
  rescheduleWorkoutReminders,
  type ReminderSchedule,
} from '@/services/notification-scheduler';
import {
  setBadgeAppIcon,
  setIsHydrated,
  setNotifyWeeklySummary,
  setNotifyWorkoutReminders,
  setUnitWeight,
  setUseImperialUnits,
  setWorkoutReminderDays,
  setWorkoutReminderTimeMinutes,
} from '@/store/settings';
import type { RootState } from '@/store';
import type { AddEffectFn } from '@/store/store';
import type { getTolgee } from '@/services/tolgee';

type Tolgee = ReturnType<typeof getTolgee>;

/**
 * Phase 6 (Screens 2–3) side effects for the settings slice.
 *
 * - Workout reminders + weekly summary are really scheduled through
 *   expo-notifications (deterministic identifiers, quiet-hours aware). If the
 *   OS denies permission the toggle reverts instead of lying.
 * - Badge App Icon really drives the notification handler's shouldSetBadge
 *   and clears the badge when switched off.
 * - The Units segmented control stays bidirectionally in sync with the legacy
 *   `useImperialUnits` boolean the rest of the app reads.
 */

function reminderSchedule(state: RootState): ReminderSchedule {
  const s = state.settings;
  return {
    days: s.workoutReminderDays,
    timeMinutes: s.workoutReminderTimeMinutes,
    quietStartMinutes: s.quietHoursStartMinutes,
    quietEndMinutes: s.quietHoursEndMinutes,
    enabled: s.notifyWorkoutReminders,
  };
}

function reminderStrings(tolgee: Tolgee, state: RootState): { title: string; body: string } {
  const program = state.program.savedPrograms[state.program.activePlanId];
  const programName = program?.name ?? 'training';
  return {
    title: tolgee.t(settingsKey('settings.notifications.reminder.title'), 'Time to train'),
    body: tolgee.t(settingsKey('settings.notifications.reminder.body'), 'Your {program} session is waiting.', {
      program: programName,
    }),
  };
}

function weeklyStrings(tolgee: Tolgee): { title: string; body: string } {
  return {
    title: tolgee.t(settingsKey('settings.notifications.weekly.title'), 'Your week in training'),
    body: tolgee.t(settingsKey('settings.notifications.weekly.body'), 'Your weekly summary is ready.'),
  };
}

export function addNotificationEffects(addEffect: AddEffectFn) {
  // Post-hydration: reconcile the two unit representations (the segmented
  // control is canonical), configure the badge flag, and (re)schedule.
  addEffect(
    setIsHydrated,
    async (action, { stateAfterReduce, dispatch, extra: { tolgee, logger } }) => {
      if (!action.payload) {
        return;
      }
      const settings = stateAfterReduce.settings;
      if (settings.useImperialUnits !== (settings.unitWeight === 'lb')) {
        dispatch(setUseImperialUnits(settings.unitWeight === 'lb'));
      }
      configureNotificationBadge(settings.badgeAppIcon);
      try {
        if (!settings.badgeAppIcon) {
          await clearAppIconBadge();
        }
        await rescheduleWorkoutReminders(reminderSchedule(stateAfterReduce), reminderStrings(tolgee, stateAfterReduce));
        await rescheduleWeeklySummary(settings.notifyWeeklySummary, weeklyStrings(tolgee));
      } catch (error) {
        logger?.warn?.('Failed to apply notification preferences', error);
      }
    },
  );

  // The Units segmented control drives the legacy boolean the app reads.
  addEffect(setUnitWeight, async (action, { dispatch }) => {
    dispatch(setUseImperialUnits(action.payload === 'lb'));
  });

  // Any reminder input → reschedule. A denied permission reverts the toggle:
  // the switch must never claim a reminder exists that the OS will not deliver.
  addEffect(
    [setNotifyWorkoutReminders, setWorkoutReminderDays, setWorkoutReminderTimeMinutes],
    async (action, { stateAfterReduce, dispatch, extra: { tolgee, logger } }) => {
      if (!stateAfterReduce.settings.isHydrated) {
        return;
      }
      try {
        const scheduled = await rescheduleWorkoutReminders(
          reminderSchedule(stateAfterReduce),
          reminderStrings(tolgee, stateAfterReduce),
        );
        if (!scheduled) {
          dispatch(setNotifyWorkoutReminders(false));
        }
      } catch (error) {
        logger?.warn?.('Failed to reschedule workout reminders', error);
      }
    },
  );

  addEffect(
    setNotifyWeeklySummary,
    async (action, { stateAfterReduce, dispatch, extra: { tolgee, logger } }) => {
      if (!stateAfterReduce.settings.isHydrated) {
        return;
      }
      try {
        const scheduled = await rescheduleWeeklySummary(action.payload, weeklyStrings(tolgee));
        if (!scheduled) {
          dispatch(setNotifyWeeklySummary(false));
        }
      } catch (error) {
        logger?.warn?.('Failed to reschedule weekly summary', error);
      }
    },
  );

  addEffect(setBadgeAppIcon, async (action, { stateAfterReduce, extra: { logger } }) => {
    if (!stateAfterReduce.settings.isHydrated) {
      return;
    }
    configureNotificationBadge(action.payload);
    if (!action.payload) {
      try {
        await clearAppIconBadge();
      } catch (error) {
        logger?.warn?.('Failed to clear app icon badge', error);
      }
    }
  });
}
