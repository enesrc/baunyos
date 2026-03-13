import NavItemForm from "@/components/sections/admin/NavItemForm";
import { getNavItemById, getNavItems } from "@/features/navbar/queries";
import { getPages } from "@/features/content-pages/queries";
import { getMediaItems } from "@/features/media/queries";
import { notFound } from "next/navigation";

export default async function EditNavItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [navItem, topLevelItems, pages, media] = await Promise.all([
    getNavItemById(Number(id)),
    getNavItems(),
    getPages(),
    getMediaItems(),
  ]);

  if (!navItem) notFound();

  return <NavItemForm navItem={navItem} topLevelItems={topLevelItems} pages={pages} media={media} />;
}