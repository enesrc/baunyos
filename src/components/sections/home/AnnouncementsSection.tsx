"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import AnnouncementCard from "@/components/ui/AnnouncementCard";
import type { AnnouncementGetPayload } from "@/generated/prisma/models/Announcement";

type Announcement = AnnouncementGetPayload<Record<string, never>>;

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-2 text-base font-semibold text-teal-3 transition-colors hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1"
    >
      {label}
      <ArrowRight size={17} />
      <span className="absolute bottom-0 left-0 h-px w-0 bg-teal-3 group-hover:w-full" />
    </Link>
  );
}

export default function AnnouncementsSection({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const { locale, dict } = useI18n();

  if (!announcements.length) return null;

  const mobileItems = announcements.slice(0, 4);
  const viewAllHref = localePath(locale, "/announcements");

  return (
    <section className="border-t border-light-3 bg-light-1 dark:border-dark-2 dark:bg-dark-4">
      <Container className="py-14">
        {/* Başlık */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-dark-2 dark:text-light-1">
            {dict.sections.announcements}
          </h2>
          <span className="hidden sm:block">
            <ViewAllLink href={viewAllHref} label={dict.common.viewAll} />
          </span>
        </div>

        {/* Mobil: tek kolon, max 4 kart */}
        <div className="flex flex-col gap-3 sm:hidden">
          {mobileItems.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              locale={locale}
              months={dict.months}
            />
          ))}
        </div>

        {/* sm+: grid */}
        <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              locale={locale}
              months={dict.months}
            />
          ))}
        </div>

        {/* Mobil: tümünü gör */}
        <div className="mt-6 flex justify-center sm:hidden">
          <ViewAllLink href={viewAllHref} label={dict.common.viewAll} />
        </div>
      </Container>
    </section>
  );
}