"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Container from "@/components/ui/Container";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import AnnouncementCard from "@/components/ui/AnnouncementCard";
import type { Announcement } from "@/generated/prisma/client";

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-xl font-semibold text-cyan-dull transition-colors hover:text-cyan dark:text-cyan-bright dark:hover:text-cyan"
    >
      {label}
      <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default function AnnouncementsSection({ announcements }: { announcements: Announcement[] }) {
  const { locale, dict } = useI18n();
  if (!announcements.length) return null;

  const viewAllHref = localePath(locale, "/announcements");

  return (
    <section className="border-t border-light-4 bg-light-4 dark:border-dark-2 dark:bg-dark-6">
      <Container className="py-14">
        <div className="mb-8 flex flex-col items-center justify-center sm:flex-row sm:items-end sm:justify-between">
          <Link
            href={viewAllHref}
            className="group block"
          >
            <h2 className="text-4xl font-bold tracking-tight transition-colors 
              text-dark-2 group-hover:text-cyan 
            dark:text-white dark:group-hover:text-cyan text-center sm:text-left">
              {dict.sections.announcements}
            </h2>
          </Link>

          <div className="hidden sm:block">
            <ViewAllLink href={viewAllHref} label={dict.common.viewAll} />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:hidden">
          {announcements.slice(0, 4).map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>

        <div className="hidden sm:grid grid-cols-2 gap-3 lg:grid-cols-3">
          {announcements.slice(0, 6).map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <ViewAllLink href={viewAllHref} label={dict.common.viewAll} />
        </div>
      </Container>
    </section>
  );
}