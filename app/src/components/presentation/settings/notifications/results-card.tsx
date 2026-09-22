import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { setNotifyWeeklySummary } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { PreferenceRow } from '../preferences/preference-row';
import { RowSeparator } from '../preferences/preference-row.styles';
import * as S from './results-card.styles';

/**
 * RESULTS card (settings-dark.md Screen 3): goal completions, personal
 * records, weekly summary. Only the weekly summary carries a caption in the
 * spec — "Every Sunday · 8:00 AM", which is also the real schedule the
 * notification service uses.
 *
 * Honesty note: Goal Completions and Personal Records have no notification
 * delivery path anywhere in the app (no fire point reads those preferences),
 * so their toggles are inert with an honest "Not available" caption instead
 * of pretending to control something. The weekly summary is the only wired
 * row here.
 */
export function ResultsCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);
  const unavailable = t(settingsKey('settings.notifications.unavailable.subtitle'), 'Not available');

  return (
    <SettingsGroup label={t(settingsKey('settings.notifications.results.header'), 'RESULTS')}>
      <S.Block>
        <PreferenceRow
          title={t(settingsKey('settings.notifications.goal_completions.label'), 'Goal Completions')}
          subtitle={unavailable}
          trailing={
            <SettingsToggle
              value={settings.notifyGoalCompletions}
              accessibilityLabel={t(settingsKey('settings.notifications.goal_completions.label'), 'Goal Completions')}
              disabled
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.personal_records.label'), 'Personal Records')}
          subtitle={unavailable}
          trailing={
            <SettingsToggle
              value={settings.notifyPersonalRecords}
              accessibilityLabel={t(settingsKey('settings.notifications.personal_records.label'), 'Personal Records')}
              disabled
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.weekly_summary.label'), 'Weekly Summary')}
          subtitle={t(settingsKey('settings.notifications.weekly_summary.subtitle'), 'Every Sunday · 8:00 AM')}
          trailing={
            <SettingsToggle
              value={settings.notifyWeeklySummary}
              onValueChange={(v) => dispatch(setNotifyWeeklySummary(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.weekly_summary.label'), 'Weekly Summary')}
            />
          }
        />
      </S.Block>
    </SettingsGroup>
  );
}
