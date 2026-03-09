import NavItemForm from "@/components/sections/admin/NavItemForm";
import { getNavItemById, getNavItems } from "@/features/navbar/queries";
import { notFound } from "next/navigation";

export default async function EditNavItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [navItem, topLevelItems] = await Promise.all([getNavItemById(Number(id)), getNavItems()]);

  if (!navItem) notFound();

  return <NavItemForm navItem={navItem} topLevelItems={topLevelItems} />;
}