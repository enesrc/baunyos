import NavItemForm from "@/components/sections/admin/NavItemForm";
import { getNavItems } from "@/features/navbar/queries";
import { getPages } from "@/features/content-pages/queries";
import { getMediaItems } from "@/features/media/queries";

export default async function NewNavItemPage({ searchParams }: { searchParams: Promise<{ parent_id?: string }> }) {
  const { parent_id } = await searchParams;
  const [topLevelItems, pages, media] = await Promise.all([getNavItems(), getPages(), getMediaItems()]);

  return (
    <NavItemForm
      parentId={parent_id ? Number(parent_id) : undefined}
      topLevelItems={topLevelItems}
      pages={pages}
      media={media}
    />
  );
}