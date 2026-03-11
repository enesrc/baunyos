"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@phosphor-icons/react/ssr";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { langPath } from "@/lib/langPath";
import { useLanguage } from "@/features/Language/LanguageContext";
import { SiteSettings, Contact } from "@/generated/prisma/client";
import InstagramButton from "@/components/ui/Instagram";

export default function Footer({ siteSettings, contact }: { siteSettings: SiteSettings; contact: Contact }) {
  const { lang, translate } = useLanguage();

  const headline = translate(siteSettings.footer_title_en, siteSettings.footer_title_tr);
  const address = translate(contact.address_en, contact.address_tr);

  const SOCIAL_LINKS = [
    { icon: FaFacebookF, href: contact.facebook, label: "Facebook", hoverClass: "hover:bg-[#1877F2] hover:text-white" },
    { icon: FaInstagram, href: contact.instagram, label: "Instagram", hoverClass: "hover:bg-[#9B4DD4] hover:text-white" },
    { icon: FaLinkedinIn, href: contact.linkedin, label: "Linkedin", hoverClass: "hover:bg-[#0A66C2] hover:text-white" },
    { icon: FaYoutube, href: contact.youtube, label: "Youtube", hoverClass: "hover:bg-[#FF0000] hover:text-white" },
    { icon: FaXTwitter, href: contact.twitter, label: "Twitter", hoverClass: "hover:bg-black hover:text-white" },
  ].filter((link) => link.href);

  return (
    <footer className="bg-cyan-deep dark:bg-dark-3">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center gap-4 border-b border-white/20 pb-10 sm:gap-8">
          <Image src="/logos/baun_logo.png" alt="Balikesir Universitesi" width={60} height={60}
            className="h-12 w-12 shrink-0 object-contain opacity-90 sm:h-20 sm:w-20" />
          <h2 className="text-xl font-bold leading-tight text-white sm:text-4xl">
            {headline}
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-sm text-white/90 dark:text-white/60">
              <MapPinIcon size={18} className="mt-0.5 shrink-0 text-white/70" />
              <span className="max-w-sm leading-relaxed">{address}</span>
            </li>
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-sm text-white/90 transition-colors hover:text-white dark:text-white/60 dark:hover:text-cyan-bright">
                  <EnvelopeIcon size={18} className="shrink-0 text-white/70" />
                  {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-white/90 transition-colors hover:text-white dark:text-white/60 dark:hover:text-cyan-bright">
                  <PhoneIcon size={18} className="shrink-0 text-white/70" />
                  {contact.phone}
                </a>
              </li>
            )}
          </ul>

          {SOCIAL_LINKS.length > 0 && (
            <div className="flex justify-center sm:justify-end">
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverClass }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-all dark:bg-white/10 dark:text-white/70 ${hoverClass} dark:${hoverClass}`}
                  >
                    <Icon size={22} />
                  </a>
                ))}
                <InstagramButton href="" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-[11px] text-white/60 dark:text-white/30 sm:flex-row">
          <span className="text-center sm:text-left" suppressHydrationWarning>
            © 2026 Balıkesir Üniversitesi &rsaquo; Bilgi İşlem Daire Başkanlığı Tarafından Geliştirilmiştir.
          </span>
          <div className="flex gap-6">
            <Link href={langPath(lang, "/")} className="transition-colors hover:text-white dark:hover:text-cyan">
              {translate("Home", "Anasayfa")}
            </Link>
            <Link href={langPath(lang, "/announcements")} className="transition-colors hover:text-white dark:hover:text-cyan">
              {translate("Announcements", "Duyurular")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}