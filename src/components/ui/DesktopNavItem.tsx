"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function DesktopNavItem({ item }: { item: NavItem }) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const title = (locale === "tr" ? item.label_tr : item.label_en).toLocaleUpperCase(locale);
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

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  // dropdown olmayan navbar elemanı
  if (!hasChildren) {
    return (
      <Link
        href={item.href ? localePath(locale, item.href) : "#"}
        className="flex items-center px-5 py-4 text-[15px] font-semibold tracking-wide transition-all duration-0 
        text-dark-1 hover:text-teal-3 hover:bg-teal-0/30 
        dark:text-light-2 dark:hover:text-teal-0 dark:hover:bg-teal-4/15"
      >
        {title}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative flex self-stretch" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-5 py-4 text-[15px] font-semibold tracking-wide transition-all duration-0 
        text-dark-1 hover:text-teal-3 hover:bg-teal-0/30
        dark:text-light-2 dark:hover:text-teal-0 dark:hover:bg-teal-4/15 "
      >
        {title}
        <ChevronDown size={14} className={`transition-transform duration-0 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        ref={dropdownRef}
        className={`absolute top-full z-50 transition-all duration-0 ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        style={{ left: 0, minWidth: "100%" }}
      >
        <div className="overflow-hidden rounded-b-md border border-t-0 border-light-4 bg-light-1 shadow-lg shadow-dark-4/5 dark:border-dark-1 dark:bg-dark-3 dark:shadow-dark-4/30">
          <div className="h-0.5 bg-linear-to-r from-teal-3 to-teal-2" />
          {item.children
            .filter((c) => c.is_active)
            .map((child) => (
              <Link
                key={child.id}
                href={child.href ? localePath(locale, child.href) : "#"}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2 px-5 py-3 text-sm transition-all text-dark-1 hover:text-teal-3 hover:bg-light-3
                dark:text-light-2 dark:hover:text-teal-1 dark:hover:bg-dark-2"
              >
                <ChevronRight
                  size={11}
                  className="opacity-0 transition-all duration-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
                <span className="whitespace-nowrap transition-transform duration-0 group-hover:translate-x-0.5">
                  {(locale === "tr" ? child.label_tr : child.label_en).toLocaleUpperCase(locale)}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}