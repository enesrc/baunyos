import { getNavItems } from "@/features/navbar/queries";
import { getSiteSettings } from "@/features/site-settings/queries";
import TopBar from "./TopBar";
import LogoBar from "./LogoBar";
import NavBar from "./NavBar";
import StickyHeader from "./StickyHeader";
import type { Locale } from "@/features/i18n/config";

export default async function Header({ locale }: { locale: Locale }) {
  const [navItems, settings] = await Promise.all([
    getNavItems(),
    getSiteSettings(),
  ]);

  const logoText = locale === "tr" ? settings.logo_text_tr : settings.logo_text_en;

  const topBar = <TopBar phone={settings.phone} email={settings.email} />;
  const logoBar = <LogoBar locale={locale} logoText={logoText} />;

  const navBar = (
    <div className="border-b border-light-4 bg-light-2/95 backdrop-blur-xl dark:border-dark-1 dark:bg-dark-3/95">
      <div className="flex items-center justify-center px-2 lg:px-0">
        <NavBar items={navItems} />
      </div>
    </div>
  );

  return <StickyHeader topBar={topBar} logoBar={logoBar} navBar={navBar} />;
}