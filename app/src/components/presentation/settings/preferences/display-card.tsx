import Icon from '@/components/presentation/foundation/icon';
import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import {
  setKeepScreenAwakeDuringWorkout,
  setNotesExpandedByDefault,
  setShowBodyweight,
  setShowFeed,
  setShowPostWorkoutSummary,
  setWelcomeWizardCompleted,
} from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { PreferenceRow } from './preference-row';
import { RowSeparator } from './preference-row.styles';
import * as S from './display-card.styles';

/**
 * DISPLAY card: the old app-configuration screen's real toggles
 * (bodyweight, feed, post-workout summary, notes, keep-awake) plus the
 * restart-setup-wizard link. Copy comes from the existing en.json keys —
 * nothing here is new copy.
 */
export function DisplayCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);

  const rows: {
    label: string;
    subtitle: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }[] = [
    {
      label: t('settings.show_bodyweight.label'),
      subtitle: t('settings.show_bodyweight.subtitle'),
      value: settings.showBodyweight,
      onChange: (v) => dispatch(setShowBodyweight(v)),
    },
    {
      label: t('feed.show_feed.label'),
      subtitle: t('feed.show_feed.subtitle'),
      value: settings.showFeed,
      onChange: (v) => dispatch(setShowFeed(v)),
    },
    {
      label: t('workout.show_post_workout_summary.label'),
      subtitle: t('workout.show_post_workout_summary.subtitle'),
      value: settings.showPostWorkoutSummary,
      onChange: (v) => dispatch(setShowPostWorkoutSummary(v)),
    },
    {
      label: t('workout.notes_expanded_by_default.label'),
      subtitle: t('workout.notes_expanded_by_default.subtitle'),
      value: settings.notesExpandedByDefault,
      onChange: (v) => dispatch(setNotesExpandedByDefault(v)),
    },
    {
      label: t('workout.keep_screen_awake.label'),
      subtitle: t('workout.keep_screen_awake.subtitle'),
      value: settings.keepScreenAwakeDuringWorkout,
      onChange: (v) => dispatch(setKeepScreenAwakeDuringWorkout(v)),
    },
  ];

  return (
    <SettingsGroup label={t(settingsKey('settings.preferences.display.header'), 'DISPLAY')}>
      <S.Block>
        {rows.map((row, i) => (
          <Fragment key={row.label}>
            {i > 0 ? <RowSeparator /> : undefined}
            <PreferenceRow
              title={row.label}
              subtitle={row.subtitle}
              trailing={
                <SettingsToggle value={row.value} onValueChange={row.onChange} accessibilityLabel={row.label} />
              }
            />
          </Fragment>
        ))}
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.preferences.restart_wizard.label'), 'Restart setup wizard')}
          trailing={<Icon source="chevronRight" size={18} color="#48484A" />}
          onPress={() => dispatch(setWelcomeWizardCompleted(false))}
          accessibilityLabel={t(settingsKey('settings.preferences.restart_wizard.label'), 'Restart setup wizard')}
        />
      </S.Block>
    </SettingsGroup>
  );
}
