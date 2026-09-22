// tolgee.d.ts

import type en from '../i18n/en.json';

declare module '@tolgee/web' {
  type TranslationsType = typeof en;

  // ensures that nested keys are accessible with "."
  type DotNotationEntries<T> = T extends object
    ? {
        [K in keyof T]: `${K & string}${T[K] extends undefined
          ? ''
          : T[K] extends object
            ? `.${DotNotationEntries<T[K]>}`
            : ''}`;
      }[keyof T]
    : '';

  export type TranslationKey = DotNotationEntries<TranslationsType>;

  // @tolgee/web@7 ships no .d.ts (types/index.d.ts is missing from the package),
  // so declare the runtime values we import. Verified against node_modules/@tolgee/web:
  // Tolgee, FormatSimple, LanguageDetector and detectLanguage are real exports.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Tolgee: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const FormatSimple: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const LanguageDetector: any;
  export function detectLanguage(locale: string, availableLanguages: string[]): string | undefined;
}
