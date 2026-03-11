import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDotsIcon, ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { getAnnouncementById } from "@/features/announcements/queries";
import { langPath } from "@/lib/langPath";
import { parseLang, type Lang } from "@/features/Language/config";
import { translate } from "@/features/Language/translate";

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ lang: string; id: string }>; }) {
  const { lang: raw, id } = await params;
  const lang: Lang = parseLang(raw);

  const announcement = await getAnnouncementById(Number(id));
  if (!announcement) notFound();

  const title = translate(lang, announcement.title_en, announcement.title_tr);
  const content = translate(lang, announcement.content_en, announcement.content_tr);

  const date = new Date(announcement.published_at);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat(lang, { month: "short" }).format(date);
  const year = date.getFullYear();

  return (
    <main className="min-h-screen bg-light-1 dark:bg-dark-2">

      {/* ── Sayfa Başlığı ─────────────────────────────────────── */}
      <div className="w-full border-b border-light-4 bg-light-2 dark:border-dark-1 dark:bg-dark-3">
        <div className="mx-auto max-w-5xl px-6 py-10">

          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-sm">
            <Link
              href={langPath(lang, "/")}
              className="text-dark-4/50 transition-colors hover:text-cyan-dull dark:text-light-5 dark:hover:text-cyan"
            >
              {translate(lang, "Home", "Anasayfa")}
            </Link>
            <span className="text-dark-4/30 dark:text-light-6">/</span>
            <Link
              href={langPath(lang, "/announcements")}
              className="text-dark-4/50 transition-colors hover:text-cyan-dull dark:text-light-5 dark:hover:text-cyan"
            >
              {translate(lang, "Announcements", "Duyurular")}
            </Link>
          </nav>

          {/* Başlık + Tarih */}
          <div className="flex items-start gap-4">
            <div className="mt-1.5 h-10 w-0.75 shrink-0 rounded-full bg-cyan" />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-dark-4 dark:text-white sm:text-3xl">
                {title}
              </h1>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-dark-4/50 dark:text-light-5">
                <CalendarDotsIcon size={14} className="shrink-0" />
                <span>{day} {month} {year}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── İçerik ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-10">

        {content ? (
          <div
            className="prose prose-lg max-w-none
              text-dark-4 prose-headings:text-dark-4 prose-p:leading-relaxed
              prose-a:text-cyan-dull prose-a:no-underline hover:prose-a:text-cyan
              prose-strong:text-dark-4 prose-li:text-dark-4
              dark:text-light-2 dark:prose-headings:text-white
              dark:prose-a:text-cyan-bright dark:hover:prose-a:text-cyan
              dark:prose-strong:text-light-1 dark:prose-li:text-light-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-base text-dark-4/40 dark:text-light-6">
            {translate(lang, "bakilacak", "bakilacak")}
          </p>
        )}

        {/* Geri butonu */}
        <div className="mt-12 border-t border-light-4 pt-8 dark:border-dark-1">
          <Link
            href={langPath(lang, "/announcements")}
            className="inline-flex items-center gap-2 text-sm font-medium
              text-cyan-dull transition-colors hover:text-cyan
              dark:text-cyan-bright dark:hover:text-cyan"
          >
            <ArrowLeftIcon size={15} />
            {translate(lang, "Back to Announcements", "Tüm Duyurulara Dön")}
          </Link>
        </div>

      </div>

    </main>
  );
}
