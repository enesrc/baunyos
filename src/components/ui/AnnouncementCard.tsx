"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { localePath } from "@/lib/links";
import type { Announcement } from "@/generated/prisma/client";
import { useI18n } from "@/features/i18n/I18nContextValue";

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const { locale, dict } = useI18n();
  const [isTouched, setIsTouched] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Zamanlayıcıyı tutmak için
  
  const title = locale === "tr" ? announcement.title_tr : announcement.title_en;

  const d = new Date(announcement.published_at);
  const day = d.getDate();
  const month = dict.months[d.getMonth()];
  const year = d.getFullYear();

  const handleTouchStart = () => {
    // Eğer çalışan bir zamanlayıcı varsa (hızlı hızlı basarsan) temizle
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    // Parmağı çekince hemen kapatma, 200ms bekle ki efekt görünsün
    timeoutRef.current = setTimeout(() => {
      setIsTouched(false);
    }, 200); 
  };

  const handleTouchMove = () => {
    // Scroll yapıyorsa beklemeden kapat, sayfa kayarken takılı kalmasın
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsTouched(false);
  };

  return (
    <Link
      href={localePath(locale, `/announcements/${announcement.id}`)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove} // Scroll desteği
      onTouchCancel={handleTouchEnd}
      className={`group flex items-center gap-5 border p-5 shadow-sm transition-all duration-200 
        ${isTouched 
          ? "border-cyan bg-cyan/5 scale-[0.98] -translate-y-0.5" 
          : "border-light-3 bg-light-2 hover:-translate-y-0.5 hover:border-cyan dark:border-dark-1 dark:bg-dark-3 dark:hover:border-cyan-bright"
        }
      `}
    >
      {/* Tarih Kutusu */}
      <div className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-md transition-colors
        ${isTouched ? "bg-cyan/20" : "bg-cyan/10 dark:bg-cyan-bright/10"}`}
      >
        <span className={`text-3xl font-bold leading-none transition-colors 
          ${isTouched ? "text-cyan" : "text-cyan-dull dark:text-cyan-brighter"}`}
        >
          {day}
        </span>
        <span className="mt-1.5 text-xs font-bold uppercase leading-none text-cyan-dull dark:text-cyan-bright">
          {month} {year}
        </span>
      </div>

      {/* Başlık */}
      <h3 className={`min-w-0 text-lg font-semibold leading-snug tracking-tight transition-colors 
        ${isTouched ? "text-cyan" : "text-dark-4 group-hover:text-cyan-dull dark:text-white dark:group-hover:text-cyan-brighter"}`}
      >
        {title}
      </h3>
    </Link>
  );
}