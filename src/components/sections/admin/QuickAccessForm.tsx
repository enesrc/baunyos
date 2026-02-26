"use client";

import { useActionState } from "react";
import {
  createQuickAccessItem,
  updateQuickAccessItem,
} from "@/features/quick-access/actions";
import type { QuickAccess } from "@/generated/prisma/client";

const ICONS = [
  "info",
  "tablet",
  "question",
  "book",
  "link",
  "download",
  "home",
  "file",
];

export default function QuickAccessForm({ item }: { item?: QuickAccess }) {
  const action = item ? updateQuickAccessItem : createQuickAccessItem;
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label className="mb-1 block text-sm opacity-70">İkon</label>
        <select
          name="icon"
          defaultValue={item?.icon ?? ""}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="">Seç</option>
          {ICONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">Başlık (TR)</label>
          <input
            name="title_tr"
            defaultValue={item?.title_tr}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">Başlık (EN)</label>
          <input
            name="title_en"
            defaultValue={item?.title_en}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">Açıklama (TR)</label>
          <input
            name="desc_tr"
            defaultValue={item?.desc_tr}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">Açıklama (EN)</label>
          <input
            name="desc_en"
            defaultValue={item?.desc_en}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">Link</label>
        <input
          name="href"
          defaultValue={item?.href}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">Sıra</label>
        <input
          type="number"
          name="order"
          defaultValue={item?.order ?? 0}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={item?.is_active ?? true}
        />
        <label htmlFor="is_active" className="text-sm">
          Aktif
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}