import Link from "next/link";
import { getAnnouncements } from "@/features/announcements/queries";
import { getDictionary } from "@/features/i18n/getDictionary";
import { localePath } from "@/lib/links";
import { isLocale, type Locale } from "@/features/i18n/config";
import AnnouncementCard from "@/components/ui/AnnouncementCard";

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
      {/* Hero — detail sayfasıyla aynı stil */}
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
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-teal-1">
              <Link
                href={localePath(locale, "/")}
                className="font-medium transition-colors hover:text-white"
              >
                {dict.common.home}
              </Link>
              <span>/</span>
              <span className="text-white">{dict.sections.announcements}</span>
            </nav>
          </div>

          {/* Başlık */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
            {dict.sections.announcements}
          </h1>
        </div>
      </section>

      {/* Duyuru grid */}
      <section className="mx-auto max-w-5xl px-6 py-12">
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
      </section>
    </main>
  );
}