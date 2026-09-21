import Icon from '@/components/presentation/foundation/icon';
import { openUrl } from '@/utils/open-url';
import { useTranslate } from '@tolgee/react';
import { chevronColor } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import * as S from './about-card.styles';
import { CardShell } from './card-shell';
import { BackupSeparator } from './backup-card.styles';

/**
 * About card (settings-dark.md Screen 6): 58pt plain rows with chevrons.
 * Privacy Policy links to the hosted policy; Open-Source Licenses opens the
 * project's AGPL-3.0 license text. Terms of Service is intentionally absent:
 * no Terms URL could be verified (see parent handoff), and a dead row would
 * be a fake affordance.
 */
export function AboutCard() {
  const { t } = useTranslate();

  return (
    <CardShell radius={26}>
      <S.AboutRow accessibilityRole="button" onPress={() => openUrl('https://alcedo.app/privacy.html')}>
        <S.AboutRowTitle>{t(settingsKey('settings.backup.about.privacy'))}</S.AboutRowTitle>
        <Icon source="chevronRight" size={18} color={chevronColor} />
      </S.AboutRow>
      <BackupSeparator />
      <S.AboutRow
        accessibilityRole="button"
        onPress={() => openUrl('https://github.com/Luke23-45/alcedo/blob/main/LICENSE')}
      >
        <S.AboutRowTitle>{t(settingsKey('settings.backup.about.licenses'))}</S.AboutRowTitle>
        <Icon source="chevronRight" size={18} color={chevronColor} />
      </S.AboutRow>
    </CardShell>
  );
}
