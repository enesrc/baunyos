"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/features/site-settings/actions";
import type { SiteSettings } from "@/generated/prisma/client";

export default function SiteSettingsForm({
  settings,
}: {
  settings: SiteSettings;
}) {
  const [error, formAction, pending] = useActionState(updateSiteSettings, null);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="id" value={settings.id} />

      <div>
        <label className="mb-1 block text-sm opacity-70">Telefon</label>
        <input
          name="phone"
          defaultValue={settings.phone}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">E-posta</label>
        <input
          type="email"
          name="email"
          defaultValue={settings.email}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">Logo Yazısı (TR)</label>
          <input
            name="logo_text_tr"
            defaultValue={settings.logo_text_tr}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">Logo Yazısı (EN)</label>
          <input
            name="logo_text_en"
            defaultValue={settings.logo_text_en}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {pending === false && error === null && (
        <p className="text-sm text-green-500">Kaydedildi.</p>
      )}

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