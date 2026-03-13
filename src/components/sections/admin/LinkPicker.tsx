"use client";

import { useState } from "react";
import Image from "next/image";
import type { Page, Media } from "@/generated/prisma/client";

type Tab = "page" | "image" | "pdf" | "external";

const tabs: { key: Tab; label: string }[] = [
  { key: "page", label: "Sayfa" },
  { key: "image", label: "Görsel" },
  { key: "pdf", label: "Dosya" },
  { key: "external", label: "Bağlantı" },
];

export default function LinkPicker({
  value,
  onChange,
  pages,
  media,
}: {
  value: string;
  onChange: (href: string) => void;
  pages: Page[];
  media: Media[];
}) {
  const images = media.filter((m) => m.type === "image");
  const pdfs = media.filter((m) => m.type === "pdf");

  const detectTab = (): Tab => {
    if (!value) return "page";
    if (value.startsWith("/content/")) return "page";
    if (media.some((m) => m.url === value && m.type === "image")) return "image";
    if (media.some((m) => m.url === value && m.type === "pdf")) return "pdf";
    if (value.startsWith("/uploads/")) {
      const ext = value.split(".").pop()?.toLowerCase() ?? "";
      if (ext === "pdf") return "pdf";
      return "image";
    }
    if (value) return "external";
    return "page";
  };

  const [activeTab, setActiveTab] = useState<Tab>(detectTab);

  const getSelectedInfo = (): { type: string; name: string; path: string } | null => {
    if (!value) return null;

    if (value.startsWith("/content/")) {
      const pageId = Number(value.replace("/content/", ""));
      const page = pages.find((p) => p.id === pageId);
      return { type: "Sayfa", name: page?.title_tr ?? "—", path: value };
    }

    const matchedMedia = media.find((m) => m.url === value);
    if (matchedMedia) {
      if (matchedMedia.type === "image") {
        return { type: "Görsel", name: matchedMedia.filename, path: matchedMedia.url };
      }
      return { type: "Dosya", name: matchedMedia.filename, path: matchedMedia.url };
    }

    if (value.startsWith("/uploads/")) {
      const filename = value.split("/").pop() ?? value;
      const ext = filename.split(".").pop()?.toLowerCase() ?? "";
      return { type: ext === "pdf" ? "Dosya" : "Görsel", name: filename, path: value };
    }

    return { type: "Bağlantı", name: "—", path: value };
  };

  const info = getSelectedInfo();

  const handleSelect = (href: string) => {
    onChange(href);
  };

  const clearSelection = () => {
    onChange("");
  };

  return (
    <div className="flex flex-col">
      <input type="hidden" name="href" value={value} />

      {/* Seçili öğe çubuğu — her zaman görünür */}
      <div className="flex w-full items-center border border-gray-300 text-sm mb-0 min-h-9.5">
        {info ? (
          <>
            <span className="shrink-0 border-r border-gray-300 bg-gray-100 px-3 py-2 text-gray-500">
              {info.type}
            </span>
            <span className="truncate border-r border-gray-300 px-3 py-2 text-gray-700">
              {info.name}
            </span>
            <a
              href={info.path}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate px-3 py-2 text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {info.path}
            </a>
            <button
              type="button"
              onClick={clearSelection}
              className="ml-auto shrink-0 px-2.5 py-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Seçimi kaldır"
            >
              ✕
            </button>
          </>
        ) : (
          <span className="px-3 py-2 text-gray-400 text-xs">Seçili öğe yok</span>
        )}
      </div>

      {/* Sekmeler */}
      <div className="border border-gray-300 border-t-0">
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs transition-colors ${
                activeTab === tab.key
                  ? "text-blue-600 bg-white border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sekme içeriği */}
        <div className="p-3">
          {activeTab === "page" && (
            <div className="flex flex-col max-h-48 overflow-y-auto border border-gray-200 divide-y divide-gray-200">
              {pages.length === 0 ? (
                <p className="text-xs text-gray-400 p-3">Henüz sayfa yok.</p>
              ) : (
                pages.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/content/${p.id}`)}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
                      value === `/content/${p.id}` ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="truncate">{p.title_tr}</span>
                    <a
                      href={`/content/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 ml-2 text-xs text-blue-500 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Aç ↗
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "image" && (
            <div className="flex flex-col max-h-56 overflow-y-auto border border-gray-200 divide-y divide-gray-200">
              {images.length === 0 ? (
                <p className="text-xs text-gray-400 p-3">Yüklü görsel yok. Medya sayfasından yükleyebilirsiniz.</p>
              ) : (
                images.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelect(m.url)}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                      value === m.url ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative shrink-0 w-10 h-10 border border-gray-200 overflow-hidden">
                      <Image src={m.url} alt={m.filename} fill className="object-cover" />
                    </div>
                    <span className="truncate text-sm text-gray-700">{m.filename}</span>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 ml-auto text-xs text-blue-500 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Aç ↗
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "pdf" && (
            <div className="flex flex-col max-h-48 overflow-y-auto border border-gray-200 divide-y divide-gray-200">
              {pdfs.length === 0 ? (
                <p className="text-xs text-gray-400 p-3">Yüklü dosya yok. Medya sayfasından yükleyebilirsiniz.</p>
              ) : (
                pdfs.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelect(m.url)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                      value === m.url ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-gray-400 text-xs shrink-0">PDF</span>
                    <span className="truncate text-gray-700">{m.filename}</span>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 ml-auto text-xs text-blue-500 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Aç ↗
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "external" && (
            <input
              type="url"
              placeholder="https://ornek.com"
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors"
              defaultValue={detectTab() === "external" ? value : ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSelect((e.target as HTMLInputElement).value);
                }
              }}
              onBlur={(e) => {
                if (e.target.value) handleSelect(e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
