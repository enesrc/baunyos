"use client";

import Link from "next/link";
import { langPath } from "@/features/Language/lang-path";
import type { Announcement } from "@/generated/prisma/client";
import { useLanguage } from "@/features/Language/LanguageContext";

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const { lang, translate } = useLanguage();

  const title = translate(announcement.title_en, announcement.title_tr)

  const date = new Date(announcement.published_at);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat(lang, { month: "short" }).format(date);
  const year = date.getFullYear();

  return (
    <Link
      href={langPath(lang, `/announcements/${announcement.id}`)}
      data-touchable
      className="group flex items-center gap-5 border border-light-4 bg-light-1 p-5 shadow-sm transition-all duration-200
        myhover:-translate-y-0.5 myhover:border-cyan myhover:bg-cyan/5 myhover:scale-[0.98]
        dark:border-dark-1 dark:bg-dark-2 dark:myhover:border-cyan-bright"
    >
      {/* Tarih Kutusu */}
      <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-md transition-colors
        bg-cyan/10 group-myhover:bg-cyan/20 dark:bg-cyan-bright/10"
      >
        <span className="text-3xl font-bold leading-none transition-colors
          text-cyan-dull group-myhover:text-cyan dark:text-cyan-brighter"
        >
          {day}
        </span>
        <span className="text-sm font-bold leading-none uppercase transition-colors mt-1
          text-cyan-dull group-myhover:text-cyan dark:text-cyan-brighter"
        >
          {month}
        </span>
        <span className="mt-1 text-xs font-bold leading-none text-cyan-dull dark:text-cyan-bright">
          {year}
        </span>
      </div>

      {/* Başlık */}
      <h3 className="min-w-0 text-lg font-semibold leading-snug tracking-tight transition-colors
        text-dark-4 group-myhover:text-cyan-dull dark:text-white dark:group-myhover:text-cyan-brighter"
      >
        {title}
      </h3>
    </Link>
  );
}
