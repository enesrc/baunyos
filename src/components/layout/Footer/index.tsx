"use client";

import Image from "next/image";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@phosphor-icons/react/ssr";
import { useLanguage } from "@/features/Language/LanguageContext";
import { SiteSettings, Contact } from "@/generated/prisma/client";
import SocialMediaButtons from "@/components/ui/SocialMediaButtons";

export default function Footer({ siteSettings, contact }: { siteSettings: SiteSettings; contact: Contact }) {
  const { translate } = useLanguage();

  const headline = translate(siteSettings.footer_title_en, siteSettings.footer_title_tr);
  const address = translate(contact.address_en, contact.address_tr);
  const footerInfo = translate(
    "© 2026 Developed by the Information Technology Department of Balıkesir University.",
    "© 2026 Balıkesir Üniversitesi Bilgi İşlem Daire Başkanlığı Tarafından Geliştirilmiştir."
  );

  return (
    <footer className="bg-cyan-deep dark:bg-dark-3">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* 1. Logo + Text Kısmı */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-white/20 pb-4 sm:gap-8">
          <div className="flex items-center gap-4">
            <Image
              src="/logos/baun-logo.png"
              alt="Balikesir Universitesi"
              width={60}
              height={60}
              className="h-12 w-12 shrink-0 object-contain opacity-90 sm:h-18 sm:w-18"
            />
            <h2 className="text-xl sm:text-3xl font-bold text-white sm:max-w-lg">
              {headline}
            </h2>
          </div>
          {/* Desktop Socials (Sağ üstte kalmaya devam eder) */}
          <div className="hidden sm:flex items-start gap-2">
            <SocialMediaButtons contact={contact} />
          </div>
        </div>

        {/* Ana İçerik Konteyneri */}
        <div className="mt-6 flex flex-col gap-5">
          
          {/* Mobil 1. Sıra: Adres */}
          <div className="order-1 flex items-start gap-3 text-sm text-white dark:text-white">
            <MapPinIcon size={18} className="mt-0.5 shrink-0 text-white" />
            <span>{address}</span>
          </div>

          {/* Mobil 2. Sıra: Mail ve Telefon (Desktop'ta sağda Footer Info ile hizalı) */}
          <div className="order-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              {contact.email && (
                <a href={`mailto:${contact.email}`}
                  data-touchable
                  className="flex items-center gap-3 text-sm text-white/90 transition-colors myhover:text-white dark:text-white dark:myhover:text-cyan-bright">
                  <EnvelopeIcon size={18} className="shrink-0 text-white/70" />
                  {contact.email}
                </a>
              )}

              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  data-touchable
                  className="flex items-center gap-3 text-sm text-white/90 transition-colors myhover:text-white dark:text-white/60 dark:myhover:text-cyan-bright">
                  <PhoneIcon size={18} className="shrink-0 text-white/70" />
                  {contact.phone}
                </a>
              )}
            </div>

            {/* Desktop'ta Adres/İletişimle aynı hizada olan sağdaki metin */}
            <span className="hidden sm:block shrink-0 text-xs text-white/70 pt-0.5 whitespace-nowrap">
              {footerInfo}
            </span>
          </div>

          {/* Mobil 3. Sıra: Sosyal Medyalar (Ortalanmış) */}
          <div className="order-3 flex justify-center gap-2 sm:hidden pt-2">
            <SocialMediaButtons contact={contact} />
          </div>

          {/* Mobil 4. Sıra: Çizgi ve Footer Info */}
          <div className="order-4 sm:hidden border-t border-white/20 pt-5 mt-2">
            <div className="text-xs text-white/70 text-center">
              {footerInfo}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}