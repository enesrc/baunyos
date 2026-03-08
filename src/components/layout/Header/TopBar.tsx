"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon, EnvelopeIcon, SunIcon, MoonIcon, GlobeIcon } from "@phosphor-icons/react/ssr";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import { Contact } from "@/generated/prisma/client";

export default function TopBar({ contact }: { contact: Contact }) {
  const { locale } = useI18n();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const restPath = pathname.replace(/^\/(tr|en)/, "") || "/";

  const otherLocale = locale === "tr" ? "en" : "tr";
  const otherLabel = locale === "tr" ? "English" : "Türkçe";

  return (
    <div className="relative z-40 w-full border-b border-light-4 bg-light-3 dark:border-dark-1 dark:bg-dark-1">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-3 sm:gap-5">
          {contact.phone && (
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm text-gray-3 transition-colors hover:text-teal-3 dark:text-gray-2 dark:hover:text-teal-2"
            >
              <PhoneIcon size={15} className="shrink-0" />
              <span>{contact.phone}</span>
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 text-sm text-gray-3 transition-colors hover:text-teal-3 dark:text-gray-2 dark:hover:text-teal-2"
            >
              <EnvelopeIcon size={15} className="shrink-0" />
              <span className="hidden sm:inline">{contact.email}</span>
              <span className="sm:hidden">E-posta</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={localePath(otherLocale, restPath)}
            className="flex h-7 items-center justify-center gap-1.5 rounded-full font-medium transition-colors  text-sm   px-2
            bg-cyan text-white hover:bg-cyan-dull 
            dark:bg-cyan-dull dark:hover:bg-cyan"
          >
            <GlobeIcon size={15} className="shrink-0 block" />
            <span className="hidden sm:inline leading-none">
              {otherLabel}
            </span>
          </Link>

          <button
            onClick={toggle}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors 
                       bg-indigo hover:bg-indigo-dull text-white
                       dark:bg-yellow dark:hover:bg-yellow-bright dark:text-dark-4"
            aria-label="Tema değiştir"
          >
            {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}