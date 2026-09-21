import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { setBadgeAppIcon } from '@/store/settings';
import { formatQuietHours } from '@/services/notification-schedule';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { PreferenceRow } from '../preferences/preference-row';
import { RowSeparator } from '../preferences/preference-row.styles';
import * as S from './delivery-card.styles';

/**
 * DELIVERY card (settings-dark.md Screen 3): quiet hours (display-only —
 * there is no quiet-hours editor in the spec, so the row shows the real
 * stored window rather than a fake affordance) and the badge toggle.
 *
 * No Alert Sound row: the app ships no custom notification sound, and the
 * spec's "Chime" value would be a fake setting.
 */
export function DeliveryCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);

  const quietHours = formatQuietHours(
    settings.quietHoursStartMinutes,
    settings.quietHoursEndMinutes,
    settings.use24HourTime,
  );

  return (
    <SettingsGroup label={t(settingsKey('settings.notifications.delivery.header'), 'DELIVERY')}>
      <S.Block>
        <PreferenceRow
          title={t(settingsKey('settings.notifications.quiet_hours.label'), 'Quiet Hours')}
          trailing={<S.RowValue numberOfLines={1}>{quietHours}</S.RowValue>}
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.notifications.badge.label'), 'Badge App Icon')}
          subtitle={t(settingsKey('settings.notifications.badge.subtitle'), 'Show pending counts on the app icon')}
          trailing={
            <SettingsToggle
              value={settings.badgeAppIcon}
              onValueChange={(v) => dispatch(setBadgeAppIcon(v))}
              accessibilityLabel={t(settingsKey('settings.notifications.badge.label'), 'Badge App Icon')}
            />
          }
        />
      </S.Block>
    </SettingsGroup>
  );
}
