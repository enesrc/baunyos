"use client";

import { useActionState } from "react";
import { createPage, updatePage } from "@/features/content-pages/actions";
import RichTextEditor from "@/components/sections/admin/rich-text-editor/RichTextEditor";
import type { Page } from "@/generated/prisma/client";

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function ContentPageForm({ page }: { page?: Page }) {
  const [error, formAction, pending] = useActionState(
    page ? updatePage : createPage,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {page && <input type="hidden" name="id" value={page.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (TR)</label>
          <input name="title_tr" defaultValue={page?.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (EN)</label>
          <input name="title_en" defaultValue={page?.title_en} className={inputClass} required />
        </div>
      </div>

      {page && (
        <p className="text-xs text-gray-400">Sayfa URL: /content/{page.id}</p>
      )}

      <div>
        <label className="block text-xs text-gray-500 mb-1">İçerik (TR)</label>
        <RichTextEditor name="content_tr" defaultValue={page?.content_tr} />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">İçerik (EN)</label>
        <RichTextEditor name="content_en" defaultValue={page?.content_en} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_active" id="is_active" defaultChecked={page?.is_active ?? true} className="accent-blue-600" />
        <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={pending} className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}