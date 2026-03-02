"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/features/site-settings/actions";
import type { SiteSettings } from "@/generated/prisma/client";

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [error, formAction, pending] = useActionState(updateSiteSettings, null);

  const inputClass =
    "w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2";

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="id" value={settings.id} />

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Telefon</label>
        <input name="phone" defaultValue={settings.phone} className={inputClass} required />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">E-posta</label>
        <input type="email" name="email" defaultValue={settings.email} className={inputClass} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Logo Yazısı (TR)</label>
          <input name="logo_text_tr" defaultValue={settings.logo_text_tr} className={inputClass} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Logo Yazısı (EN)</label>
          <input name="logo_text_en" defaultValue={settings.logo_text_en} className={inputClass} required />
        </div>
      </div>

      {error && <p className="text-sm text-red-3 dark:text-red-2">{error}</p>}

      {pending === false && error === null && (
        <p className="text-sm text-green-3 dark:text-green-2">Kaydedildi.</p>
      )}

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