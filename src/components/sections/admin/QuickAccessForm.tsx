"use client";

import { useActionState } from "react";
import { createQuickAccessItem, updateQuickAccessItem } from "@/features/quick-access/actions";
import type { QuickAccess } from "@/generated/prisma/client";

const ICONS = ["info", "tablet", "question", "book", "link", "download", "home", "file"];

export default function QuickAccessForm({ item }: { item?: QuickAccess }) {
  const action = item ? updateQuickAccessItem : createQuickAccessItem;
  const [error, formAction, pending] = useActionState(action, null);

  const inputClass =
    "w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2";

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">İkon</label>
        <select name="icon" defaultValue={item?.icon ?? ""} className={inputClass}>
          <option value="">Seç</option>
          {ICONS.map((icon) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (TR)</label>
          <input name="title_tr" defaultValue={item?.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (EN)</label>
          <input name="title_en" defaultValue={item?.title_en} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Açıklama (TR)</label>
          <input name="desc_tr" defaultValue={item?.desc_tr} className={inputClass} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Açıklama (EN)</label>
          <input name="desc_en" defaultValue={item?.desc_en} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Link</label>
        <input name="href" defaultValue={item?.href} className={inputClass} required />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Sıra</label>
        <input type="number" name="order" defaultValue={item?.order ?? 0} className={inputClass} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={item?.is_active ?? true}
          className="accent-teal-3"
        />
        <label htmlFor="is_active" className="text-sm text-dark-3 dark:text-light-1">Aktif</label>
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