import QuickAccessForm from "@/components/sections/admin/QuickAccessForm";
import { getPages } from "@/features/content-pages/queries";

export default async function NewQuickAccessPage() {
  const pages = await getPages();
  return <QuickAccessForm pages={pages} />;
}