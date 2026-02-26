"use client";

import { useActionState } from "react";
import { createAnnouncement, updateAnnouncement } from "@/features/announcements/actions";
import type { Announcement } from "@/generated/prisma/client";

export default function AnnouncementForm({
  announcement,
}: {
  announcement?: Announcement;
}) {
  const action = announcement ? updateAnnouncement : createAnnouncement;
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {announcement && (
        <input type="hidden" name="id" value={announcement.id} />
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">Başlık (TR)</label>
          <input
            name="title_tr"
            defaultValue={announcement?.title_tr}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">Başlık (EN)</label>
          <input
            name="title_en"
            defaultValue={announcement?.title_en}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">İçerik (TR)</label>
        <textarea
          name="content_tr"
          defaultValue={announcement?.content_tr}
          rows={6}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">İçerik (EN)</label>
        <textarea
          name="content_en"
          defaultValue={announcement?.content_en}
          rows={6}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={announcement?.is_active ?? true}
        />
        <label htmlFor="is_active" className="text-sm">
          Aktif
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}