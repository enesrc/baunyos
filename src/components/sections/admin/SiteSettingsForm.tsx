"use client";

import { useActionState, useState } from "react";
import { updateSiteSettings } from "@/features/site-settings/actions";
import type { SiteSettings } from "@/generated/prisma/client";

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, formAction, pending] = useActionState(updateSiteSettings, null);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={settings.id} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Header Başlık (Türkçe)</label>
          <input name="header_title_tr" defaultValue={settings.header_title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Header Başlık (İngilizce)</label>
          <input name="header_title_en" defaultValue={settings.header_title_en} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Footer Başlık (Türkçe)</label>
          <input name="footer_title_tr" defaultValue={settings.footer_title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Footer Başlık (İngilizce)</label>
          <input name="footer_title_en" defaultValue={settings.footer_title_en} className={inputClass} required />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {submitted && !pending && !error && (
        <p className="text-sm text-green-600">Kaydedildi.</p>
      )}

      <button type="submit" disabled={pending} className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}