import { Suspense } from "react";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { LanguageProvider } from "@/features/Language/LanguageContext";
import { parseLang, type Lang } from "@/features/Language/config";
import LangClientSync from "@/features/Language/LangClientSync";
import SiteShell from "@/components/layout/SiteShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/features/site-settings/queries";
import { getNavItems } from "@/features/navbar/queries";
import { getContact } from "@/features/contact/queries";
import TouchableProvider from "@/components/ui/TouchableProvider";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Lang = parseLang(raw);

  const siteSettings = (await getSiteSettings())!;
  const navItems = await getNavItems();
  const contact = (await getContact())!;

  return (
    <ThemeProvider>
      <TouchableProvider />
      <LangClientSync lang={lang} />
      <LanguageProvider lang={lang}>
        <SiteShell>
          <Header siteSettings={siteSettings} navItems={navItems} />
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <Footer siteSettings={siteSettings} contact={contact} />
        </SiteShell>
      </LanguageProvider>
    </ThemeProvider>
  );
}