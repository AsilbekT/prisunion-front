export enum ELocales {
  uz = "O'zbekcha",
  en = 'English',
  ru = 'Русский',
}

export type LocaleTypes = keyof typeof ELocales;

export const localeKeys = Object.keys(ELocales) as LocaleTypes[];

export const DEFAULT_LOCALE = localeKeys[0];
