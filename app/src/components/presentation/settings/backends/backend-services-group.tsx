import { BackendPicker } from '@/components/smart/backend-picker';
import { useTranslate } from '@tolgee/react';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';

/**
 * Backend feature assignments (settings-dark.md Screen 6 family). The feed
 * picker confirms before the switch lands (the account is re-issued); the
 * backup picker assigns immediately. The AI coach is served by the built-in
 * backend-v2 natively and is not assignable.
 */
export function BackendServicesGroup({ onFeedChange }: { onFeedChange: (backendId: string | undefined) => void }) {
  const { t } = useTranslate();

  return (
    <SettingsGroup label={t(settingsKey('settings.backends.section.services'))}>
      <SettingsRow
        icon="forum"
        wellHue="#0A84FF"
        iconColor="#5EB0FF"
        title={t('backends.feed.label')}
        trailing={<BackendPicker feature="feed" onChange={onFeedChange} />}
      />
      <SettingsRow
        icon="cloudUpload"
        wellHue="#30D158"
        iconColor="#4ADE80"
        title={t('backends.backup.label')}
        trailing={<BackendPicker feature="backup" />}
      />
    </SettingsGroup>
  );
}
