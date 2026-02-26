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

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      {navItem && <input type="hidden" name="id" value={navItem.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">Label (TR)</label>
          <input
            name="label_tr"
            defaultValue={navItem?.label_tr}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">Label (EN)</label>
          <input
            name="label_en"
            defaultValue={navItem?.label_en}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">
          Link <span className="opacity-50">(dropdown ise boş bırak)</span>
        </label>
        <input
          name="href"
          defaultValue={navItem?.href ?? ""}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">Üst Öğe</label>
        <select
          name="parent_id"
          defaultValue={navItem?.parent_id ?? parentId ?? ""}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
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
        <label className="mb-1 block text-sm opacity-70">Sıra</label>
        <input
          type="number"
          name="order"
          defaultValue={navItem?.order ?? 0}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={navItem?.is_active ?? true}
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