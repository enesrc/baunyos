"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { localePath } from "@/lib/links";
import type { Locale } from "@/features/i18n/config";

interface SiteSettings { email?: string; phone?: string; }
interface FooterProps { locale?: Locale; settings: SiteSettings; }

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://www.facebook.com/balikesiruniversitesi", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/balikesiruniv", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/school/balikesir-university", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/BalikesirUniv", label: "X" },
  { icon: Youtube, href: "https://www.youtube.com/@BalikesirUniversitesi", label: "YouTube" },
];

export default function Footer({ locale = "tr", settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const headline = locale === "tr"
    ? "Uluslararası İlişkiler Araştırma ve Uygulama Merkezi"
    : "Center for International Relations Research and Application";

  const address = locale === "tr"
    ? "Balıkesir Üniversitesi Çağış Yerleşkesi, Mühendislik Fakültesi Ek Bina, Balıkesir"
    : "Balikesir University Cagis Campus, Engineering Faculty Annex, Balikesir, Turkiye";

  return (
    <footer className="bg-dark-2 dark:bg-dark-4">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Üst: Logo + Büyük Başlık */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-12 sm:flex-row sm:items-center sm:gap-8">
          <Image src="/baun_logo.png" alt="Balikesir Universitesi" width={80} height={80}
            className="h-20 w-20 shrink-0 object-contain opacity-90" />
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {headline}
          </h2>
        </div>

        {/* Alt: İletişim sol | Sosyal sağ */}
        <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">

          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3 text-sm text-gray-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-teal-2" />
              <span className="max-w-sm leading-relaxed">{address}</span>
            </li>
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-sm text-gray-2 transition-colors hover:text-teal-2">
                  <Mail size={15} className="shrink-0 text-teal-2" />
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-gray-2 transition-colors hover:text-teal-2">
                  <Phone size={15} className="shrink-0 text-teal-2" />
                  {settings.phone}
                </a>
              </li>
            )}
          </ul>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-3">
              {locale === "tr" ? "Sosyal Medya" : "Social Media"}
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-2 transition-all hover:border-teal-2 hover:bg-teal-2/10 hover:text-teal-2">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-[11px] text-gray-3 sm:flex-row">
          <span suppressHydrationWarning>
            © {currentYear} Balıkesir Üniversitesi &rsaquo; Bilgi İşlem Daire Başkanlığı Tarafından Geliştirilmiştir.
          </span>
          <div className="flex gap-4">
            <Link href={localePath(locale, "/")} className="transition-colors hover:text-teal-2">
              {locale === "tr" ? "Anasayfa" : "Home"}
            </Link>
            <Link href={localePath(locale, "/announcements")} className="transition-colors hover:text-teal-2">
              {locale === "tr" ? "Duyurular" : "Announcements"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}