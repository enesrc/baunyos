"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createSlider, updateSlider } from "@/features/slider/actions";
import type { Slider } from "@/generated/prisma/client";

export default function SliderForm({ slider }: { slider?: Slider }) {
  const action = slider ? updateSlider : createSlider;
  const [error, formAction, pending] = useActionState(action, null);
  const [preview, setPreview] = useState<string | null>(
    slider?.image_url ?? null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {slider && <input type="hidden" name="id" value={slider.id} />}

      <div>
        <label className="mb-1 block text-sm opacity-70">
          Görsel {slider && <span className="opacity-50">(değiştirmek için yeni seç)</span>}
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          required={!slider}
        />
        {preview && (
          <div className="relative mt-3 h-48 w-full overflow-hidden rounded-lg">
            <Image
              src={preview}
              alt="Önizleme"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm opacity-70">Başlık (TR)</label>
          <input
            name="title_tr"
            defaultValue={slider?.title_tr}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm opacity-70">Başlık (EN)</label>
          <input
            name="title_en"
            defaultValue={slider?.title_en}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm opacity-70">Sıra</label>
        <input
          type="number"
          name="order"
          defaultValue={slider?.order ?? 0}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={slider?.is_active ?? true}
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