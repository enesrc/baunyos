import { getPageById } from "@/features/content-pages/queries";
import { parseLang, type Lang } from "@/features/Language/config";
import { translate } from "@/features/Language/translate";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { langPath } from "@/features/Language/lang-path";

export default async function ContentPage({ params, }: { params: Promise<{ lang: string; id: string }>; }) {
  const { lang: raw, id } = await params;
  const lang: Lang = parseLang(raw);

  const page = await getPageById(Number(id));

  if (!page) notFound();

  const title = translate(lang, page.title_en, page.title_tr);
  const content = DOMPurify.sanitize(translate(lang, page.content_en, page.content_tr));

  return (
    <div className="relative w-full bg-light-3 dark:border-dark-1 dark:bg-dark-3">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-sm">
          <Link
            href={langPath(lang, "/")}
            data-touchable
            className="text-black transition-colors myhover:text-cyan-dull dark:text-light-5 dark:myhover:text-cyan underline"
          >
            {translate(lang, "Home", "Anasayfa")}
          </Link>
          <span className="text-dark-4/30 dark:text-light-6">/</span>
          <span className="text-dark-4/50 ">{`${translate(lang, "Content", "İçerik")} - ${id}`}</span>

        </nav>
        <h1 className="mb-8 text-3xl font-bold">{title}</h1>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}