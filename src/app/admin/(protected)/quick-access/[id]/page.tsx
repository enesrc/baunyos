import QuickAccessForm from "@/components/sections/admin/QuickAccessForm";
import { getQuickAccessItemById } from "@/features/quick-access/queries";
import { getPages } from "@/features/content-pages/queries";
import { notFound } from "next/navigation";

export default async function EditQuickAccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, pages] = await Promise.all([getQuickAccessItemById(Number(id)), getPages()]);

  if (!item) notFound();

  return <QuickAccessForm item={item} pages={pages} />;
}