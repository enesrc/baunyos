// src/components/layout/Header/MobileDrawer.tsx

"use client";

import { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItemWithChildren = NavItemGetPayload<{ include: { children: true } }>;

export default function MobileDrawer({ items = [] }: { items: NavItemWithChildren[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const { locale } = useI18n();

  const toggleSubMenu = (id: number) => {
    const stringId = String(id);
    setOpenSubMenus((prev) => ({ ...prev, [stringId]: !prev[stringId] }));
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-teal-3 dark:text-white transition-transform active:scale-90"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Yenilikler:
          1. top-[calc(100%-1px)]: 1px yukarı bindirerek o beyaz çizgiyi/boşluğu yok ediyoruz.
          2. will-change-transform: Kaydırma sırasındaki titremeyi önler.
          3. max-h-[1000px]: Geçerli bir Tailwind değeri.
      */}
      <div 
        className={`absolute left-0 top-[calc(100%-1px)] z-100 w-full bg-light-1 dark:bg-dark-2 border-b border-light-4 dark:border-dark-1 shadow-2xl transition-all duration-500 ease-in-out will-change-[max-height,opacity] overflow-hidden ${
          isOpen ? "max-h-250 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col border-t border-light-4 dark:border-dark-1">
          {items?.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isSubOpen = openSubMenus[String(item.id)];
            const title = locale === "tr" ? item.label_tr : item.label_en;

            return (
              <div key={item.id} className="border-b border-light-4/50 dark:border-dark-1/50 last:border-none">
                <div className="flex items-stretch justify-between min-h-12.5">
                  <Link 
                    href={localePath(locale, item.href || "/")}
                    className="flex-1 flex items-center px-6 text-sm font-bold uppercase text-dark-3 dark:text-white active:bg-light-2/50 dark:active:bg-dark-3/50"
                    onClick={() => !hasChildren && setIsOpen(false)}
                  >
                    {title}
                  </Link>
                  
                  {hasChildren && (
                    <button 
                      onClick={() => toggleSubMenu(item.id)}
                      className={`w-14 flex items-center justify-center border-l border-light-4 dark:border-dark-1 transition-colors ${
                        isSubOpen ? "bg-teal-3 text-white" : "text-teal-3"
                      }`}
                    >
                      {isSubOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  )}
                </div>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isSubOpen ? "max-h-96 bg-light-3/30 dark:bg-dark-3/30" : "max-h-0"
                }`}>
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={localePath(locale, child.href || "/")}
                      className="block py-4 px-10 text-xs font-semibold text-dark-2 dark:text-gray-400 border-t border-light-4/30 dark:border-dark-1/30 active:text-teal-3"
                      onClick={() => setIsOpen(false)}
                    >
                      {locale === "tr" ? child.label_tr : child.label_en}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}