"use client";

import { useActionState, useState } from "react";
import { createQuickAccessItem, updateQuickAccessItem } from "@/features/quick-access/actions";
import type { QuickAccess, Page } from "@/generated/prisma/client";
import IconPicker from "@/components/ui/icon-picker/IconPicker";

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function QuickAccessForm({ item, pages }: { item?: QuickAccess; pages: Page[] }) {
  const [href, setHref] = useState(item?.href ?? "");
  const [error, formAction, pending] = useActionState(
    item ? updateQuickAccessItem : createQuickAccessItem,
    null
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label className="block text-xs text-gray-500 mb-1">İkon</label>
        <IconPicker defaultValue={item?.icon} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (TR)</label>
          <input name="title_tr" defaultValue={item?.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (EN)</label>
          <input name="title_en" defaultValue={item?.title_en} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Açıklama (TR)</label>
          <input name="desc_tr" defaultValue={item?.desc_tr ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Açıklama (EN)</label>
          <input name="desc_en" defaultValue={item?.desc_en ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Link</label>
        <input name="href" value={href} onChange={(e) => setHref(e.target.value)} className={inputClass} required />
      </div>

      {pages.length > 0 && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">veya mevcut sayfadan seç</label>
          <select className={inputClass} onChange={(e) => setHref(e.target.value)} defaultValue="">
            <option value="">— Seç —</option>
            {pages.map((p) => (
              <option key={p.id} value={`/content/${p.id}`}>
                {p.title_tr} (/content/{p.id})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs text-gray-500 mb-1">Sıra</label>
        <input type="number" name="order" defaultValue={item?.order ?? 0} className={inputClass} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_active" id="is_active" defaultChecked={item?.is_active ?? true} className="accent-blue-600" />
        <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={pending} className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}