"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import { useLanguage } from "@/features/Language/LanguageContext";
import { langPath } from "@/lib/langPath";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";
import { Lang } from "@/features/Language/config";

// Tip Tanımlamaları
type NavItem = NavItemGetPayload<{ include: { children: true } }>;
type NavChild = NavItem["children"][number]; // NavItem içindeki çocukların tipi

interface ChildLinkProps {
  child: NavChild;
  lang: Lang;
  translate: (en: string, tr: string) => string;
  onClose: () => void;
}

const STYLES = {
  navItem: "flex items-center px-5 py-4 text-[15px] transition-all border",
  simpleLink: "font-semibold tracking-wide text-dark-1 hover:text-cyan-deep hover:bg-light-2 dark:text-light-4 dark:hover:text-white dark:hover:bg-dark-4 border-transparent",
  buttonActive: "text-cyan-deep bg-light-1 border-cyan-dull border-b-transparent rounded-t-none z-[51] dark:text-white dark:bg-dark-5 dark:border-dark-1",
  buttonInactive: "text-dark-1 border-transparent dark:text-light-4 hover:text-cyan-deep hover:bg-light-2 dark:hover:text-white dark:hover:bg-dark-4",
  dropdownLink: "group flex items-center gap-2 px-5 py-3 text-sm transition-colors text-dark-1 hover:text-teal-3 hover:bg-teal-0/30 dark:text-light-2 dark:hover:text-teal-1 dark:hover:bg-teal-4/20"
};

export default function DesktopNavItem({ item }: { item: NavItem }) {
  const { lang, translate } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = translate(item.label_en, item.label_tr).toLocaleUpperCase(lang);
  const hasChildren = item.children.length > 0 && !item.href;

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open || !dropdownRef.current) return;
    const dd = dropdownRef.current;
    dd.style.left = "0px";
    const overflow = dd.getBoundingClientRect().right - window.innerWidth + 8;
    if (overflow > 0) dd.style.left = `${-overflow}px`;
  }, [open]);

  if (!hasChildren) {
    return (
      <Link href={item.href ? langPath(lang, item.href) : "#"} className={`${STYLES.navItem} ${STYLES.simpleLink}`}>
        {title}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex self-stretch"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`${STYLES.navItem} font-medium tracking-wide ${open ? STYLES.buttonActive : STYLES.buttonInactive}`}
      >
        {title}
        <CaretDownIcon size={17} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        ref={dropdownRef}
        className={`absolute top-full z-50 transition-all duration-150 -mt-px 
          ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
        style={{ left: 0, minWidth: "100%" }}
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

function ChildLink({ child, lang, translate, onClose }: ChildLinkProps) {
  return (
    <Link
      href={child.href ? langPath(lang, child.href) : "#"}
      onClick={onClose}
      className={STYLES.dropdownLink}
    >
      <CaretRightIcon
        size={11}
        className="opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 text-teal-3 dark:text-teal-1"
      />
      <span className="whitespace-nowrap transition-transform duration-150 group-hover:translate-x-0.5">
        {translate(child.label_en, child.label_tr).toLocaleUpperCase(lang)}
      </span>
    </Link>
  );
}