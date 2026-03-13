import QuickAccessForm from "@/components/sections/admin/QuickAccessForm";
import { getQuickAccessItemById, getQuickAccessItems } from "@/features/quick-access/queries";
import { getPages } from "@/features/content-pages/queries";
import { getMediaItems } from "@/features/media/queries";
import { notFound } from "next/navigation";

export default async function EditQuickAccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, allItems, pages, media] = await Promise.all([
    getQuickAccessItemById(Number(id)),
    getQuickAccessItems(),
    getPages(),
    getMediaItems(),
  ]);

  if (!item) notFound();

  return <QuickAccessForm item={item} allItems={allItems} pages={pages} media={media} />;
}
