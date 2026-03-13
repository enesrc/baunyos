import QuickAccessForm from "@/components/sections/admin/QuickAccessForm";
import { getQuickAccessItems } from "@/features/quick-access/queries";
import { getPages } from "@/features/content-pages/queries";
import { getMediaItems } from "@/features/media/queries";

export default async function NewQuickAccessPage() {
  const [allItems, pages, media] = await Promise.all([getQuickAccessItems(), getPages(), getMediaItems()]);
  return <QuickAccessForm allItems={allItems} pages={pages} media={media} />;
}
