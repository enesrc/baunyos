import PageForm from "@/components/sections/admin/ContentPageForm";
import { getPageById } from "@/features/content-pages/queries";
import { notFound } from "next/navigation";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageById(Number(id));

  if (!page) notFound();

  return <PageForm page={page} />;
}