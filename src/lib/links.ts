import { DEFAULT_LOCALE, type Locale } from "@/features/i18n/config";

export const EXTERNAL_LINKS = {
  apply: "https://example.com", // TODO: gerçek başvuru linki
};


export function localePath(locale: Locale, path: string = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return p;
  return `/${locale}${p}`;
}