"use client";

import { useState, useRef, useEffect } from "react";
import { XIcon } from "@phosphor-icons/react/ssr";
import { ICON_ENTRIES, ICON_MAP } from "@/components/ui/icon-picker/icon-map";

interface IconPickerProps {
  defaultValue?: string | null;
}

export default function IconPicker({ defaultValue }: IconPickerProps) {
  const [selected, setSelected] = useState<string>(defaultValue ?? "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ICON_ENTRIES.filter(
        ([key, , tr]) => key.includes(q) || tr.some((t) => t.includes(q))
      ).map(([key]) => key)
    : ICON_ENTRIES.map(([key]) => key);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const SelectedIcon = selected ? ICON_MAP[selected] : null;

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name="icon" value={selected} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 border border-light-4 bg-light-1 px-3 py-2 text-xs text-gray-500 outline-none transition-colors"
      >
        <span className="flex h-6 w-6 items-center justify-center">
          {SelectedIcon
            ? <SelectedIcon size={14} />
            : <span className="text-xs text-gray-3">?</span>}
        </span>
        <span className="flex-1 text-left">
          {selected || <span className="text-gray-500">İkon seç…</span>}
        </span>
        {selected && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); setSelected(""); }}
            className="p-0.5 text-gray-3 hover:text-dark-3"
          >
            <XIcon size={13} />
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full border border-light-4 bg-light-1 shadow-lg">
          <div className="border-b border-light-4 p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ara: kütüphane, sınav, başvuru…"
              className="w-full bg-light-2 px-2 py-1.5 text-sm text-dark-3 outline-none placeholder:text-gray-3"
            />
          </div>

          <div className="grid max-h-80 grid-cols-16 gap-1 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="col-span-8 py-3 text-center text-xs text-gray-3">
                Sonuç yok.
              </p>
            )}
            {filtered.map((name) => {
              const Icon = ICON_MAP[name];
              const isActive = selected === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => { setSelected(name); setOpen(false); setQuery(""); }}
                  className={`flex aspect-square items-center justify-center transition-colors ${
                    isActive
                      ? "bg-teal-3 text-white"
                      : "text-dark-3 hover:bg-light-3"
                  }`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          <div className="border-t border-light-4 px-3 py-1.5">
            <p className="text-xs text-gray-3">
              {filtered.length}/{ICON_ENTRIES.length} ikon{q ? " bulundu" : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}