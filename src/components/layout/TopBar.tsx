"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";

interface TopBarProps {
  phone?: string | null;
  email?: string | null;
}

export default function TopBar({ phone, email }: TopBarProps) {
  const { locale } = useI18n();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const restPath = pathname.replace(/^\/(tr|en)/, "") || "/";

  const otherLocale = locale === "tr" ? "en" : "tr";
  const otherLabel = locale === "tr" ? "English" : "Türkçe";

  return (
    <div className="border-b border-light-4 bg-light-2 dark:border-dark-1 dark:bg-dark-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-3 sm:gap-5">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm text-gray-3 transition-colors hover:text-teal-3 dark:text-gray-2 dark:hover:text-teal-2"
            >
              <Phone size={15} className="shrink-0" />
              <span>{phone}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-sm text-gray-3 transition-colors hover:text-teal-3 dark:text-gray-2 dark:hover:text-teal-2"
            >
              <Mail size={15} className="shrink-0" />
              <span className="hidden sm:inline">{email}</span>
              <span className="sm:hidden">E-posta</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Dil butonu */}
          <Link
            href={localePath(otherLocale, restPath)}
            className="flex h-7 items-center justify-center gap-1.5 rounded-md bg-teal-2 px-2 text-sm text-white transition-colors hover:bg-teal-4 dark:bg-teal-2 dark:hover:bg-teal-3"
          >
            <Globe size={15} className="shrink-0 block" />
            <span className="hidden sm:inline leading-none">
              {otherLabel}
            </span>
          </Link>

          {/* Tema butonu */}
          <button
            onClick={toggle}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors
            bg-teal-3 text-white hover:bg-teal-4 dark:bg-amber-2 dark:hover:bg-amber-4"
            aria-label="Tema değiştir"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}