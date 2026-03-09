import Link from "next/link";
import { getNavItems } from "@/features/navbar/queries";
import { deleteNavItem } from "@/features/navbar/actions";

export default async function NavbarPage() {
  const items = await getNavItems();

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/navbar/new" className="bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors">
          Yeni Öğe
        </Link>
      </div>

      <div className="border border-gray-200">
        {items.length === 0 && (
          <p className="p-4 text-sm text-gray-400">Henüz navbar öğesi yok.</p>
        )}
        {items.map((item, i) => (
          <div key={item.id}>
            <div className={`flex items-center justify-between px-4 py-3 ${i !== items.length - 1 ? "border-b border-gray-200" : ""}`}>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label_tr}</p>
                <p className="text-xs text-gray-400">
                  {item.href ?? "dropdown"} · sıra: {item.order} ·{" "}
                  <span className={item.is_active ? "text-green-600" : "text-gray-400"}>
                    {item.is_active ? "Aktif" : "Pasif"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/navbar/new?parent_id=${item.id}`} className="bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 transition-colors">
                  + Alt öğe
                </Link>
                <Link href={`/admin/navbar/${item.id}`} className="bg-yellow-400 px-3 py-1.5 text-sm text-white hover:bg-yellow-500 transition-colors">
                  Düzenle
                </Link>
                <form action={async () => { "use server"; await deleteNavItem(item.id); }}>
                  <button type="submit" className="bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 transition-colors">
                    Sil
                  </button>
                </form>
              </div>
            </div>

            {item.children.map((child) => (
              <div key={child.id} className="flex items-center justify-between border-b border-gray-200 bg-gray-50 py-3 pl-10 pr-4 last:border-0">
                <div>
                  <p className="text-sm text-gray-700">{child.label_tr}</p>
                  <p className="text-xs text-gray-400">{child.href} · sıra: {child.order}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/navbar/${child.id}`} className="bg-yellow-400 px-3 py-1.5 text-sm text-white hover:bg-yellow-500 transition-colors">
                    Düzenle
                  </Link>
                  <form action={async () => { "use server"; await deleteNavItem(child.id); }}>
                    <button type="submit" className="bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 transition-colors">
                      Sil
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}