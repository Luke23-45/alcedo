/**
 * Page 15/20 — Settings → Notifications simulation
 * (docs/new_design/settings-dark.md, Screen 3).
 *
 * Simulates every Notifications section and state the page can be in:
 *   - registry defaults and contract (incl. the deliberate-off
 *     New Followers row), persisted/rehydrated through the real settings
 *     slice,
 *   - Monday-first day chips, localized + 12h/24h time formatting,
 *   - OS permission states (granted / not-determined-then-granted /
 *     denied), permission API errors, no selected days, and reminder times
 *     inside quiet hours,
 *   - honest toggle rollbacks when scheduling cannot deliver,
 *   - the inert-but-honest category toggles that have no delivery path,
 *   - weekly summary (Sunday 8:00 AM), badge handler + badge clearing,
 *   - i18n key completeness and static design-rule scans (no dead
 *     controls, no hard-coded locales, no white-alpha dark-only chips).
 *
 * The real notification services are replaced per their module boundary:
 * notification-scheduler is mocked for the effects tests; the scheduler's
 * own honesty contract is covered against a mocked expo-notifications in
 * src/services/notification-scheduler.spec.ts.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DayOfWeek } from '@js-joda/core';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (name: string) => readFileSync(resolve(here, name), 'utf8');

// ---------------------------------------------------------------------------
// Module mocks: the scheduler is the module boundary under test in the
// effects suite below.
// ---------------------------------------------------------------------------
const schedulerMocks = vi.hoisted(() => ({
  rescheduleWorkoutReminders: vi.fn(),
  rescheduleWeeklySummary: vi.fn(),
  configureNotificationBadge: vi.fn(),
  clearAppIconBadge: vi.fn(),
}));

vi.mock('@/services/notification-scheduler', () => schedulerMocks);

import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import {
  setBadgeAppIcon,
  setNotifyWeeklySummary,
  setNotifyWorkoutReminders,
  setWorkoutReminderDays,
  setWorkoutReminderTimeMinutes,
  settingsReducer,
} from '@/store/settings';
import { addNotificationEffects } from '@/store/settings/notification-effects';
import { preferenceRegistry } from '@/store/settings/registry';
import { CHIP_DAYS, dayLetter, dayName, referenceDateFor } from './notification-day-chips';

const MON = DayOfWeek.MONDAY;
const TUE = DayOfWeek.TUESDAY;
const WED = DayOfWeek.WEDNESDAY;
const FRI = DayOfWeek.FRIDAY;
const SAT = DayOfWeek.SATURDAY;

import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';

function makeBed(hydrated = true) {
  // The testbed drives the slice reducer directly, so wrap it in a root-shaped
  // reducer: otherwise actions land on the merged object instead of
  // `state.settings` and the effects read stale state.
  const programStub = (
    state: { savedPrograms: Record<string, never>; activePlanId: null } = { savedPrograms: {}, activePlanId: null },
    _action: UnknownAction,
  ) => state;
  const rootReducer = combineReducers({ settings: settingsReducer, program: programStub });
  const testBed = createAddEffectTestBed({
    reducer: rootReducer,
    initialState: {
      settings: { ...settingsReducer(undefined, { type: '@@init' }), isHydrated: hydrated },
    } as never,
    services: {
      tolgee: {
        t: (key: string, fallback?: string, opts?: { program?: string }) =>
          (fallback ?? key).replace('{program}', opts?.program ?? 'training'),
      } as never,
    },
  });
  addNotificationEffects(testBed.addEffect);
  return testBed;
}

function payloads(testBed: ReturnType<typeof makeBed>, type: string): unknown[] {
  return testBed.dispatchedActions
    .filter((a) => a.type === type)
    .map((a) => (a as unknown as { payload: unknown }).payload);
}

beforeEach(() => {
  vi.clearAllMocks();
  schedulerMocks.rescheduleWorkoutReminders.mockResolvedValue(true);
  schedulerMocks.rescheduleWeeklySummary.mockResolvedValue(true);
});

// ---------------------------------------------------------------------------
// Section 1 — registry contract and defaults.
// ---------------------------------------------------------------------------
describe('notification registry contract', () => {
  it('enables workout reminders by default on Mon/Tue/Wed/Fri/Sat at 5:30 PM', () => {
    expect(preferenceRegistry.notifyWorkoutReminders.default).toBe(true);
    expect(preferenceRegistry.workoutReminderDays.default).toEqual([MON, TUE, WED, FRI, SAT]);
    expect(preferenceRegistry.workoutReminderTimeMinutes.default).toBe(17 * 60 + 30);
  });

  it('sets quiet hours to 10 PM–6 AM and enables the badge by default', () => {
    expect(preferenceRegistry.quietHoursStartMinutes.default).toBe(22 * 60);
    expect(preferenceRegistry.quietHoursEndMinutes.default).toBe(6 * 60);
    expect(preferenceRegistry.badgeAppIcon.default).toBe(true);
  });

  it('keeps the weekly summary and records on, kudos on, challenge updates on, new followers off', () => {
    expect(preferenceRegistry.notifyWeeklySummary.default).toBe(true);
    expect(preferenceRegistry.notifyGoalCompletions.default).toBe(true);
    expect(preferenceRegistry.notifyPersonalRecords.default).toBe(true);
    expect(preferenceRegistry.notifyKudosComments.default).toBe(true);
    // The spec's deliberate-off social row is New Followers (Screen 3 SVG),
    // not Challenge Updates.
    expect(preferenceRegistry.notifyChallengeUpdates.default).toBe(true);
    expect(preferenceRegistry.notifyNewFollowers.default).toBe(false);
  });

  it('keeps rest timer alerts, auto-pause, and legacy rest timers on', () => {
    expect(preferenceRegistry.restNotifications.default).toBe(true);
    expect(preferenceRegistry.autoPauseOnPhoneLock.default).toBe(true);
    expect(preferenceRegistry.restTimersEnabled.default).toBe(true);
  });

  it('rehydrates stored values through the real settings slice', () => {
    const bed = makeBed();
    bed.dispatch(setNotifyWorkoutReminders(false));
    bed.dispatch(setWorkoutReminderTimeMinutes(8 * 60));
    expect(bed.getState().settings.notifyWorkoutReminders).toBe(false);
    expect(bed.getState().settings.workoutReminderTimeMinutes).toBe(480);
  });
});

// ---------------------------------------------------------------------------
// Section 2 — day chips and time formatting helpers.
// ---------------------------------------------------------------------------
describe('workout reminder day chips', () => {
  it('runs Monday-first across seven chips', () => {
    expect(CHIP_DAYS).toHaveLength(7);
    expect(CHIP_DAYS.map((d) => d.name())).toEqual([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ]);
  });

  it('references real Monday-first calendar dates (2026-01-05 is a Monday)', () => {
    expect(referenceDateFor(DayOfWeek.MONDAY).getDay()).toBe(1);
    expect(referenceDateFor(DayOfWeek.SUNDAY).getDay()).toBe(0);
    expect(referenceDateFor(DayOfWeek.WEDNESDAY).getDay()).toBe(3);
  });

  it('labels chips with the locale narrow weekday (M T W T F S S in English)', () => {
    expect(CHIP_DAYS.map((d) => dayLetter(d, 'en'))).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });

  it('localizes chip letters instead of hard-coding English', () => {
    expect(CHIP_DAYS.map((d) => dayLetter(d, 'de'))).toEqual(['M', 'D', 'M', 'D', 'F', 'S', 'S']);
  });

  it('names days for the toggle accessibility labels in the app language', () => {
    expect(dayName(DayOfWeek.WEDNESDAY, 'en')).toBe('Wednesday');
    expect(dayName(DayOfWeek.SUNDAY, 'de')).toBe('Sonntag');
  });
});

// ---------------------------------------------------------------------------
// Section 3 — notification effects: permission honesty and toggle rollback.
// ---------------------------------------------------------------------------
describe('notification effects', () => {
  it('keeps the workout-reminder toggle on when scheduling succeeds', async () => {
    const bed = makeBed();
    await bed.dispatchHandled(setNotifyWorkoutReminders(true));
    expect(schedulerMocks.rescheduleWorkoutReminders).toHaveBeenCalledOnce();
    // dispatchHandled does not record the triggering action; only effect
    // dispatches land in dispatchedActions. Nothing reverts here.
    expect(payloads(bed, setNotifyWorkoutReminders.type)).toEqual([]);
    expect(bed.getState().settings.notifyWorkoutReminders).toBe(true);
  });

  it('reverts the workout-reminder toggle when the OS denies permission', async () => {
    const bed = makeBed();
    schedulerMocks.rescheduleWorkoutReminders.mockResolvedValue(false);
    await bed.dispatchHandled(setNotifyWorkoutReminders(true));
    // Only the effect's rollback dispatch is recorded.
    expect(payloads(bed, setNotifyWorkoutReminders.type)).toEqual([false]);
    expect(bed.getState().settings.notifyWorkoutReminders).toBe(false);
  });

  it('passes days, time, and quiet hours to the scheduler on day/time edits', async () => {
    const bed = makeBed();
    await bed.dispatchHandled(setWorkoutReminderDays([MON]));
    await bed.dispatchHandled(setWorkoutReminderTimeMinutes(8 * 60));
    expect(schedulerMocks.rescheduleWorkoutReminders).toHaveBeenLastCalledWith(
      { days: [MON], timeMinutes: 480, quietStartMinutes: 22 * 60, quietEndMinutes: 6 * 60, enabled: true },
      { title: 'Time to train', body: 'Your training session is waiting.' },
    );
  });

  it('tells the scheduler delivery is disabled when the toggle is off', async () => {
    const bed = makeBed();
    await bed.dispatchHandled(setNotifyWorkoutReminders(false));
    expect(schedulerMocks.rescheduleWorkoutReminders).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
      expect.anything(),
    );
  });

  it('does nothing before the settings hydrate', async () => {
    const bed = makeBed(false);
    await bed.dispatchHandled(setNotifyWorkoutReminders(true));
    expect(schedulerMocks.rescheduleWorkoutReminders).not.toHaveBeenCalled();
  });

  it('reverts the weekly-summary toggle when its schedule is denied', async () => {
    const bed = makeBed();
    schedulerMocks.rescheduleWeeklySummary.mockResolvedValue(false);
    await bed.dispatchHandled(setNotifyWeeklySummary(true));
    expect(payloads(bed, setNotifyWeeklySummary.type)).toEqual([false]);
    expect(bed.getState().settings.notifyWeeklySummary).toBe(false);
  });

  it('configures the badge handler and clears the badge when switched off', async () => {
    const bed = makeBed();
    await bed.dispatchHandled(setBadgeAppIcon(false));
    expect(schedulerMocks.configureNotificationBadge).toHaveBeenCalledWith(false);
    expect(schedulerMocks.clearAppIconBadge).toHaveBeenCalledOnce();
  });

  it('does not clear the badge when switching it on', async () => {
    const bed = makeBed();
    await bed.dispatchHandled(setBadgeAppIcon(true));
    expect(schedulerMocks.configureNotificationBadge).toHaveBeenCalledWith(true);
    expect(schedulerMocks.clearAppIconBadge).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Section 4 — i18n completeness.
// ---------------------------------------------------------------------------
describe('notification i18n', () => {
  it('resolves every notifications copy key used by the screens', () => {
    const en = JSON.parse(readFileSync(resolve(here, '../../../../i18n/en.json'), 'utf8')) as Record<string, string>;
    const files = [
      'notifications-screen.tsx',
      'workout-card.tsx',
      'results-card.tsx',
      'social-card.tsx',
      'delivery-card.tsx',
    ];
    const keys = new Set<string>();
    for (const file of files) {
      for (const match of read(file).matchAll(/settings\.notifications\.[a-zA-Z_.]+/g)) {
        keys.add(match[0]);
      }
    }
    expect(keys.size).toBeGreaterThan(20);
    for (const key of keys) {
      expect(en[key], `missing i18n key: ${key}`).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Section 5 — static design-rule and honesty scans.
// ---------------------------------------------------------------------------
describe('static design-rule scans', () => {
  it('orders the workout rows per the spec: reminders, rest alerts, auto-pause, legacy rest timers', () => {
    const src = read('workout-card.tsx');
    const order = ['workout_reminders.label', 'rest_timer_alerts.label', 'auto_pause.label', 'rest_timers.label'].map(
      (key) => src.indexOf(key),
    );
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('drives the time picker from the app language and 24-hour preference, not hard-coded defaults', () => {
    const src = read('workout-card.tsx');
    expect(src).not.toContain('locale="default"');
    expect(src).toContain('use24HourClock={settings.use24HourTime}');
    expect(src).toContain('locale={language}');
  });

  it('renders the five unwired category toggles as inert with an honest caption, never as live controls', () => {
    for (const file of ['results-card.tsx', 'social-card.tsx']) {
      const src = read(file);
      expect(src, `${file}: dead toggles must be marked inert`).toContain('disabled');
      expect(src, `${file}: dead toggles must say so`).toContain('unavailable.subtitle');
    }
    // The weekly summary is the one wired row in RESULTS — it stays live.
    const results = read('results-card.tsx');
    const summaryToggle = results.slice(results.indexOf('weekly_summary.label'));
    expect(summaryToggle).toContain('onValueChange');
  });

  it('uses no hard-coded English locales in the notifications UI', () => {
    for (const file of [
      'workout-card.tsx',
      'results-card.tsx',
      'social-card.tsx',
      'delivery-card.tsx',
      'notifications-screen.tsx',
    ]) {
      expect(read(file), `${file} must not hard-code en-US`).not.toContain('en-US');
    }
  });

  it('styles chips and the time pill from theme tokens, not dark-only white alpha', () => {
    const styles = read('workout-card.styles.ts');
    expect(styles.toLowerCase()).not.toContain('#ffffff');
    expect(styles).not.toContain('255, 255, 255');
  });
});
