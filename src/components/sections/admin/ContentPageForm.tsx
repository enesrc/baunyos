"use client";

import { useActionState } from "react";
import { createPage, updatePage } from "@/features/content-pages/actions";
import RichTextEditor from "@/components/sections/admin/rich-text-editor/RichTextEditor";
import type { Page } from "@/generated/prisma/client";

export default function ContentPageForm({ page }: { page?: Page }) {
  const action = page ? updatePage : createPage;
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {page && <input type="hidden" name="id" value={page.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (TR)</label>
          <input
            name="title_tr"
            defaultValue={page?.title_tr}
            className="w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (EN)</label>
          <input
            name="title_en"
            defaultValue={page?.title_en}
            className="w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">
          Slug <span className="text-gray-2 dark:text-gray-3">(örn: basvuru-sureci)</span>
        </label>
        <input
          name="slug"
          defaultValue={page?.slug}
          className="w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-3 dark:text-gray-2">İçerik (TR)</label>
        <RichTextEditor name="content_tr" defaultValue={page?.content_tr} />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-3 dark:text-gray-2">İçerik (EN)</label>
        <RichTextEditor name="content_en" defaultValue={page?.content_en} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={page?.is_active ?? true}
          className="accent-teal-3"
        />
        <label htmlFor="is_active" className="text-sm text-dark-3 dark:text-light-1">
          Aktif
        </label>
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