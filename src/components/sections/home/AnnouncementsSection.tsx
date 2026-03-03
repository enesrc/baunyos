"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import AnnouncementCard from "@/components/ui/AnnouncementCard";
import type { AnnouncementGetPayload } from "@/generated/prisma/models/Announcement";

type Announcement = AnnouncementGetPayload<Record<string, never>>;

export default function AnnouncementsSection({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const { locale, dict } = useI18n();

  if (!announcements.length) return null;

  return (
    <section className="border-t border-light-3 bg-light-1 dark:border-dark-2 dark:bg-dark-4">
      <Container className="py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-dark-2 dark:text-light-1">
            {dict.sections.announcements}
          </h2>
          <Link
            href={localePath(locale, "/announcements")}
            className="hidden items-center gap-1 text-sm font-medium text-teal-3 transition-colors hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1 sm:flex"
          >
            {dict.common.viewAll}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              locale={locale}
              months={dict.months}
            />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href={localePath(locale, "/announcements")}
            className="inline-flex items-center gap-1 text-sm font-medium text-teal-3 dark:text-teal-2"
          >
            {dict.common.viewAll}
            <ArrowRight size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
}