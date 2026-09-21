import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { setNotifyChallengeUpdates, setNotifyKudosComments, setNotifyNewFollowers } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { PreferenceRow } from '../preferences/preference-row';
import { RowSeparator } from '../preferences/preference-row.styles';
import * as S from './social-card.styles';

/**
 * SOCIAL card (settings-dark.md Screen 3). Row order follows the spec SVG
 * (Kudos, Challenge Updates, New Followers); the defaults follow the task
 * text — Kudos and New Followers on, Challenge Updates off.
 */
export function SocialCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);

  return (
    <SettingsGroup label={t(settingsKey('settings.notifications.social.header'), 'SOCIAL')}>
      <S.Block>
        <PreferenceRow
          title={t(settingsKey('settings.notifications.kudos.label'), 'Kudos & Comments')}
          trailing={
            <SettingsToggle
              value={settings.notifyKudosComments}
              onValueChange={(v) => dispatch(setNotifyKudosComments(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.kudos.label'), 'Kudos & Comments')}
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.challenge_updates.label'), 'Challenge Updates')}
          trailing={
            <SettingsToggle
              value={settings.notifyChallengeUpdates}
              onValueChange={(v) => dispatch(setNotifyChallengeUpdates(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.challenge_updates.label'), 'Challenge Updates')}
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.new_followers.label'), 'New Followers')}
          trailing={
            <SettingsToggle
              value={settings.notifyNewFollowers}
              onValueChange={(v) => dispatch(setNotifyNewFollowers(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.new_followers.label'), 'New Followers')}
            />
          }
        />
      </S.Block>
    </SettingsGroup>
  );
}
