import { TimePickerModal } from 'react-native-paper-dates';
import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import {
  setAutoPauseOnPhoneLock,
  setNotifyWorkoutReminders,
  setRestNotifications,
  setRestTimersEnabled,
  setWorkoutReminderDays,
  setWorkoutReminderTimeMinutes,
} from '@/store/settings';
import { broadcastWorkoutEvent } from '@/store/workout-worker';
import { workoutUpdatedEvent } from '@/store/workout-worker/helpers';
import { selectActiveSession } from '@/store/stored-sessions';
import { formatMinutesAsTime } from '@/services/notification-schedule';
import { DayOfWeek } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PreferenceRow } from '../preferences/preference-row';
import { RowSeparator } from '../preferences/preference-row.styles';
import * as S from './workout-card.styles';

/** Monday-first day order, matching the spec chip row. */
const CHIP_DAYS = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

/** Date in the reference week (2026-01-05 was a Monday) for a weekday. */
function referenceDateFor(day: DayOfWeek): Date {
  return new Date(2026, 0, 5 + (day.value() - 1));
}

/** Localized single-letter day mark ("M", "T" …), spec-style. */
function dayLetter(day: DayOfWeek, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(referenceDateFor(day));
}

/**
 * WORKOUT card (settings-dark.md Screen 3): workout reminders with inline
 * day chips + time pill, rest timer alerts, auto-pause on lock.
 *
 * The reminder toggle keeps the existing permission behaviour: if the OS
 * denies notification permission the settings effects revert the toggle.
 * Rest Timer Alerts preserves the old route's worker broadcast so a running
 * workout's rest notifications start/stop immediately.
 */
export function WorkoutCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);
  const currentWorkout = useAppSelector(selectActiveSession);
  const [timeOpen, setTimeOpen] = useState(false);

  const remindersOn = settings.notifyWorkoutReminders;
  const timersOn = settings.restTimersEnabled;
  const reminderDays = settings.workoutReminderDays;
  const reminderTime = settings.workoutReminderTimeMinutes;

  const toggleDay = (day: DayOfWeek) => {
    const next = reminderDays.includes(day) ? reminderDays.filter((d) => d !== day) : [...reminderDays, day];
    dispatch(setWorkoutReminderDays(next));
  };

  const onRestAlertsChange = (value: boolean) => {
    dispatch(setRestNotifications(value));
    if (currentWorkout) {
      dispatch(broadcastWorkoutEvent({ type: value ? 'WorkoutStartedEvent' : 'WorkoutEndedEvent' }));
      dispatch(broadcastWorkoutEvent(workoutUpdatedEvent(currentWorkout, settings.restTimersEnabled)));
    }
  };

  return (
    <SettingsGroup label={t(settingsKey('settings.notifications.workout.header'), 'WORKOUT')}>
      <S.Block>
        <PreferenceRow
          title={t(settingsKey('settings.notifications.rest_timers.label'), 'Rest Timers')}
          subtitle={t(settingsKey('settings.notifications.rest_timers.subtitle'), 'Countdown between sets')}
          trailing={
            <SettingsToggle
              value={timersOn}
              onValueChange={(v) => dispatch(setRestTimersEnabled(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.rest_timers.label'), 'Rest Timers')}
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.rest_timer_alerts.label'), 'Rest Timer Alerts')}
          subtitle={t(
            settingsKey('settings.notifications.rest_timer_alerts.subtitle'),
            'Haptic + sound when rest ends',
          )}
          trailing={
            <SettingsToggle
              value={settings.restNotifications}
              onValueChange={onRestAlertsChange}
              accessibilityLabel={t(settingsKey('settings.notifications.rest_timer_alerts.label'), 'Rest Timer Alerts')}
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.workout_reminders.label'), 'Workout Reminders')}
          trailing={
            <SettingsToggle
              value={remindersOn}
              onValueChange={(v) => dispatch(setNotifyWorkoutReminders(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.workout_reminders.label'), 'Workout Reminders')}
            />
          }
        />
        <S.ReminderArea $dimmed={!remindersOn}>
          <S.DayCells
            accessibilityRole="radiogroup"
            accessibilityLabel={t(settingsKey('settings.notifications.workout_reminders.label'), 'Workout Reminders')}
          >
            {CHIP_DAYS.map((day) => {
              const active = reminderDays.includes(day);
              const label = dayLetter(day, settings.preferredLanguage ?? undefined);
              return (
                <S.DayCell
                  key={day.name()}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: active, disabled: !remindersOn }}
                  accessibilityLabel={new Intl.DateTimeFormat(settings.preferredLanguage ?? undefined, {
                    weekday: 'long',
                  }).format(referenceDateFor(day))}
                  disabled={!remindersOn}
                  onPress={() => toggleDay(day)}
                >
                  <S.DayChip $active={active}>
                    <S.DayLetter $active={active}>{label}</S.DayLetter>
                  </S.DayChip>
                </S.DayCell>
              );
            })}
          </S.DayCells>
          <S.TimeCell
            accessibilityRole="button"
            accessibilityLabel={t(settingsKey('settings.notifications.workout_reminders.label'), 'Workout Reminders')}
            disabled={!remindersOn}
            onPress={() => setTimeOpen(true)}
          >
            <S.TimePill>
              <S.TimeText>{formatMinutesAsTime(reminderTime, settings.use24HourTime)}</S.TimeText>
            </S.TimePill>
          </S.TimeCell>
        </S.ReminderArea>
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.auto_pause.label'), 'Auto-pause on Phone Lock')}
          subtitle={t(
            settingsKey('settings.notifications.auto_pause.subtitle'),
            'Pauses the rest timer when the screen locks',
          )}
          trailing={
            <SettingsToggle
              value={settings.autoPauseOnPhoneLock}
              onValueChange={(v) => dispatch(setAutoPauseOnPhoneLock(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.auto_pause.label'), 'Auto-pause on Phone Lock')}
            />
          }
        />
      </S.Block>

      <TimePickerModal
        locale="default"
        visible={timeOpen}
        onDismiss={() => setTimeOpen(false)}
        onConfirm={({ hours, minutes }) => {
          dispatch(setWorkoutReminderTimeMinutes(hours * 60 + minutes));
          setTimeOpen(false);
        }}
        hours={Math.floor(reminderTime / 60)}
        minutes={reminderTime % 60}
      />
    </SettingsGroup>
  );
}
