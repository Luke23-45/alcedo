import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { Fragment } from 'react';
import { PreferenceRow } from '../preferences/preference-row';
import { RowSeparator } from '../preferences/preference-row.styles';
import * as S from './social-card.styles';

/**
 * SOCIAL card (settings-dark.md Screen 3). Row order follows the spec SVG
 * (Kudos, Challenge Updates, New Followers); the defaults follow the
 * contract — Challenge Updates on, New Followers off (the deliberate-off
 * row for state variety).
 *
 * Honesty note: none of these three preferences has a notification delivery
 * path — the feed is E2E-encrypted and online-only, and no code schedules or
 * presents kudos/comment/challenge/follower notifications. The toggles are
 * inert with an honest "Not available" caption instead of pretending to
 * control something that doesn't exist.
 */
export function SocialCard() {
  const { t } = useTranslate();
  const settings = useAppSelector((s) => s.settings);
  const unavailable = t(settingsKey('settings.notifications.unavailable.subtitle'), 'Not available');

  const rows = [
    { key: 'kudos', value: settings.notifyKudosComments },
    { key: 'challenge_updates', value: settings.notifyChallengeUpdates },
    { key: 'new_followers', value: settings.notifyNewFollowers },
  ] as const;

  const labels: Record<(typeof rows)[number]['key'], string> = {
    kudos: t(settingsKey('settings.notifications.kudos.label'), 'Kudos & Comments'),
    challenge_updates: t(settingsKey('settings.notifications.challenge_updates.label'), 'Challenge Updates'),
    new_followers: t(settingsKey('settings.notifications.new_followers.label'), 'New Followers'),
  };

  return (
    <SettingsGroup label={t(settingsKey('settings.notifications.social.header'), 'SOCIAL')}>
      <S.Block>
        {rows.map((row, i) => (
          <Fragment key={row.key}>
            {i > 0 ? <RowSeparator /> : undefined}
            <PreferenceRow
              title={labels[row.key]}
              subtitle={unavailable}
              trailing={<SettingsToggle value={row.value} accessibilityLabel={labels[row.key]} disabled />}
            />
          </Fragment>
        ))}
      </S.Block>
    </SettingsGroup>
  );
}
