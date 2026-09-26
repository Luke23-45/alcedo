import { DetectLanguage, detectLanguageOrPreferred } from '@/utils/language-detector';

// Only English is parsed at startup (~113KB). The other 18 locales (~490KB
// combined) are dynamically imported on demand — parsing all 604KB
// synchronously at import time blocked the JS thread for 50-150ms before
// first paint on every launch.
import en from '../i18n/en.json';

import { FormatSimple, TolgeeCore as Tolgee, type TolgeeInstance, type TreeTranslationsData } from '@tolgee/core';
import { PreferenceService } from '@/services/preference-service';

export const supportedLanguages = [
  { code: 'ar', label: 'العربية', isRTL: true },
  { code: 'sv', label: 'Svenska' },
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fi', label: 'Suomi' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'hu', label: 'Magyar' },
  { code: 'ru', label: 'Русский' },
  { code: 'sr', label: 'Srpski' },
  { code: 'uk', label: 'Українська' },
  { code: 'pt', label: 'Português' },
  { code: 'pl', label: 'Polski' },
  { code: 'cs', label: 'Čeština' },
  { code: 'ko', label: '한국어' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'zh-hans', label: '中文（简体）' },
];

/** Dynamic importers for non-default locales; each resolves to the JSON module. */
const localeLoaders: Record<string, () => Promise<{ default: TreeTranslationsData }>> = {
  ar: () => import('../i18n/ar.json'),
  cs: () => import('../i18n/cs.json'),
  de: () => import('../i18n/de.json'),
  es: () => import('../i18n/es.json'),
  fi: () => import('../i18n/fi.json'),
  fr: () => import('../i18n/fr.json'),
  hu: () => import('../i18n/hu.json'),
  it: () => import('../i18n/it.json'),
  ko: () => import('../i18n/ko.json'),
  nl: () => import('../i18n/nl.json'),
  pl: () => import('../i18n/pl.json'),
  pt: () => import('../i18n/pt.json'),
  ru: () => import('../i18n/ru.json'),
  sr: () => import('../i18n/sr.json'),
  sv: () => import('../i18n/sv.json'),
  tr: () => import('../i18n/tr.json'),
  uk: () => import('../i18n/uk.json'),
  'zh-hans': () => import('../i18n/zh-hans.json'),
};

const loadedLocales = new Set<string>(['en']);

/**
 * Ensures a locale's translations are registered with Tolgee, dynamically
 * importing the JSON on first use. Idempotent and safe to call concurrently.
 */
export async function ensureLocaleLoaded(tolgee: TolgeeInstance, code: string): Promise<void> {
  if (loadedLocales.has(code)) {
    return;
  }
  const loader = localeLoaders[code];
  if (!loader) {
    return;
  }
  const mod = await loader();
  tolgee.addStaticData({ [code]: mod.default });
  loadedLocales.add(code);
}

export const getTolgee = (preferenceService: PreferenceService) => {
  const language = detectLanguageOrPreferred(
    preferenceService,
    supportedLanguages.map((x) => x.code),
  );
  const tolgee = Tolgee()
    .use(FormatSimple())
    .use(DetectLanguage(preferenceService))
    .init({
      defaultLanguage: 'en',
      fallbackLanguage: 'en',
      language,

      staticData: { en },
    });
  // The active locale loads in the background; until it arrives Tolgee falls
  // back to English. The module is bundled locally so this typically resolves
  // before first paint — and it never blocks the JS thread like the old
  // 604KB synchronous parse did.
  if (language !== undefined && language !== 'en') {
    void ensureLocaleLoaded(tolgee, language).catch(() => {
      // Falling back to English is already in place; a failed locale load is not fatal.
    });
  }
  return tolgee;
};
