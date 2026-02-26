import type { Locale } from "./config";

export type Dictionary = typeof import("./dictionaries/en.json");

export async function getDictionary(locale: Locale) {
  switch (locale) {
    case "tr":
      return (await import("./dictionaries/tr.json")).default;
    case "en":
      return (await import("./dictionaries/en.json")).default;
    default:
      return (await import("./dictionaries/tr.json")).default;
  }
}