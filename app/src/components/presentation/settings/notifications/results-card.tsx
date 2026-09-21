import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { setNotifyGoalCompletions, setNotifyPersonalRecords, setNotifyWeeklySummary } from '@/store/settings';
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
 */
export function ResultsCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);

  return (
    <SettingsGroup label={t(settingsKey('settings.notifications.results.header'), 'RESULTS')}>
      <S.Block>
        <PreferenceRow
          title={t(settingsKey('settings.notifications.goal_completions.label'), 'Goal Completions')}
          trailing={
            <SettingsToggle
              value={settings.notifyGoalCompletions}
              onValueChange={(v) => dispatch(setNotifyGoalCompletions(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.goal_completions.label'), 'Goal Completions')}
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.personal_records.label'), 'Personal Records')}
          trailing={
            <SettingsToggle
              value={settings.notifyPersonalRecords}
              onValueChange={(v) => dispatch(setNotifyPersonalRecords(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.personal_records.label'), 'Personal Records')}
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
