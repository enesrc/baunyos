import Link from "next/link";
import { getAnnouncements } from "@/features/announcements/queries";
import { langPath } from "@/lib/langPath";
import { parseLang, type Lang } from "@/features/Language/config";
import AnnouncementCard from "@/components/ui/Announcement/AnnouncementCard";
import { translate } from "@/features/Language/translate";

export default async function AnnouncementsPage({ params, }: { params: Promise<{ lang: string }>; }) {
  const { lang: raw } = await params;
  const lang: Lang = parseLang(raw);

  const announcements = await getAnnouncements();

  return (
    <>
      {/* ── Sayfa Başlığı ─────────────────────────────────────── */}
      <div className="relative w-full bg-light-3 dark:border-dark-1 dark:bg-dark-3">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-sm">
            <Link
              href={langPath(lang, "/")}
              className="text-dark-4/50 transition-colors hover:text-cyan-dull dark:text-light-5 dark:hover:text-cyan"
            >
              {translate(lang, "Home", "Ana Sayfa")}
            </Link>
            <span className="text-dark-4/30 dark:text-light-6">/</span>
            <span className="font-medium text-dark-4 dark:text-white">
              {translate(lang, "Announcements", "Duyurular")}
            </span>
          </nav>

          {/* Başlık */}
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-dark-4 dark:text-white">
              {translate(lang, "Announcements", "Duyurular")}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Duyuru Listesi ────────────────────────────────────── */}
      <div className="relative bg-light-3 dark:bg-dark-2">
        <div className="relative mx-auto max-w-7xl px-6 py-10">
          {announcements.length === 0 ? (
            <p className="py-20 text-center text-base text-dark-4/40 dark:text-light-6">
              {translate(lang, "There is no Announcement.", "Duyuru yok.")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}