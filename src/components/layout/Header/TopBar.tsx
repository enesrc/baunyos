"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EnvelopeSimpleIcon, SunIcon, MoonIcon, GlobeIcon } from "@phosphor-icons/react/ssr";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useLanguage } from "@/features/Language/LanguageContext";
import { langPath } from "@/features/Language/lang-path";

export default function TopBar() {
  const { lang, translate } = useLanguage();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const restPath = pathname.replace(/^\/(tr|en)/, "") || "/";

  const otherLang = translate("tr", "en") as typeof lang; // Aktif dil "/en" ise buton "/tr" olmalı
  const otherLabel = translate("English", "Türkçe");

  return (
    <div className="relative z-40 w-full border-b border-cyan bg-cyan-deep dark:border-dark-1 dark:bg-dark-1">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div>
          <Link
            href={langPath(lang, "/contact")}
            className="flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors
            bg-white text-black hover:bg-teal-4
            dark:bg-teal-4 dark:hover:bg-teal-3"
          >
            <EnvelopeSimpleIcon size={15} className="shrink-0 hidden md:block" />
            <span className="leading-none">{translate("Contact", "İletişim")}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={langPath(otherLang, restPath)}
            className="flex h-8 items-center justify-center gap-1.5 rounded-full font-medium transition-colors  text-sm   px-2
            bg-white text-black hover:bg-light-4"
          >
            <GlobeIcon size={15} className="shrink-0 block" />
            <span className="hidden sm:inline leading-none">
              {otherLabel}
            </span>
          </Link>

          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors 
                       bg-indigo hover:bg-indigo-dull text-white
                       dark:bg-yellow dark:hover:bg-yellow-bright dark:text-dark-4"
            aria-label="Tema değiştir"
          >
            {theme === "dark" ? <SunIcon size={17} className="shrink-0 block" /> : <MoonIcon size={17} className="shrink-0 block" />}
          </button>
        </div>
      </div>
    </div>
  );
}