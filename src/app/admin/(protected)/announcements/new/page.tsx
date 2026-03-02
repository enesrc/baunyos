import AnnouncementForm from "@/components/sections/admin/AnnouncementForm";

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-dark-3 dark:text-light-1">Yeni Duyuru</h1>
      <AnnouncementForm />
    </div>
  );
}