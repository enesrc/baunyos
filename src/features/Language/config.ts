export const LANGS = ["tr", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export function parseLang(raw: string): Lang {
  return LANGS.includes(raw as Lang) ? (raw as Lang) : DEFAULT_LANG;
}