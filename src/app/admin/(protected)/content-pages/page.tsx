import Link from "next/link";
import { getPages } from "@/features/content-pages/queries";
import { deletePage } from "@/features/content-pages/actions";

export default async function ContentPagesPage() {
  const pages = await getPages();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-3 dark:text-light-1">Sayfalar</h1>
        <Link
          href="/admin/content-pages/new"
          className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 transition-colors hover:bg-teal-4 dark:bg-teal-2 dark:hover:bg-teal-3"
        >
          Yeni Sayfa
        </Link>
      </div>

      <div className="rounded-md border border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-3">
        {pages.length === 0 && (
          <p className="p-6 text-sm text-gray-3 dark:text-gray-2">Henüz sayfa yok.</p>
        )}
        {pages.map((page, i) => (
          <div
            key={page.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== pages.length - 1 ? "border-b border-light-4 dark:border-dark-1" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-dark-3 dark:text-light-1">{page.title_tr}</p>
              <p className="text-xs text-gray-3 dark:text-gray-2">
                /{page.slug} •{" "}
                <span className={page.is_active ? "text-green-3 dark:text-green-2" : "text-gray-3"}>
                  {page.is_active ? "Aktif" : "Pasif"}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/content-pages/${page.id}`}
                className="text-sm text-teal-3 transition-colors hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1"
              >
                Düzenle
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePage(page.id);
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