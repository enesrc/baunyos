"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/features/theme/ThemeProvider";
import { DEFAULT_LOCALE, type Locale } from "@/features/i18n/config";
import { useI18n } from "@/features/i18n/I18nContextValue";

/**
 * Locale'e göre prefix oluşturur.
 * Varsayılan dil (en) → prefix yok: "/about"
 * Diğer diller (tr) → prefix var: "/tr/about"
 */
function localePath(locale: Locale, path: string = "") {
  if (locale === DEFAULT_LOCALE) return path || "/";
  return `/${locale}${path}`;
}

export default function Header() {
  const { dict, locale } = useI18n();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  const otherLocale: Locale = locale === "tr" ? "en" : "tr";

  // Mevcut path'ten locale prefix'ini çıkar
  const restPath = pathname.replace(/^\/(tr|en)/, "") || "";

  // Diğer dile geçiş linki
  const switchHref = localePath(otherLocale, restPath);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-glass/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href={localePath(locale)} className="font-semibold tracking-tight">
          BAUN YÖS
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Link className="text-sm opacity-80 hover:opacity-100" href={localePath(locale, "/students")}>
            {dict.nav.students}
          </Link>
          <Link className="text-sm opacity-80 hover:opacity-100" href={localePath(locale, "/about")}>
            {dict.nav.about}
          </Link>
          <Link className="text-sm opacity-80 hover:opacity-100" href={localePath(locale, "/departments")}>
            {dict.nav.departments}
          </Link>
          <Link className="text-sm opacity-80 hover:opacity-100" href={localePath(locale, "/candidates")}>
            {dict.nav.candidates}
          </Link>
          <Link className="text-sm opacity-80 hover:opacity-100" href={localePath(locale, "/tuition-fees")}>
            {dict.nav.tuitionFees}
          </Link>
          <Link className="text-sm opacity-80 hover:opacity-100" href={localePath(locale, "/faq")}>
            {dict.nav.faq}
          </Link>
          <Link className="text-sm opacity-80 hover:opacity-100" href={localePath(locale, "/announcements")}>
            {dict.nav.announcements}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            className="rounded-md border border-border bg-surface1 px-2 py-1 text-xs opacity-90 hover:opacity-100"
            href={switchHref}
            title="Switch language"
          >
            {otherLocale.toUpperCase()}
          </Link>

          <button
            onClick={toggle}
            className="rounded-lg border border-border bg-surface1 px-3 py-1 text-sm shadow-soft"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
}