import Link from "next/link";
import { getQuickAccessItems } from "@/features/quick-access/queries";
import { deleteQuickAccessItem } from "@/features/quick-access/actions";

export default async function QuickAccessPage() {
  const items = await getQuickAccessItems();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-3 dark:text-light-1">Hızlı Erişim</h1>
        <Link
          href="/admin/quick-access/new"
          className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 transition-colors hover:bg-teal-4 dark:bg-teal-2 dark:hover:bg-teal-3"
        >
          Yeni Öğe
        </Link>
      </div>

      <div className="rounded-md border border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-3">
        {items.length === 0 && (
          <p className="p-6 text-sm text-gray-3 dark:text-gray-2">Henüz öğe yok.</p>
        )}
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== items.length - 1 ? "border-b border-light-4 dark:border-dark-1" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-dark-3 dark:text-light-1">{item.title_tr}</p>
              <p className="text-xs text-gray-3 dark:text-gray-2">
                {item.href} • sıra: {item.order} •{" "}
                <span className={item.is_active ? "text-green-3 dark:text-green-2" : "text-gray-3"}>
                  {item.is_active ? "Aktif" : "Pasif"}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/quick-access/${item.id}`}
                className="text-sm text-teal-3 transition-colors hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1"
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
                  className="text-sm text-red-3 transition-colors hover:text-red-4 dark:text-red-2 dark:hover:text-red-3"
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