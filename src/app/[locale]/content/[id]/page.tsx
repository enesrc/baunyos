import { getPageById } from "@/features/content-pages/queries";
import { isLocale, type Locale } from "@/features/i18n/config";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";

  const page = await getPageById(Number(id));

  if (!page || !page.is_active) notFound();

  const title = locale === "tr" ? page.title_tr : page.title_en;
  const content = DOMPurify.sanitize(
    locale === "tr" ? page.content_tr : page.content_en
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">{title}</h1>
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
}