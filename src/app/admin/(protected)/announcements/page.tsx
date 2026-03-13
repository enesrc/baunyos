import Link from "next/link";
import { getAnnouncements } from "@/features/announcements/queries";
import { deleteAnnouncement } from "@/features/announcements/actions";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/announcements/new" className="bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors">
          Yeni Duyuru
        </Link>
      </div>

      <div className="border border-gray-200">
        {announcements.length === 0 && (
          <p className="p-4 text-sm text-gray-400">Henüz duyuru yok.</p>
        )}
        {announcements.map((a, i) => (
          <div key={a.id} className={`flex items-center justify-between px-4 py-3 ${i !== announcements.length - 1 ? "border-b border-gray-200" : ""}`}>
            <div>
              <p className="text-sm font-medium text-gray-900">{a.title_tr}</p>
              <p className="text-xs text-gray-400">
                {a.published_at.toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/announcements/${a.id}`} className="bg-yellow-400 px-3 py-1.5 text-sm text-white hover:bg-yellow-500 transition-colors">
                Düzenle
              </Link>
              <form action={async () => { "use server"; await deleteAnnouncement(a.id); }}>
                <button type="submit" className="bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 transition-colors">
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