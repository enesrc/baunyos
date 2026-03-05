import Link from "next/link";
import { getAnnouncements } from "@/features/announcements/queries";
import { getDictionary } from "@/features/i18n/getDictionary";
import { localePath } from "@/lib/links";
import { isLocale, type Locale } from "@/features/i18n/config";
import AnnouncementCard from "@/components/ui/AnnouncementCard";
import { GradientHero } from "@/components/ui/GradientHero"; // Yeni bileşeni import ettik

export default async function AnnouncementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = await getDictionary(locale);

  const announcements = await getAnnouncements();

  return (
    <main>
      {/* Artık tek bir component ile tüm o karmaşık div'lerden kurtulduk */}
      <GradientHero>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-light-4">
            <Link
              href={localePath(locale, "/")}
              className="font-medium transition-colors hover:text-white hover:underline"
            >
              {dict.common.home}
            </Link>
            <span>/</span>
            <span className="font-medium text-white">
              {dict.sections.announcements}
            </span>
          </nav>
        </div>

        {/* Başlık */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
          {dict.sections.announcements}
        </h1>
      </GradientHero>

      {/* Duyuru grid */}
      <section className="bg-light-4 dark:bg-dark-3 mx-auto">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {announcements.length === 0 ? (
            <p className="text-lg text-gray-3 dark:text-gray-2">
              {dict.common.noContent}
            </p>
          ) : (
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
          )}

        </div>
      </section>
    </main>
  );
}