import Link from "next/link";
import { getQuickAccessItems } from "@/features/quick-access/queries";
import { deleteQuickAccessItem } from "@/features/quick-access/actions";

export default async function QuickAccessPage() {
  const items = await getQuickAccessItems();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hızlı Erişim</h1>
        <Link
          href="/admin/quick-access/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Yeni Öğe
        </Link>
      </div>

      <div className="rounded-xl border border-border">
        {items.length === 0 && (
          <p className="p-6 text-sm opacity-50">Henüz öğe yok.</p>
        )}
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== items.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium">{item.title_tr}</p>
              <p className="text-xs opacity-50">
                {item.href} • sıra: {item.order} •{" "}
                {item.is_active ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/quick-access/${item.id}`}
                className="text-sm opacity-70 hover:opacity-100"
              >
                Düzenle
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteQuickAccessItem(item.id);
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