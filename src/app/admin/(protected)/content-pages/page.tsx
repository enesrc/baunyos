import Link from "next/link";
import { getPages } from "@/features/content-pages/queries";
import { deletePage } from "@/features/content-pages/actions";

export default async function ContentPagesPage() {
  const pages = await getPages();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sayfalar</h1>
        <Link
          href="/admin/content-pages/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Yeni Sayfa
        </Link>
      </div>

      <div className="rounded-xl border border-border">
        {pages.length === 0 && (
          <p className="p-6 text-sm opacity-50">Henüz sayfa yok.</p>
        )}
        {pages.map((page, i) => (
          <div
            key={page.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== pages.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium">{page.title_tr}</p>
              <p className="text-xs opacity-50">
                /{page.slug} • {page.is_active ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/content-pages/${page.id}`}
                className="text-sm opacity-70 hover:opacity-100"
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