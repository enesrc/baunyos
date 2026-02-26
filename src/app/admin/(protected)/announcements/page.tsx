import Link from "next/link";
import { getAnnouncements } from "@/features/announcements/queries";
import { deleteAnnouncement } from "@/features/announcements/actions";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Duyurular</h1>
        <Link
          href="/admin/announcements/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Yeni Duyuru
        </Link>
      </div>

      <div className="rounded-xl border border-border">
        {announcements.length === 0 && (
          <p className="p-6 text-sm opacity-50">Henüz duyuru yok.</p>
        )}
        {announcements.map((a, i) => (
          <div
            key={a.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== announcements.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium">{a.title_tr}</p>
              <p className="text-xs opacity-50">
                {a.published_at.toLocaleDateString("tr-TR")} •{" "}
                {a.is_active ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/announcements/${a.id}`}
                className="text-sm opacity-70 hover:opacity-100"
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
                  className="text-sm text-red-500 opacity-70 hover:opacity-100"
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