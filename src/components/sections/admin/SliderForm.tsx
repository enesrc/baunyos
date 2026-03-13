"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createSlider, updateSlider } from "@/features/slider/actions";
import type { Slider } from "@/generated/prisma/client";

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function SliderForm({ slider }: { slider?: Slider }) {
  const action = slider ? updateSlider : createSlider;
  const [error, formAction, pending] = useActionState(action, null);
  const [preview, setPreview] = useState<string | null>(slider?.image_url ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {slider && <input type="hidden" name="id" value={slider.id} />}

      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Görsel {slider && <span className="text-gray-400">(değiştirmek için yeni seç)</span>}
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
          <div className="relative mt-3 w-full overflow-hidden border border-gray-200" style={{ aspectRatio: "1905/720" }}>
            <Image src={preview} alt="Önizleme" fill className="object-contain" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (Türkçe)</label>
          <input name="title_tr" defaultValue={slider?.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (İngilizce)</label>
          <input name="title_en" defaultValue={slider?.title_en} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Sıra</label>
        <input type="number" name="order" defaultValue={slider?.order ?? 0} className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}