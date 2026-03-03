import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { getDictionary } from "@/features/i18n/getDictionary";
import { I18nProvider } from "@/features/i18n/I18nContextValue";
import { isLocale, type Locale } from "@/features/i18n/config";
import LocaleClientSync from "@/features/i18n/LocaleClientSync";
import SiteShell from "@/components/layout/SiteShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/features/site-settings/queries";

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
  const settings = await getSiteSettings();
  return (
    <ThemeProvider>
      <LocaleClientSync locale={locale} />
      <I18nProvider dict={dict} locale={locale}>
        <SiteShell
          header={<Header locale={locale} />}
          footer={<Footer locale={locale} settings={settings} />}
          isHomePage={true}
        >
          {children}
        </SiteShell>
      </I18nProvider>
    </ThemeProvider>
  );
}