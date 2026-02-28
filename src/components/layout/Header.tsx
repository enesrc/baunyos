import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { getNavItems } from "@/features/navbar/queries";
import { getSiteSettings } from "@/features/site-settings/queries";
import { localePath } from "@/lib/links";
import TopBarActions from "./TopBarActions";
import NavMenu from "./NavMenu";
import type { Locale } from "@/features/i18n/config";

export default async function Header({ locale }: { locale: Locale }) {
  const [navItems, settings] = await Promise.all([
    getNavItems(),
    getSiteSettings(),
  ]);

  const logoText = locale === "tr" ? settings.logo_text_tr : settings.logo_text_en;

  return (
    <header className="sticky top-0 z-50">
      {/* TopBar */}
      <div className="border-b border-light-4 bg-light-2 dark:border-dark-1 dark:bg-dark-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-5">
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-xs text-gray-3 transition-colors hover:text-teal-3 dark:text-gray-2 dark:hover:text-teal-2"
              >
                <Phone size={11} />
                {settings.phone}
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-1.5 text-xs text-gray-3 transition-colors hover:text-teal-3 dark:text-gray-2 dark:hover:text-teal-2"
              >
                <Mail size={11} />
                {settings.email}
              </a>
            )}
          </div>

          <TopBarActions />
        </div>
      </div>

      {/* Ana bar */}
      <div className="relative border-b border-light-4 bg-light-1 backdrop-blur-xl dark:border-dark-1 dark:bg-dark-3">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <Link
            href={localePath(locale, "/")}
            className="shrink-0 text-base font-bold tracking-tight text-teal-3 dark:text-teal-2"
          >
            {logoText}
          </Link>

          <div className="relative flex flex-1 items-center justify-end md:justify-start">
            <NavMenu items={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}