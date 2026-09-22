/**
 * The curated language list for Settings → Language & Region (Phase 6,
 * Screen 2). Native names and regions are spec-exact
 * (docs/new_design/settings-dark.md Screen 2); region follows the language —
 * there is no independent region setting.
 *
 * Japanese ships disabled: the app has no `ja` translation bundle, so
 * selecting it would leave every string untranslated. It is shown (not
 * hidden) with a "soon" marker rather than pretending to work.
 *
 * Note: the app ships more translation bundles than these six (see
 * services/tolgee). The six stay the picker's curated, spec-exact list;
 * `activeLanguageFor` keeps the Language row honest for the rest.
 */

import { supportedLanguages } from '@/services/tolgee';

export interface PickerLanguage {
  code: string;
  nativeName: string;
  regionCode: string;
  regionName: string;
  /** Region text shown in the picker's right column (spec-exact). */
  listRegion: string;
  enabled: boolean;
}

export const PICKER_LANGUAGES: PickerLanguage[] = [
  { code: 'en', nativeName: 'English', regionCode: 'US', regionName: 'United States', listRegion: 'US', enabled: true },
  { code: 'es', nativeName: 'Español', regionCode: 'ES', regionName: 'España', listRegion: 'España', enabled: true },
  { code: 'fr', nativeName: 'Français', regionCode: 'FR', regionName: 'France', listRegion: 'France', enabled: true },
  {
    code: 'de',
    nativeName: 'Deutsch',
    regionCode: 'DE',
    regionName: 'Deutschland',
    listRegion: 'Deutschland',
    enabled: true,
  },
  {
    code: 'pt',
    nativeName: 'Português (Brasil)',
    regionCode: 'BR',
    regionName: 'Brasil',
    listRegion: 'Brasil',
    enabled: true,
  },
  { code: 'ja', nativeName: '日本語', regionCode: 'JP', regionName: '日本', listRegion: '日本', enabled: false },
];

/** The checkmark rule: an exact code match on an enabled row. A supported
 * but non-curated language (e.g. device-detected Russian) checks nothing
 * rather than claiming English is selected. */
export function pickerRowSelected(row: PickerLanguage, effectiveCode: string | undefined): boolean {
  return row.enabled && row.code === effectiveCode;
}

/** The Language row value: "English (US)" for curated languages, the real
 * native label (no invented region) for the rest. */
export function languageRowValue(active: ActiveLanguage): string {
  return active.curated ? `${active.nativeName} (${active.regionCode})` : active.nativeName;
}

export interface ActiveLanguage {
  /** Native name of the actually-active language — never a stand-in. */
  nativeName: string;
  /** Curated region info; only defined for the six picker languages. */
  regionCode?: string;
  regionName?: string;
  /** True when the language has a row in the six-language picker. */
  curated: boolean;
}

/**
 * Resolves the actually-active language code (stored preference, else
 * device detection) to display data. A code outside the curated six
 * (e.g. 'ru') resolves to its real native label rather than silently
 * claiming English; a code the app doesn't support at all falls back
 * to English.
 */
export function activeLanguageFor(code: string | undefined): ActiveLanguage {
  const curated = PICKER_LANGUAGES.find((l) => l.code === code);
  if (curated) {
    return {
      nativeName: curated.nativeName,
      regionCode: curated.regionCode,
      regionName: curated.regionName,
      curated: true,
    };
  }
  const supported = supportedLanguages.find((x) => x.code === code);
  if (supported) {
    return { nativeName: supported.label, curated: false };
  }
  const fallback = PICKER_LANGUAGES[0]!;
  return {
    nativeName: fallback.nativeName,
    regionCode: fallback.regionCode,
    regionName: fallback.regionName,
    curated: true,
  };
}
