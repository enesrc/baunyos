"use client";

import { useActionState, useState } from "react";
import { createQuickAccessItem, updateQuickAccessItem } from "@/features/quick-access/actions";
import type { QuickAccess, Page, Media } from "@/generated/prisma/client";
import IconPicker from "@/components/ui/icon-picker/IconPicker";
import LinkPicker from "./LinkPicker";

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function QuickAccessForm({ item, allItems, pages, media }: {
  item?: QuickAccess;
  allItems: QuickAccess[];
  pages: Page[];
  media: Media[];
}) {
  const CURRENT_ID = item?.id ?? -1;
  const [href, setHref] = useState(item?.href ?? "");
  const [error, formAction, pending] = useActionState(
    item ? updateQuickAccessItem : createQuickAccessItem,
    null
  );

  // Kardeşler (mevcut öğe hariç)
  const siblings = allItems
    .filter(i => i.id !== CURRENT_ID)
    .sort((a, b) => a.order - b.order)
    .map(i => ({ id: i.id, label: i.title_tr }));

  // Pozisyon
  const [position, setPosition] = useState(() => {
    if (!item) return siblings.length;
    return allItems
      .filter(i => i.id !== CURRENT_ID && i.order < item.order)
      .length;
  });

  const currentLabel = item?.title_tr ?? "(Bu öğe)";
  const orderedList = [
    ...siblings.slice(0, position),
    { id: CURRENT_ID, label: currentLabel },
    ...siblings.slice(position),
  ];

  const moveUp = () => setPosition(p => Math.max(0, p - 1));
  const moveDown = () => setPosition(p => Math.min(siblings.length, p + 1));

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label className="block text-xs text-gray-500 mb-1">İkon</label>
        <IconPicker defaultValue={item?.icon} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (Türkçe)</label>
          <input name="title_tr" defaultValue={item?.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (İngilizce)</label>
          <input name="title_en" defaultValue={item?.title_en} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Açıklama (Türkçe)</label>
          <input name="desc_tr" defaultValue={item?.desc_tr ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Açıklama (İngilizce)</label>
          <input name="desc_en" defaultValue={item?.desc_en ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Link</label>
        <LinkPicker value={href} onChange={setHref} pages={pages} media={media} />
      </div>

      {/* Sıra */}
      <input type="hidden" name="order" value={position} />
      {orderedList.length > 1 && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sıra</label>
          <div className="flex items-start gap-3">
            <div className="flex-1 border border-gray-200">
              {orderedList.map((el, i) => {
                const isCurrent = el.id === CURRENT_ID;
                return (
                  <div
                    key={el.id}
                    className={`px-3 py-2 text-sm ${
                      i !== orderedList.length - 1 ? "border-b border-gray-200" : ""
                    } ${isCurrent ? "bg-blue-50 font-medium text-blue-700" : "text-gray-600"}`}
                  >
                    {i + 1}. {el.label}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <button
                type="button"
                onClick={moveUp}
                disabled={position === 0}
                className="px-2.5 py-1.5 text-xs border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={moveDown}
                disabled={position === siblings.length}
                className="px-2.5 py-1.5 text-xs border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={pending} className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
