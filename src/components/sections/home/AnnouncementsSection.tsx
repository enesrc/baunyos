"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useLanguage } from "@/features/Language/LanguageContext";
import { langPath } from "@/features/Language/lang-path";
import { AnnouncementCard, ViewAll } from "@/components/ui/Announcement";
import type { Announcement } from "@/generated/prisma/client";

export default function AnnouncementsSection({ announcements }: { announcements: Announcement[] }) {
  const { translate, lang } = useLanguage();
  const viewAllHref = langPath(lang, "/announcements");

  if (!announcements.length) return null;

  return (
    <section className="border-t border-light-4 bg-light-3 dark:border-dark-2 dark:bg-dark-5 relative">
      <Container className="py-14">
        {/* Duyurular başlık + Desktop tümünü gör butonu*/}
        <div className="mb-8 flex flex-col items-center justify-center sm:flex-row sm:items-end sm:justify-between">
          <Link
            href={viewAllHref}
            data-touchable
            className="group block"
          >
            <h2 className="text-4xl font-bold tracking-tight transition-colors
              text-dark-2 group-myhover:text-cyan
            dark:text-white dark:group-myhover:text-cyan text-center sm:text-left">
              {translate("Announcements", "Duyurular")}
            </h2>
          </Link>

          {/* Desktop tümünü gör butonu*/}
          <div className="hidden sm:block">
            <ViewAll href={viewAllHref} lang={lang} />
          </div>
        </div>

        {/* Mobile duyurular görünüm (4)*/}
        <div className="flex flex-col gap-3 sm:hidden">
          {announcements.slice(0, 4).map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>

        {/* Desktop Duyurular görünüm (6)*/}
        <div className="hidden sm:grid grid-cols-2 gap-3 lg:grid-cols-3">
          {announcements.slice(0, 6).map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>

        {/* Mobile tümünü gör butonu*/}
        <div className="mt-8 flex justify-center sm:hidden">
          <ViewAll href={viewAllHref} lang={lang} />
        </div>
      </Container>
      {/* Duyurulardan hızlı erişime renk geçişi */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-b from-transparent to-light-amber/50 dark:hidden" />
    </section>
  );
}