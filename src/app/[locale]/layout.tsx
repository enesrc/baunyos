import { Suspense } from "react";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { getDictionary } from "@/features/i18n/getDictionary";
import { I18nProvider } from "@/features/i18n/I18nContextValue";
import { isLocale, type Locale } from "@/features/i18n/config";
import LocaleClientSync from "@/features/i18n/LocaleClientSync";
import SiteShell from "@/components/layout/SiteShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/features/site-settings/queries";
import { getNavItems } from "@/features/navbar/queries";
import { getContact } from "@/features/contact/queries";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = await getDictionary(locale);
  const siteSettings = (await getSiteSettings())!;
  const navItems = await getNavItems();
  const contact = (await getContact())!;

  return (
    <ThemeProvider>
      <LocaleClientSync locale={locale} />
      <I18nProvider dict={dict} locale={locale}>
        <SiteShell>
          <Header siteSettings={siteSettings} navItems={navItems} contact={contact}/>
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <Footer siteSettings={siteSettings} contact={contact} />
        </SiteShell>
      </I18nProvider>
    </ThemeProvider>
  );
}