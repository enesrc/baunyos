import QuickAccessForm from "@/components/sections/admin/QuickAccessForm";
import { getQuickAccessItemById } from "@/features/quick-access/queries";
import { notFound } from "next/navigation";

export default async function EditQuickAccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getQuickAccessItemById(Number(id));

  if (!item) notFound();

  return <QuickAccessForm item={item} />;
}