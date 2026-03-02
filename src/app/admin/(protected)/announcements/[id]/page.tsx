import { getAnnouncementById } from "@/features/announcements/queries";
import AnnouncementForm from "@/components/sections/admin/AnnouncementForm";
import { notFound } from "next/navigation";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await getAnnouncementById(Number(id));

  if (!announcement) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-dark-3 dark:text-light-1">Duyuru Düzenle</h1>
      <AnnouncementForm announcement={announcement} />
    </div>
  );
}