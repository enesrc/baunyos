"use client";

import Link from "next/link";
import { localePath } from "@/lib/links";
import type { Locale } from "@/features/i18n/config";
import type { AnnouncementGetPayload } from "@/generated/prisma/models/Announcement";

type Announcement = AnnouncementGetPayload<Record<string, never>>;

interface AnnouncementCardProps {
  announcement: Announcement;
  locale: Locale;
  months: string[];
}

export default function AnnouncementCard({
  announcement,
  locale,
  months,
}: AnnouncementCardProps) {
  const title =
    locale === "tr" ? announcement.title_tr : announcement.title_en;

  const d = new Date(announcement.published_at);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return (
    <Link
      href={localePath(locale, `/announcements/${announcement.id}`)}
      className="group flex items-center gap-5 rounded-md border border-light-3 bg-light-2 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-3 hover:shadow-md dark:border-dark-1 dark:bg-dark-5 dark:hover:border-teal-3"
    >
      {/* Tarih kutusu */}
      <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-md bg-teal-3/10 dark:bg-teal-2/20">
        <span className="text-3xl font-bold leading-none text-teal-3 dark:text-light-4">
          {day}
        </span>
        <span className="mt-1.5 text-xs font-bold uppercase leading-none text-teal-3 dark:text-light-4">
          {month} {year}
        </span>
      </div>

      {/* Başlık */}
      <h3 className="min-w-0 text-lg font-semibold leading-snug tracking-tight text-dark-2 group-hover:text-teal-3 dark:text-light-2 dark:group-hover:text-teal-2">
        {title}
      </h3>
    </Link>
  );
}