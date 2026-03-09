import Link from "next/link";
import { getQuickAccessItems } from "@/features/quick-access/queries";
import { deleteQuickAccessItem } from "@/features/quick-access/actions";

export default async function QuickAccessPage() {
  const items = await getQuickAccessItems();

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/quick-access/new" className="bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors">
          Yeni Öğe
        </Link>
      </div>

      <div className="border border-gray-200">
        {items.length === 0 && (
          <p className="p-4 text-sm text-gray-400">Henüz öğe yok.</p>
        )}
        {items.map((item, i) => (
          <div key={item.id} className={`flex items-center justify-between px-4 py-3 ${i !== items.length - 1 ? "border-b border-gray-200" : ""}`}>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title_tr}</p>
              <p className="text-xs text-gray-400">
                {item.href} · sıra: {item.order} ·{" "}
                <span className={item.is_active ? "text-green-600" : "text-gray-400"}>
                  {item.is_active ? "Aktif" : "Pasif"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/quick-access/${item.id}`} className="bg-yellow-400 px-3 py-1.5 text-sm text-white hover:bg-yellow-500 transition-colors">
                Düzenle
              </Link>
              <form action={async () => { "use server"; await deleteQuickAccessItem(item.id); }}>
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