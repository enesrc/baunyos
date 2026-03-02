"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createSlider, updateSlider } from "@/features/slider/actions";
import type { Slider } from "@/generated/prisma/client";

export default function SliderForm({ slider }: { slider?: Slider }) {
  const action = slider ? updateSlider : createSlider;
  const [error, formAction, pending] = useActionState(action, null);
  const [preview, setPreview] = useState<string | null>(slider?.image_url ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const inputClass =
    "w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2";

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {slider && <input type="hidden" name="id" value={slider.id} />}

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">
          Görsel{" "}
          {slider && <span className="text-gray-2 dark:text-gray-3">(değiştirmek için yeni seç)</span>}
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className={inputClass}
          required={!slider}
        />
        {preview && (
          <div className="relative mt-3 h-48 w-full overflow-hidden rounded-md border border-light-4 dark:border-dark-1">
            <Image src={preview} alt="Önizleme" fill className="object-cover" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (TR)</label>
          <input name="title_tr" defaultValue={slider?.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Başlık (EN)</label>
          <input name="title_en" defaultValue={slider?.title_en} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Sıra</label>
        <input type="number" name="order" defaultValue={slider?.order ?? 0} className={inputClass} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={slider?.is_active ?? true}
          className="accent-teal-3"
        />
        <label htmlFor="is_active" className="text-sm text-dark-3 dark:text-light-1">Aktif</label>
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