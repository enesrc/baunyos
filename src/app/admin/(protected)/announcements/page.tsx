import Link from "next/link";
import { getAnnouncements } from "@/features/announcements/queries";
import { deleteAnnouncement } from "@/features/announcements/actions";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-3 dark:text-light-1">Duyurular</h1>
        <Link
          href="/admin/announcements/new"
          className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 hover:bg-teal-4 transition-colors dark:bg-teal-2 dark:hover:bg-teal-3"
        >
          Yeni Duyuru
        </Link>
      </div>

      <div className="rounded-md border border-light-4 dark:border-dark-1 bg-light-1 dark:bg-dark-3">
        {announcements.length === 0 && (
          <p className="p-6 text-sm text-gray-3 dark:text-gray-2">Henüz duyuru yok.</p>
        )}
        {announcements.map((a, i) => (
          <div
            key={a.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== announcements.length - 1 ? "border-b border-light-4 dark:border-dark-1" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-dark-3 dark:text-light-1">{a.title_tr}</p>
              <p className="text-xs text-gray-3 dark:text-gray-2">
                {a.published_at.toLocaleDateString("tr-TR")} •{" "}
                <span className={a.is_active ? "text-green-3 dark:text-green-2" : "text-gray-3"}>
                  {a.is_active ? "Aktif" : "Pasif"}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/announcements/${a.id}`}
                className="text-sm text-teal-3 hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1 transition-colors"
              >
                Düzenle
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteAnnouncement(a.id);
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-red-3 hover:text-red-4 dark:text-red-2 dark:hover:text-red-3 transition-colors"
                >
                  Sil
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}