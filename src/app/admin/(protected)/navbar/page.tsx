import Link from "next/link";
import { getNavItems } from "@/features/navbar/queries";
import { deleteNavItem } from "@/features/navbar/actions";

export default async function NavbarPage() {
  const items = await getNavItems();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-3 dark:text-light-1">Navbar</h1>
        <Link
          href="/admin/navbar/new"
          className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 transition-colors hover:bg-teal-4 dark:bg-teal-2 dark:hover:bg-teal-3"
        >
          Yeni Öğe
        </Link>
      </div>

      <div className="rounded-md border border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-3">
        {items.length === 0 && (
          <p className="p-6 text-sm text-gray-3 dark:text-gray-2">Henüz navbar öğesi yok.</p>
        )}
        {items.map((item, i) => (
          <div key={item.id}>
            <div
              className={`flex items-center justify-between px-6 py-4 ${
                i !== items.length - 1 ? "border-b border-light-4 dark:border-dark-1" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-dark-3 dark:text-light-1">{item.label_tr}</p>
                <p className="text-xs text-gray-3 dark:text-gray-2">
                  {item.href ?? "dropdown"} • sıra: {item.order} •{" "}
                  <span className={item.is_active ? "text-green-3 dark:text-green-2" : "text-gray-3"}>
                    {item.is_active ? "Aktif" : "Pasif"}
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/navbar/new?parent_id=${item.id}`}
                  className="text-sm text-gray-3 transition-colors hover:text-teal-3 dark:text-gray-2 dark:hover:text-teal-2"
                >
                  + Alt öğe
                </Link>
                <Link
                  href={`/admin/navbar/${item.id}`}
                  className="text-sm text-teal-3 transition-colors hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1"
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
                    className="text-sm text-red-3 transition-colors hover:text-red-4 dark:text-red-2 dark:hover:text-red-3"
                  >
                    Sil
                  </button>
                </form>
              </div>
            </div>

            {item.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between border-b border-light-4 bg-light-2 py-3 pl-12 pr-6 last:border-0 dark:border-dark-1 dark:bg-dark-4"
              >
                <div>
                  <p className="text-sm text-dark-3 dark:text-light-1">{child.label_tr}</p>
                  <p className="text-xs text-gray-3 dark:text-gray-2">
                    {child.href} • sıra: {child.order}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/navbar/${child.id}`}
                    className="text-sm text-teal-3 transition-colors hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1"
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
                      className="text-sm text-red-3 transition-colors hover:text-red-4 dark:text-red-2 dark:hover:text-red-3"
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