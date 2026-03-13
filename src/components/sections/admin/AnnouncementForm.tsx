"use client";

import { useActionState } from "react";
import { createAnnouncement, updateAnnouncement } from "@/features/announcements/actions";
import type { Announcement } from "@/generated/prisma/client";

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
  const [error, formAction, pending] = useActionState(
    announcement ? updateAnnouncement : createAnnouncement,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {announcement && <input type="hidden" name="id" value={announcement.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (Türkçe)</label>
          <input name="title_tr" defaultValue={announcement?.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (İngilizce)</label>
          <input name="title_en" defaultValue={announcement?.title_en} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">İçerik (Türkçe)</label>
        <textarea name="content_tr" defaultValue={announcement?.content_tr} rows={5} className={inputClass} required />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">İçerik (İngilizce)</label>
        <textarea name="content_en" defaultValue={announcement?.content_en} rows={5} className={inputClass} required />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={pending} className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}