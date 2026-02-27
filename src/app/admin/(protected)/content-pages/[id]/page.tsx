import PageForm from "@/components/sections/admin/ContentPageForm";
import { getPageById } from "@/features/content-pages/queries";
import { notFound } from "next/navigation";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPageById(Number(id));

  if (!page) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Sayfa Düzenle</h1>
      <PageForm page={page} />
    </div>
  );
}