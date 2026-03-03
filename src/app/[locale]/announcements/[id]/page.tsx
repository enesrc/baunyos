import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarClock, ArrowLeft } from "lucide-react";
import { getAnnouncementById } from "@/features/announcements/queries";
import { getDictionary } from "@/features/i18n/getDictionary";
import { localePath } from "@/lib/links";
import { isLocale, type Locale } from "@/features/i18n/config";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = await getDictionary(locale);

  const announcement = await getAnnouncementById(Number(id));
  if (!announcement) notFound();

  const title = locale === "tr" ? announcement.title_tr : announcement.title_en;
  const content = locale === "tr" ? announcement.content_tr : announcement.content_en;

  const d = new Date(announcement.published_at);
  const day = d.getDate();
  const month = dict.months[d.getMonth()];
  const year = d.getFullYear();

  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--teal-4) 0%, var(--teal-3) 50%, var(--teal-2) 100%)",
        }}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-10">
          {/* Üst satır: Geri + Breadcrumb (sol) — Tarih (sağ) */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-2 text-sm text-teal-1">
                <Link
                  href={localePath(locale, "/")}
                  className="font-medium transition-colors hover:text-white"
                >
                  {dict.common.home}
                </Link>
                <span>/</span>
                <Link
                  href={localePath(locale, "/announcements")}
                  className="font-medium transition-colors hover:text-white"
                >
                  {dict.sections.announcements}
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <CalendarClock size={17} className="text-teal-1 " />
              <span>{day} {month} {year}</span>
            </div>
          </div>

          {/* Başlık */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
            {title}
          </h1>
        </div>
      </section>

      {/* İçerik */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {content ? (
          <div
            className="prose prose-lg max-w-none text-dark-3 prose-headings:text-dark-3 prose-p:leading-relaxed prose-a:text-teal-3 dark:text-light-1 dark:prose-headings:text-light-1 dark:prose-a:text-teal-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-lg text-gray-3 dark:text-gray-2">
            {dict.common.noContent}
          </p>
        )}
      </section>
    </main>
  );
}