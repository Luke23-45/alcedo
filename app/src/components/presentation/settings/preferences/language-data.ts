/**
 * The curated language list for Settings → Language & Region (Phase 6,
 * Screen 2). Native names and regions are spec-exact
 * (docs/new_design/settings-dark.md Screen 2); region follows the language —
 * there is no independent region setting.
 *
 * Japanese ships disabled: the app has no `ja` translation bundle, so
 * selecting it would leave every string untranslated. It is shown (not
 * hidden) with a "soon" marker rather than pretending to work.
 */

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

/** Resolves any stored/detected code to a picker entry; unknown → English. */
export function languageFor(code: string | undefined): PickerLanguage {
  return PICKER_LANGUAGES.find((l) => l.code === code) ?? PICKER_LANGUAGES[0]!;
}
