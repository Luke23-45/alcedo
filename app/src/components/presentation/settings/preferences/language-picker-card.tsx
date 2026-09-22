import Icon from '@/components/presentation/foundation/icon';
import { SettingsGroup } from '../shared/grouped-settings-list';
import { BadgePill, BadgePillText } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { setPreferredLanguage } from '@/store/settings';
import { detectLanguageFromDateLocale } from '@/utils/language-detector';
import { supportedLanguages } from '@/services/tolgee';
import { forwardRef } from 'react';
import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { PICKER_LANGUAGES, pickerRowSelected } from './language-data';
import { RowSeparator } from './preference-row.styles';
import * as S from './language-picker-card.styles';

/**
 * CHOOSE LANGUAGE card (settings-dark.md Screen 2): the six curated
 * languages with native names, regions, and a single Ember checkmark.
 * Japanese is listed but disabled — the app ships no `ja` bundle, so it
 * cannot be selected honestly.
 */
export const LanguagePickerCard = forwardRef<View>(function LanguagePickerCard(_, ref) {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const preferredLanguage = useAppSelector((s) => s.settings.preferredLanguage);
  const effectiveCode =
    preferredLanguage ?? detectLanguageFromDateLocale(supportedLanguages.map((x) => x.code)) ?? 'en';

  return (
    <View ref={ref} collapsable={false}>
      <SettingsGroup label={t(settingsKey('settings.preferences.choose_language.header'), 'CHOOSE LANGUAGE')}>
        <S.Block>
          {PICKER_LANGUAGES.map((language, i) => {
            // The checkmark follows the actual code — a supported but
            // non-curated language (e.g. device-detected Russian) checks
            // nothing rather than claiming English is selected.
            const selected = pickerRowSelected(language, effectiveCode);
            return (
              <View key={language.code}>
                <S.LanguageRow
                  $disabled={!language.enabled}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: !language.enabled }}
                  accessibilityLabel={`${language.nativeName}, ${language.regionName}`}
                  disabled={!language.enabled}
                  onPress={() => dispatch(setPreferredLanguage(language.code))}
                >
                  <S.LanguageName numberOfLines={1}>{language.nativeName}</S.LanguageName>
                  {!language.enabled ? (
                    <BadgePill
                      accessibilityLabel={t(
                        settingsKey('settings.preferences.language.coming_soon'),
                        'More languages coming soon',
                      )}
                    >
                      <BadgePillText>{t(settingsKey('settings.preferences.language.soon'), 'Soon')}</BadgePillText>
                    </BadgePill>
                  ) : undefined}
                  <S.RegionText>{language.listRegion}</S.RegionText>
                  {selected ? <Icon source="check" size={20} color="#FF9F0A" /> : undefined}
                </S.LanguageRow>
                {i < PICKER_LANGUAGES.length - 1 ? <RowSeparator /> : undefined}
              </View>
            );
          })}
        </S.Block>
      </SettingsGroup>
    </View>
  );
});
