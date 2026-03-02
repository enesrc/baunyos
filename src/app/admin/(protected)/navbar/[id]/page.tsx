import NavItemForm from "@/components/sections/admin/NavItemForm";
import { getNavItemById, getNavItems } from "@/features/navbar/queries";
import { notFound } from "next/navigation";

export default async function EditNavItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [navItem, topLevelItems] = await Promise.all([
    getNavItemById(Number(id)),
    getNavItems(),
  ]);

  if (!navItem) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-dark-3 dark:text-light-1">Navbar Öğesi Düzenle</h1>
      <NavItemForm navItem={navItem} topLevelItems={topLevelItems} />
    </div>
  );
}