"use client";

import { useEffect, useState } from "react";
import { ListIcon, XIcon, CaretDownIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useLanguage } from "@/features/Language/LanguageContext";
import { langPath } from "@/features/Language/lang-path";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItemWithChildren = NavItemGetPayload<{ include: { children: true } }>;

export default function MobileDrawer({
  items = [],
  isOpen,
  onToggle,
}: {
  items: NavItemWithChildren[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const { lang, translate } = useLanguage();

  // Menü açıkken arka planın scroll olmasını engelle
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSubMenu = (id: number) => {
    const stringId = String(id);
    setOpenSubMenus((prev) => ({ ...prev, [stringId]: !prev[stringId] }));
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="text-teal-3 dark:text-white transition-transform active:scale-90"
        aria-label="Toggle Menu"
      >
        {isOpen ? <XIcon size={28} /> : <ListIcon size={28} />}
      </button>

      <div
        className={`absolute left-0 top-[calc(100%-1px)] z-100 w-full bg-light-1 dark:bg-dark-2 shadow-xl transition-all duration-500 ease-in-out will-change-[max-height,opacity] ${isOpen
          ? "max-h-[calc(100svh-4rem)] opacity-100 overflow-y-auto"
          : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
          }`}
      >
        <nav className="flex flex-col divide-y divide-light-4 dark:divide-dark-1">
          {items?.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isSubOpen = openSubMenus[String(item.id)];
            const title = translate(item.label_en, item.label_tr);

            return (
              <div key={item.id}>
                {/* Ana item */}
                <div className="flex items-stretch justify-between min-h-12">
                  <Link
                    href={langPath(lang, item.href || "/")}
                    className="flex-1 flex items-center px-6 text-sm font-bold uppercase tracking-wide text-dark-3 dark:text-white active:text-teal-3 dark:active:text-teal-1"
                    onClick={() => !hasChildren && onToggle()}
                  >
                    {title}
                  </Link>

                  {hasChildren && (
                    <button
                      onClick={() => toggleSubMenu(item.id)}
                      className="w-14 flex items-center justify-center border-l border-light-4 dark:border-dark-1 text-teal-3 dark:text-white"
                    >
                      <CaretDownIcon
                        size={16}
                        className={`transition-transform duration-300 ${isSubOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {/* Alt menü */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isSubOpen ? "max-h-150" : "max-h-0"
                    }`}
                >
                  <div className="bg-light-2 dark:bg-dark-3 divide-y divide-light-4 dark:divide-dark-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={langPath(lang, child.href || "/")}
                        className="block py-3.5 px-8 text-sm font-semibold text-dark-2 dark:text-light-3 active:text-teal-3 dark:active:text-teal-1"
                        onClick={() => onToggle()}
                      >
                        {translate(child.label_en, child.label_tr)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
