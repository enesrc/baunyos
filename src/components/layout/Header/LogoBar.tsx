import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/links";
import LogoText from "@/components/ui/LogoText";
import { useI18n } from "@/features/i18n/I18nContextValue";
import MobileDrawer from "./MobileDrawer";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";
import { SiteSettings } from "@/generated/prisma/client";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function LogoBar({
  siteSettings,
  navItems,
}: {
  siteSettings: SiteSettings;
  navItems: NavItem[];
}) {
  const { dict, locale } = useI18n();
  const [line1, ...rest] = dict.common.universityName.split(" ");
  const line2 = rest.join(" ");
  const header_title = locale === "tr" ? siteSettings.header_title_tr : siteSettings.header_title_en;

  return (
    <div className="sticky top-0 z-30 w-full border-b border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-2 md:static md:z-auto">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center px-4 py-3 md:py-4">

        <Link
          href={localePath(locale, "/")}
          className="flex items-center gap-2 transition-opacity hover:opacity-80 min-w-0"
        >
          <Image
            src="/baun_logo.png"
            alt={dict.common.universityName}
            width={52}
            height={52}
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 object-contain md:h-12 md:w-12"
            priority
          />
          <div className="hidden sm:block min-w-0">
            <LogoText line1={line1} line2={line2} color="#33B7BC" />
          </div>
        </Link>

        <Link
          href={localePath(locale, "/")}
          className="flex justify-center text-center transition-opacity hover:opacity-80 min-w-0 px-2"
        >

          <span className="font-bold uppercase sm:tracking-[0.04em] text-teal-3 dark:text-white text-lg @lg:text-2xl sm:text-[27px] md:text-3xl lg:text-4xl md:tracking-[0.12em] line-clamp-2">
            {header_title}
          </span>
        </Link>

        <div className="flex justify-end">
          <div className="hidden md:block">
            <Image
              src="/logos/turkiye_logo.png"
              alt="Türkiye"
              width={52}
              height={52}
              className="h-11 w-11 object-contain md:h-13 md:w-13"
              priority
            />
          </div>
          <div className="md:hidden">
            <MobileDrawer items={navItems} />
          </div>
        </div>
      </div>
    </div>
  );
}