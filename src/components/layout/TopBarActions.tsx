"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";

export default function TopBarActions() {
  const { locale } = useI18n();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const restPath = pathname.replace(/^\/(tr|en)/, "") || "/";

  return (
    <div className="flex items-center gap-2">
      {/* Dil seçici */}
      <div className="flex items-center overflow-hidden rounded-md border border-light-4 text-xs font-medium dark:border-dark-1">
        <Link
          href={localePath("tr", restPath)}
          className={`px-2.5 py-1 transition-colors ${
            locale === "tr"
              ? "bg-teal-3 text-light-1 dark:bg-teal-2"
              : "text-gray-3 hover:text-dark-3 dark:text-gray-2 dark:hover:text-light-1"
          }`}
        >
          Türkçe
        </Link>
        <span className="h-4 border-r border-light-4 dark:border-dark-1" />
        <Link
          href={localePath("en", restPath)}
          className={`px-2.5 py-1 transition-colors ${
            locale === "en"
              ? "bg-teal-3 text-light-1 dark:bg-teal-2"
              : "text-gray-3 hover:text-dark-3 dark:text-gray-2 dark:hover:text-light-1"
          }`}
        >
          English
        </Link>
      </div>

      {/* Tema toggle */}
      <button
        onClick={toggle}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-light-4 bg-light-1 text-gray-3 transition hover:bg-light-2 hover:text-dark-3 dark:border-dark-1 dark:bg-dark-3 dark:text-gray-2 dark:hover:bg-dark-2 dark:hover:text-light-1"
        aria-label="Tema değiştir"
      >
        {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
      </button>
    </div>
  );
}