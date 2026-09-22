import { PreferenceService } from '@/services/preference-service';
import type { LanguageDetectorMiddleware, TolgeePlugin } from '@tolgee/core';

// Local copy of @tolgee/web's detectLanguage (v7.1.0, verified identical logic).
// It cannot be imported: the @tolgee/web bundle touches `document.documentElement`
// at module scope, which crashes on Hermes. @tolgee/core is DOM-free.
function detectLanguage(language: string, availableLanguages: string[]): string | undefined {
  const exactMatch = availableLanguages.find((l) => l === language);
  if (exactMatch) {
    return exactMatch;
  }
  const getTwoLetters = (fullTag: string) => fullTag.replace(/^(.+?)(-.*)?$/, '$1');
  const preferredTwoLetter = getTwoLetters(language);
  const twoLetterMatch = availableLanguages.find((l) => getTwoLetters(l) === preferredTwoLetter);
  if (twoLetterMatch) {
    return twoLetterMatch;
  }
  return undefined;
}

// Tolgee's types claim `detectLanguage` returns a string, but it returns undefined for a locale with
// no exact or two-letter match.
export function detectLanguageFromDateLocale(availableLanguages: string[]): string | undefined {
  return detectLanguage(Intl.DateTimeFormat().resolvedOptions().locale, availableLanguages) as string | undefined;
}

export const detectLanguageOrPreferred = (preferenceService: PreferenceService, availableLanguages: string[]) => {
  const preference = preferenceService.getPreferredLanguage();
  if (preference) {
    return preference;
  }
  const lang = detectLanguageFromDateLocale(availableLanguages);
  return lang;
};

const createLanguageDetector = (preferenceService: PreferenceService): LanguageDetectorMiddleware => ({
  getLanguage: (props) => {
    return detectLanguageOrPreferred(preferenceService, props.availableLanguages);
  },
});

export const DetectLanguage =
  (preferenceService: PreferenceService): TolgeePlugin =>
  (tolgee, tools) => {
    tools.setLanguageDetector(createLanguageDetector(preferenceService));
    return tolgee;
  };
