import type { Locale } from "@/features/i18n/config";

export const EXTERNAL_LINKS = {
  apply: "https://example.com", // TODO: gerçek başvuru linki
};

export function lpath(locale: Locale, path: string) {
  // path: "/about" veya "about" gibi gelirse normalize eder
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${p}`;
}