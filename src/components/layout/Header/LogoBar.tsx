import Image from "next/image";
import Link from "next/link";
import { langPath } from "@/lib/langPath";
import LogoText from "@/components/ui/LogoText";
import { useLanguage } from "@/features/Language/LanguageContext";
import MobileDrawer from "./MobileDrawer";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";
import { SiteSettings } from "@/generated/prisma/client";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function LogoBar({
  siteSettings,
  navItems,
  menuOpen,
  onMenuToggle,
}: {
  siteSettings: SiteSettings;
  navItems: NavItem[];
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const { lang, translate } = useLanguage();
  const universityName = translate("Balıkesir University", "Balıkesir Üniversitesi");
  const [line1, ...rest] = universityName.split(" ");
  const line2 = rest.join(" ");
  const header_title = translate(siteSettings.header_title_en, siteSettings.header_title_tr);

  return (
    <div className="sticky top-0 z-30 w-full border-b border-light-3 bg-white dark:border-dark-1 dark:bg-dark-2 md:static md:z-auto">
      <div className="relative mx-auto max-w-7xl flex items-center justify-between px-4 py-4 md:px-4 md:py-4">

        {/* LEFT */}
        <Link
          href={langPath(lang, "/")}
          className="flex items-center gap-2 min-w-0"
        >
          <Image
            src="/logos/baun_logo.png"
            alt={universityName}
            width={52}
            height={52}
            className="h-10 w-10 md:h-12 md:w-12 shrink-0"
            priority
          />
          <div className="hidden sm:block">
            <LogoText line1={line1} line2={line2} color="#33B7BC" />
          </div>
        </Link>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center px-2 max-w-[calc(100%-10rem)]">
          <span className="font-bold uppercase text-xl leading-none sm:text-2xl md:text-3xl lg:text-4xl sm:whitespace-nowrap align-middle">
            {header_title}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-end">
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
          <div className="block md:hidden">
            <MobileDrawer items={navItems} isOpen={menuOpen} onToggle={onMenuToggle} />
          </div>
        </div>

      </div>
    </div>
  );
}