"use client";

import { useActionState } from "react";
import { createNavItem, updateNavItem } from "@/features/navbar/actions";
import type { NavItem } from "@/generated/prisma/client";

type NavItemWithChildren = NavItem & { children: NavItem[] };

export default function NavItemForm({
  navItem,
  topLevelItems,
  parentId,
}: {
  navItem?: NavItem;
  topLevelItems: NavItemWithChildren[];
  parentId?: number;
}) {
  const action = navItem ? updateNavItem : createNavItem;
  const [error, formAction, pending] = useActionState(action, null);

  const inputClass =
    "w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2";

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      {navItem && <input type="hidden" name="id" value={navItem.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Label (TR)</label>
          <input name="label_tr" defaultValue={navItem?.label_tr} className={inputClass} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Label (EN)</label>
          <input name="label_en" defaultValue={navItem?.label_en} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">
          Link <span className="text-gray-2 dark:text-gray-3">(dropdown ise boş bırak)</span>
        </label>
        <input name="href" defaultValue={navItem?.href ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Üst Öğe</label>
        <select
          name="parent_id"
          defaultValue={navItem?.parent_id ?? parentId ?? ""}
          className={inputClass}
        >
          <option value="">— Yok (üst seviye) —</option>
          {topLevelItems
            .filter((t) => t.id !== navItem?.id)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.label_tr}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Sıra</label>
        <input type="number" name="order" defaultValue={navItem?.order ?? 0} className={inputClass} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={navItem?.is_active ?? true}
          className="accent-teal-3"
        />
        <label htmlFor="is_active" className="text-sm text-dark-3 dark:text-light-1">
          Aktif
        </label>
      </div>

      {error && <p className="text-sm text-red-3 dark:text-red-2">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 transition-colors hover:bg-teal-4 disabled:opacity-60 dark:bg-teal-2 dark:hover:bg-teal-3"
      >
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}