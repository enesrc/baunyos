import { getAnnouncementById } from "@/features/announcements/queries";
import AnnouncementForm from "@/components/sections/admin/AnnouncementForm";
import { notFound } from "next/navigation";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await getAnnouncementById(Number(id));

  if (!announcement) notFound();

  return <AnnouncementForm announcement={announcement} />;
}