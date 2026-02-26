import Link from "next/link";
import { getNavItems } from "@/features/navbar/queries";
import { deleteNavItem } from "@/features/navbar/actions";

export default async function NavbarPage() {
  const items = await getNavItems();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Navbar</h1>
        <Link
          href="/admin/navbar/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Yeni Öğe
        </Link>
      </div>

      <div className="rounded-xl border border-border">
        {items.length === 0 && (
          <p className="p-6 text-sm opacity-50">Henüz navbar öğesi yok.</p>
        )}
        {items.map((item, i) => (
          <div key={item.id}>
            <div
              className={`flex items-center justify-between px-6 py-4 ${
                i !== items.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium">{item.label_tr}</p>
                <p className="text-xs opacity-50">
                  {item.href ?? "dropdown"} • sıra: {item.order} •{" "}
                  {item.is_active ? "Aktif" : "Pasif"}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/navbar/new?parent_id=${item.id}`}
                  className="text-sm opacity-50 hover:opacity-100"
                >
                  + Alt öğe
                </Link>
                <Link
                  href={`/admin/navbar/${item.id}`}
                  className="text-sm opacity-70 hover:opacity-100"
                >
                  Düzenle
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteNavItem(item.id);
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

            {item.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between border-b border-border bg-surface1/50 py-3 pl-12 pr-6 last:border-0"
              >
                <div>
                  <p className="text-sm">{child.label_tr}</p>
                  <p className="text-xs opacity-50">
                    {child.href} • sıra: {child.order}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/navbar/${child.id}`}
                    className="text-sm opacity-70 hover:opacity-100"
                  >
                    Düzenle
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteNavItem(child.id);
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
        ))}
      </div>
    </div>
  );
}