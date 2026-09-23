import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { copyLogs } from '@/store/app';
import { useAppTheme } from '@/hooks/useAppTheme';
import { selectHasUnseenWhatsNew } from '@/store/settings';
import { openUrl } from '@/utils/open-url';
import { useTranslate } from '@tolgee/react';
import * as Application from 'expo-application';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import { useState } from 'react';
import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';

const appVersion = Application.nativeApplicationVersion ?? Application.nativeBuildVersion ?? 'Unknown';

function bugReportUrl(): string {
  return (
    'https://github.com/Luke23-45/alcedo/issues/new?assignees=&labels=bug&projects=&template=bug_report.yaml' +
    `&app-version=${encodeURIComponent(appVersion)}&platform=${Platform.OS}&os-version=${Platform.Version}`
  );
}

// App-info dialog: styled on plain RN primitives (Paper's Dialog carries its
// own theme type that clashes with the app theme under styled()).
const DialogTitleText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'headline')}
  color: ${({ theme }) => theme.color.content.primary};
  padding: 24px 24px 12px;
`;

const DialogBodyText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote')}
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.content.secondary};
  padding: 0 24px 8px;
`;

const DialogCloseButton = styled.Pressable`
  min-height: 44px;
  min-width: 44px;
  justify-content: center;
  padding-horizontal: 12px;
`;

const DialogCloseText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'callout', { weight: '600' })}
  color: ${({ theme }) => theme.color.interactive.tint};
`;

/**
 * SUPPORT & ABOUT group (settings-dark.md Screen 1). What's New carries the
 * NEW pill while any release entry is unread; Send Feedback opens the real
 * bug-report template; Copy Logs copies real diagnostics; App Info opens the
 * redesigned dialog; Open-Source Licenses opens the project's AGPL-3.0
 * license text.
 *
 * Rate ALCEDO is required by the spec but the app has no App Store listing,
 * so no review can be left anywhere real. The row is present with an honest
 * "Not available" value and no navigation affordance — never a dead link.
 */
export function SupportGroup() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const [appInfoOpen, setAppInfoOpen] = useState(false);
  const hasUnseen = useAppSelector(selectHasUnseenWhatsNew);

  return (
    <>
      <SettingsGroup label={t(settingsKey('settings.home.section.support'))}>
        <SettingsRow
          icon="campaign"
          wellHue="#FFD60A"
          iconColor="#FFD84D"
          title={t(settingsKey('settings.home.whatsnew.title'))}
          subtitle={t(settingsKey('settings.home.whatsnew.subtitle'))}
          badge={hasUnseen ? t(settingsKey('settings.home.whatsnew.badge')) : undefined}
          onPress={() => push('/settings/whats-new')}
        />
        <SettingsRow
          icon="forum"
          wellHue="#0A84FF"
          iconColor="#5EB0FF"
          title={t(settingsKey('settings.home.feedback.title'))}
          subtitle={t(settingsKey('settings.home.feedback.subtitle'))}
          onPress={() => openUrl(bugReportUrl())}
        />
        <SettingsRow
          icon="star"
          wellHue="#FFD60A"
          iconColor="#FFD84D"
          title={t(settingsKey('settings.home.rate.title'))}
          subtitle={t(settingsKey('settings.home.rate.subtitle'))}
          value={t(settingsKey('settings.home.rate.unavailable'))}
          hideChevron
        />
        <SettingsRow
          icon="code"
          wellHue="#FFFFFF"
          wellHueLight="#98989F"
          wellAlpha={{ dark: 0.07, light: 0.12 }}
          iconColor="#98989F"
          title={t(settingsKey('settings.home.licenses.title'))}
          subtitle={t(settingsKey('settings.home.licenses.subtitle'))}
          onPress={() => openUrl('https://github.com/Luke23-45/alcedo/blob/main/LICENSE')}
        />
        <SettingsRow
          icon="terminal"
          wellHue="#8E8E93"
          iconColor="#AEAEB2"
          title={t(settingsKey('settings.home.copy_logs.title'))}
          subtitle={t(settingsKey('settings.home.copy_logs.subtitle'))}
          onPress={() => dispatch(copyLogs())}
        />
        <SettingsRow
          icon="info"
          wellHue="#5856D6"
          iconColor="#8E7BFF"
          title={t(settingsKey('settings.home.app_info.title'))}
          subtitle={t(settingsKey('settings.home.app_info.subtitle'), { version: appVersion })}
          onPress={() => setAppInfoOpen(true)}
        />
      </SettingsGroup>
      <Portal>
        <Dialog
          visible={appInfoOpen}
          onDismiss={() => setAppInfoOpen(false)}
          style={{ backgroundColor: theme.color.background.elevated, borderRadius: 20 }}
        >
          <DialogTitleText>{t(settingsKey('settings.home.app_info.dialog_title'))}</DialogTitleText>
          <DialogBodyText>{t(settingsKey('settings.home.app_info.dialog_body'))}</DialogBodyText>
          <DialogBodyText>
            {t(settingsKey('settings.home.app_info.dialog_version'), { version: appVersion })}
          </DialogBodyText>
          <Dialog.Actions style={{ justifyContent: 'flex-end' }}>
            <DialogCloseButton accessibilityRole="button" onPress={() => setAppInfoOpen(false)}>
              <DialogCloseText>{t('generic.close.button')}</DialogCloseText>
            </DialogCloseButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
