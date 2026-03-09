import Link from "next/link";
import { getPages } from "@/features/content-pages/queries";
import { deletePage } from "@/features/content-pages/actions";

export default async function ContentPagesPage() {
  const pages = await getPages();

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/content-pages/new" className="bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors">
          Yeni Sayfa
        </Link>
      </div>

      <div className="border border-gray-200">
        {pages.length === 0 && (
          <p className="p-4 text-sm text-gray-400">Henüz sayfa yok.</p>
        )}
        {pages.map((page, i) => (
          <div key={page.id} className={`flex items-center justify-between px-4 py-3 ${i !== pages.length - 1 ? "border-b border-gray-200" : ""}`}>
            <div>
              <p className="text-sm font-medium text-gray-900">{page.title_tr}</p>
              <p className="text-xs text-gray-400">
                /{page.slug} ·{" "}
                <span className={page.is_active ? "text-green-600" : "text-gray-400"}>
                  {page.is_active ? "Aktif" : "Pasif"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/content-pages/${page.id}`} className="bg-yellow-400 px-3 py-1.5 text-sm text-white hover:bg-yellow-500 transition-colors">
                Düzenle
              </Link>
              <form action={async () => { "use server"; await deletePage(page.id); }}>
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