"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadMedia, deleteMedia } from "@/features/media/actions";
import { useRouter } from "next/navigation";
import type { Media } from "@/generated/prisma/client";

type Filter = "all" | "image" | "pdf";

export default function MediaPanel({ initialMedia }: { initialMedia: Media[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = filter === "all"
    ? initialMedia
    : initialMedia.filter((m) => m.type === filter);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    await uploadMedia(fd);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    await deleteMedia(id);
    router.refresh();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload */}
      <div className="flex items-center gap-4">
        <label className="cursor-pointer bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors">
          {uploading ? "Yükleniyor..." : "Dosya Yükle"}
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <span className="text-xs text-gray-400">JPG, PNG, WEBP, GIF, PDF</span>
      </div>

      {/* Filtre */}
      <div className="flex gap-2">
        {([["all", "Tümü"], ["image", "Görseller"], ["pdf", "Dosyalar"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 text-sm transition-colors ${
              filter === key
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">Henüz medya yok.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((m) => (
            <div key={m.id} className="border border-gray-200 flex flex-col">
              {m.type === "image" ? (
                <div className="relative aspect-square bg-gray-100">
                  <Image src={m.url} alt={m.filename} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-gray-100">
                  <span className="text-2xl text-gray-400">PDF</span>
                </div>
              )}
              <div className="p-2 flex flex-col gap-1">
                <p className="text-xs text-gray-700 truncate" title={m.filename}>{m.filename}</p>
                <p className="text-xs text-gray-400">{formatSize(m.size)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(m.url)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    URL Kopyala
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
