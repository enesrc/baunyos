"use client";

import { useActionState } from "react";
import { createAnnouncement, updateAnnouncement } from "@/features/announcements/actions";
import type { Announcement } from "@/generated/prisma/client";

export default function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
  const action = announcement ? updateAnnouncement : createAnnouncement;
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {announcement && <input type="hidden" name="id" value={announcement.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (TR)</label>
          <input
            name="title_tr"
            defaultValue={announcement?.title_tr}
            className="w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (EN)</label>
          <input
            name="title_en"
            defaultValue={announcement?.title_en}
            className="w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">İçerik (TR)</label>
        <textarea
          name="content_tr"
          defaultValue={announcement?.content_tr}
          rows={6}
          className="w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">İçerik (EN)</label>
        <textarea
          name="content_en"
          defaultValue={announcement?.content_en}
          rows={6}
          className="w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={announcement?.is_active ?? true}
          className="accent-teal-3"
        />
        <label htmlFor="is_active" className="text-sm text-dark-3 dark:text-light-1">Aktif</label>
      </div>

      {error && <p className="text-sm text-red-3 dark:text-red-2">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 transition-colors hover:bg-teal-4 disabled:opacity-60 dark:bg-teal-2 dark:hover:bg-teal-3"
        >
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}