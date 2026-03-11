import { type Lang, DEFAULT_LANG } from "@/features/Language/config";

export function langPath(lang: Lang, path: string = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return lang === DEFAULT_LANG ? p : `/${lang}${p}`;
}