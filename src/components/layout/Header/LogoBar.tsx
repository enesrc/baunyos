import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/links";
import LogoText from "@/components/ui/LogoText";
import { useI18n } from "@/features/i18n/I18nContextValue";
import MobileDrawer from "./MobileDrawer";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";
import { SiteSettingsGetPayload } from "@/generated/prisma/models";

type siteSettings = SiteSettingsGetPayload<Record<string, never>>;
type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function LogoBar({
  siteSettings,
  navItems,
}: {
  siteSettings: siteSettings;
  navItems: NavItem[];
}) {
  const { dict, locale } = useI18n();
  const [line1, ...rest] = dict.common.universityName.split(" ");
  const line2 = rest.join(" ");

  const logoText = locale === "tr" ? siteSettings.header_title_tr : siteSettings.header_title_en;

  return (
    <div className="sticky top-0 z-30 w-full border-b border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-2 md:static md:z-auto">
      <div className="mx-auto grid max-w-7xl grid-cols-5 items-center px-4 py-3 md:py-4">
        
        {/* Logo ve Üniversite Adı */}
        <Link
          href={localePath(locale, "/")}
          className="col-span-1 flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/baun_logo.png"
            alt={dict.common.universityName}
            width={52}
            height={52}
            className="h-10 w-10 object-contain sm:h-12 md:h-13 md:w-13"
            priority
          />
          <div className="hidden sm:block">
            <LogoText line1={line1} line2={line2} />
          </div>
        </Link>

        {/* Merkez Yazı (International Student vb.) */}
        <Link
          href={localePath(locale, "/")}
          className="col-span-3 flex justify-center text-center transition-opacity hover:opacity-80"
        >
          <span className="font-bold uppercase tracking-[0.04em] text-teal-3 dark:text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl md:tracking-[0.12em]">
            {logoText}
          </span>
        </Link>

        {/* Sağ Taraf (Türkiye Logo / Hamburger) */}
        <div className="col-span-1 flex justify-end">
          <div className="hidden md:block">
            <Image
              src="/turkiye_logo.png"
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