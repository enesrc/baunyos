import { getPageById } from "@/features/content-pages/queries";
import { parseLang, type Lang } from "@/features/Language/config";
import { translate } from "@/features/Language/translate";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export default async function ContentPage({ params, }: { params: Promise<{ lang: string; id: string }>; }) {
  const { lang: raw, id } = await params;
  const lang: Lang = parseLang(raw);

  const page = await getPageById(Number(id));

  if (!page || !page.is_active) notFound();

  const title = translate(lang, page.title_en, page.title_tr);
  const content = DOMPurify.sanitize(translate(lang, page.content_en, page.content_tr));

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">{title}</h1>
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
}