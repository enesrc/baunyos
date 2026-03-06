import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDots } from "@phosphor-icons/react/ssr";
import { getAnnouncementById } from "@/features/announcements/queries";
import { getDictionary } from "@/features/i18n/getDictionary";
import { localePath } from "@/lib/links";
import { isLocale, type Locale } from "@/features/i18n/config";
import { GradientHero } from "@/components/ui/GradientHero"; // Dosya yolunu projenize göre ayarlayın

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
      <GradientHero>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2 text-sm text-light-4">
              <Link
                href={localePath(locale, "/")}
                className="font-medium transition-colors hover:text-white hover:underline"
              >
                {dict.common.home}
              </Link>
              <span>/</span>
              <Link
                href={localePath(locale, "/announcements")}
                className="font-medium transition-colors hover:text-white hover:underline"
              >
                {dict.sections.announcements}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CalendarDots size={15} className="text-teal-1 " />
            <span>{day} {month} {year}</span>
          </div>
        </div>

        {/* Başlık */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
          {title}
        </h1>
      </GradientHero>

      {/* İçerik (Burası aynı kalıyor) */}
      <section className="bg-light-2 dark:bg-dark-3">
        <div className="mx-auto max-w-5xl px-6 py-12">
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
        </div>
      </section>
    </main>
  );
}