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
          <label className="mb-1 block text-sm opacity-70">Başlık (TR)</label>
          <input
            name="title_tr"
            defaultValue={page?.title_tr}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">Başlık (EN)</label>
          <input
            name="title_en"
            defaultValue={page?.title_en}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">
          Slug{" "}
          <span className="opacity-50">(örn: basvuru-sureci)</span>
        </label>
        <input
          name="slug"
          defaultValue={page?.slug}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm opacity-70">İçerik (TR)</label>
        <RichTextEditor name="content_tr" defaultValue={page?.content_tr} />
      </div>

      <div>
        <label className="mb-2 block text-sm opacity-70">İçerik (EN)</label>
        <RichTextEditor name="content_en" defaultValue={page?.content_en} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={page?.is_active ?? true}
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