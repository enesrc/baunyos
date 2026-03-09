"use client";

import { useActionState } from "react";
import { createNavItem, updateNavItem } from "@/features/navbar/actions";
import type { NavItem } from "@/generated/prisma/client";

type NavItemWithChildren = NavItem & { children: NavItem[] };

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function NavItemForm({ navItem, topLevelItems, parentId }: {
  navItem?: NavItem;
  topLevelItems: NavItemWithChildren[];
  parentId?: number;
}) {
  const [error, formAction, pending] = useActionState(
    navItem ? updateNavItem : createNavItem,
    null
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {navItem && <input type="hidden" name="id" value={navItem.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Label (TR)</label>
          <input name="label_tr" defaultValue={navItem?.label_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Label (EN)</label>
          <input name="label_en" defaultValue={navItem?.label_en} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Link (dropdown ise boş bırak)</label>
        <input name="href" defaultValue={navItem?.href ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Üst Öğe</label>
        <select name="parent_id" defaultValue={navItem?.parent_id ?? parentId ?? ""} className={inputClass}>
          <option value="">— Yok (üst seviye) —</option>
          {topLevelItems.filter((t) => t.id !== navItem?.id).map((t) => (
            <option key={t.id} value={t.id}>{t.label_tr}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Sıra</label>
        <input type="number" name="order" defaultValue={navItem?.order ?? 0} className={inputClass} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_active" id="is_active" defaultChecked={navItem?.is_active ?? true} className="accent-blue-600" />
        <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={pending} className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}