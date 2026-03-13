"use client";

import { useActionState, useRef, useState } from "react";
import { createNavItem, updateNavItem } from "@/features/navbar/actions";
import type { NavItem, Page, Media } from "@/generated/prisma/client";
import LinkPicker from "./LinkPicker";

type NavItemWithChildren = NavItem & { children: NavItem[] };

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function NavItemForm({ navItem, topLevelItems, parentId, pages, media }: {
  navItem?: NavItem;
  topLevelItems: NavItemWithChildren[];
  parentId?: number;
  pages: Page[];
  media: Media[];
}) {
  const CURRENT_ID = navItem?.id ?? -1;
  const isDropdownInit = navItem ? !navItem.href && !navItem.parent_id : false;

  const [isDropdown, setIsDropdown] = useState(isDropdownInit);
  const [href, setHref] = useState(navItem?.href ?? "");
  const [selectedParentId, setSelectedParentId] = useState<number | null>(
    navItem?.parent_id ?? parentId ?? null
  );
  const [labelTr, setLabelTr] = useState(navItem?.label_tr ?? "");
  const labelTrRef = useRef<HTMLInputElement>(null);

  const [error, formAction, pending] = useActionState(
    navItem ? updateNavItem : createNavItem,
    null
  );

  // Dropdown olarak kullanılabilecek üst öğeler: href'i olmayan üst seviye öğeler
  const dropdownItems = topLevelItems.filter(t => t.id !== CURRENT_ID && !t.href);

  // Üst seviye kardeşler (mevcut öğe hariç)
  const topLevelSiblings = topLevelItems
    .filter(t => t.id !== CURRENT_ID)
    .sort((a, b) => a.order - b.order)
    .map(t => ({ id: t.id, label: t.label_tr }));

  // Bir parent'ın child'larını getir (mevcut öğe hariç)
  const getChildSiblings = (pid: number) => {
    const parent = topLevelItems.find(t => t.id === pid);
    return (parent?.children ?? [])
      .filter(c => c.id !== CURRENT_ID)
      .sort((a, b) => a.order - b.order)
      .map(c => ({ id: c.id, label: c.label_tr }));
  };

  // Aktif kardeş listesi
  const siblings = selectedParentId && !isDropdown
    ? getChildSiblings(selectedParentId)
    : topLevelSiblings;

  // Pozisyon: öğenin kardeşler arasındaki yeri
  const [position, setPosition] = useState(() => {
    if (!navItem) return siblings.length;
    if (navItem.parent_id) {
      const parent = topLevelItems.find(t => t.id === navItem.parent_id);
      return (parent?.children ?? [])
        .filter(c => c.id !== CURRENT_ID && c.order < navItem.order)
        .length;
    }
    return topLevelItems
      .filter(t => t.id !== CURRENT_ID && t.order < navItem.order)
      .length;
  });

  // Sıra listesinde gösterilecek ad
  const currentLabel = labelTr.trim() || "(Bu öğe)";
  const orderedList = [
    ...siblings.slice(0, position),
    { id: CURRENT_ID, label: currentLabel },
    ...siblings.slice(position),
  ];

  const moveUp = () => setPosition(p => Math.max(0, p - 1));
  const moveDown = () => setPosition(p => Math.min(siblings.length, p + 1));

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {navItem && <input type="hidden" name="id" value={navItem.id} />}

      {/* Tip seçimi */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Tür</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsDropdown(false);
              setHref("");
              setSelectedParentId(null);
              setPosition(topLevelSiblings.length);
            }}
            className={`px-3 py-1.5 text-sm transition-colors ${
              !isDropdown
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Bağlantı
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDropdown(true);
              setHref("");
              setSelectedParentId(null);
              setPosition(topLevelSiblings.length);
            }}
            className={`px-3 py-1.5 text-sm transition-colors ${
              isDropdown
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Açılır Menü
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Ad (Türkçe)</label>
          <input
            ref={labelTrRef}
            name="label_tr"
            defaultValue={navItem?.label_tr}
            onChange={(e) => setLabelTr(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Ad (İngilizce)</label>
          <input name="label_en" defaultValue={navItem?.label_en} className={inputClass} required />
        </div>
      </div>

      {/* Bağlantı modunda: link seçici ve üst menü */}
      {!isDropdown && (
        <>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bağlantı</label>
            <LinkPicker value={href} onChange={setHref} pages={pages} media={media} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Açılır Menü Seçimi</label>
            <select
              name="parent_id"
              value={selectedParentId ?? ""}
              onChange={(e) => {
                const newPid = e.target.value ? Number(e.target.value) : null;
                setSelectedParentId(newPid);
                const newSiblings = newPid ? getChildSiblings(newPid) : topLevelSiblings;
                setPosition(newSiblings.length);
              }}
              className={inputClass}
            >
              <option value="">— Bağımsız (üst seviye) —</option>
              {dropdownItems.map((t) => (
                <option key={t.id} value={t.id}>{t.label_tr}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Açılır menü modunda href boş gönder */}
      {isDropdown && <input type="hidden" name="href" value="" />}

      {/* Sıra */}
      <input type="hidden" name="order" value={position} />
      {orderedList.length > 1 && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sıra</label>
          <div className="flex items-start gap-3">
            <div className="flex-1 border border-gray-200">
              {orderedList.map((item, i) => {
                const isCurrent = item.id === CURRENT_ID;
                return (
                  <div
                    key={item.id}
                    className={`px-3 py-2 text-sm ${
                      i !== orderedList.length - 1 ? "border-b border-gray-200" : ""
                    } ${isCurrent ? "bg-blue-50 font-medium text-blue-700" : "text-gray-600"}`}
                  >
                    {i + 1}. {item.label}
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
