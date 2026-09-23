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
import { CHIP_DAYS, dayLetter, dayName } from './notification-day-chips';
import * as S from './workout-card.styles';

/**
 * WORKOUT card (settings-dark.md Screen 3): workout reminders with inline
 * day chips + time pill, rest timer alerts, auto-pause on lock. Row order
 * follows the spec SVG (reminders, alerts, auto-pause); the legacy "Rest
 * Timers" row is kept last — it drives the real rest-timer countdown in
 * workouts, so removing it would lose function the old screen had.
 *
 * The reminder toggle keeps the existing permission behaviour: if the OS
 * denies notification permission — or nothing can be scheduled (reminder
 * time inside quiet hours, no day selected) — the settings effects revert
 * the toggle. Rest Timer Alerts preserves the old route's worker broadcast
 * so a running workout's rest notifications start/stop immediately.
 *
 * The time picker follows the app's own Language and 24-Hour Time
 * preferences, not the device locale or a hard-coded "default" locale.
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
  const language = settings.preferredLanguage ?? undefined;

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
            accessibilityLabel={t(settingsKey('settings.notifications.workout_reminders.label'), 'Workout Reminders')}
          >
            {CHIP_DAYS.map((day) => {
              const active = reminderDays.includes(day);
              const label = dayLetter(day, language);
              return (
                <S.DayCell
                  key={day.name()}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: active, disabled: !remindersOn }}
                  accessibilityLabel={dayName(day, language)}
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
            accessibilityLabel={t(
              settingsKey('settings.notifications.workout_reminders.time_label'),
              'Workout reminder time, {time}',
              { time: formatMinutesAsTime(reminderTime, settings.use24HourTime, language) },
            )}
            accessibilityState={{ disabled: !remindersOn }}
            disabled={!remindersOn}
            onPress={() => setTimeOpen(true)}
          >
            <S.TimePill>
              <S.TimeText style={{ fontVariant: ['tabular-nums'] }}>
                {formatMinutesAsTime(reminderTime, settings.use24HourTime, language)}
              </S.TimeText>
            </S.TimePill>
          </S.TimeCell>
        </S.ReminderArea>
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
        <RowSeparator />
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
      </S.Block>

      <TimePickerModal
        locale={language}
        use24HourClock={settings.use24HourTime}
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
