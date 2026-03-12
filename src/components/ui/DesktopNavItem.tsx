"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import { useLanguage } from "@/features/Language/LanguageContext";
import { langPath } from "@/features/Language/lang-path";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";
import { Lang } from "@/features/Language/config";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;
type NavChild = NavItem["children"][number];

interface ChildLinkProps {
  child: NavChild;
  lang: Lang;
  translate: (en: string, tr: string) => string;
  onClose: () => void;
}
const STYLES = {
  // basit nav link ve kapalı dropdown butonu
  base:
    "flex items-center gap-1 px-5 py-4 text-sm font-semibold tracking-wide border border-transparent transition-all " +
    "text-dark-1 dark:text-light-4 " +
    "hover:text-cyan-deep hover:bg-light-1 hover:border-cyan-dull " +
    "dark:hover:text-white dark:hover:bg-dark-5 dark:hover:border-dark-1",

  // Açık dropdown butonu
  active:
    "flex items-center gap-1 px-5 py-4 text-sm font-semibold tracking-wide border transition-all " +
    "text-cyan-deep bg-light-1 border-cyan-dull border-b-transparent rounded-t-none z-[51] " +
    "dark:text-white dark:bg-dark-5 dark:border-dark-1 dark:border-b-transparent",

  // Dropdown içindeki linkler
  dropdownItem:
    "group flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors " +
    "text-dark-1 hover:text-cyan-deep dark:text-light-4 dark:hover:text-white"
};

export default function DesktopNavItem({ item }: { item: NavItem }) {
  const { lang, translate } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const title = translate(item.label_en, item.label_tr).toLocaleUpperCase(lang);
  const hasChildren = item.children.length > 0 && !item.href;

  // Dışarı tıklayınca menüyü kapatma
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ALT MENÜSÜ OLMAYAN DÜZ LİNKLER
  if (!hasChildren) {
    return (
      <Link href={item.href ? langPath(lang, item.href) : "#"} className={`${STYLES.base}`}>
        {title}
      </Link>
    );
  }
  // ALT MENÜSÜ OLAN DROPDOWN BUTONLAR
  else {
    return (
      <div
        ref={ref}
        className="relative flex self-stretch"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className={open ? STYLES.active : STYLES.base}
        >
          {title}
          <CaretDownIcon size={17} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        <div
          className={`absolute top-full left-0 min-w-full z-50 transition-all duration-100 -mt-px ${open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
            }`}
        >
          <div className="overflow-hidden rounded-b-md border border-cyan-dull bg-light-1 shadow-lg dark:border-dark-1 dark:bg-dark-5">
            {item.children
              .filter((c) => c.is_active)
              .map((child) => (
                <ChildLink
                  key={child.id}
                  child={child}
                  lang={lang}
                  translate={translate}
                  onClose={() => setOpen(false)}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

function ChildLink({ child, lang, translate, onClose }: ChildLinkProps) {
  return (
    <Link
      href={child.href ? langPath(lang, child.href) : "#"}
      onClick={onClose}
      className={STYLES.dropdownItem}
    >
      <CaretRightIcon
        className="opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
      />
      <span className="whitespace-nowrap transition-transform duration-150 group-hover:translate-x-0.5">
        {translate(child.label_en, child.label_tr).toLocaleUpperCase(lang)}
      </span>
    </Link>
  );
}