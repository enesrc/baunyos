"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

function DropdownItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const title = (locale === "tr" ? item.label_tr : item.label_en).toLocaleUpperCase(locale);
  const isDropdown = item.children.length > 0 && !item.href;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (isDropdown) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors ${
            isActive
              ? "text-teal-3 dark:text-teal-2"
              : "text-gray-3 hover:text-dark-3 dark:text-gray-2 dark:hover:text-light-1"
          }`}
        >
          {title}
          <ChevronDown
            size={11}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 min-w-52 rounded-xl border border-light-4 bg-light-1 py-1 shadow-lg dark:border-dark-1 dark:bg-dark-3">
            {item.children
              .filter((c) => c.is_active)
              .map((child) => (
                <Link
                  key={child.id}
                  href={child.href ? localePath(locale, child.href) : "#"}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-3 transition-colors hover:bg-light-2 hover:text-teal-3 dark:text-gray-2 dark:hover:bg-dark-2 dark:hover:text-teal-2"
                >
                  {(locale === "tr" ? child.label_tr : child.label_en).toLocaleUpperCase(locale)}
                </Link>
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href ? localePath(locale, item.href) : "#"}
      className={`py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-teal-3 dark:text-teal-2"
          : "text-gray-3 hover:text-dark-3 dark:text-gray-2 dark:hover:text-light-1"
      }`}
    >
      {title}
    </Link>
  );
}

export default function NavMenu({ items }: { items: NavItem[] }) {
  const { locale } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const activeItems = items.filter((i) => i.is_active);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-5 md:flex">
        {activeItems.map((item) => {
          const href = item.href ? localePath(locale, item.href) : null;
          const isActive = href ? pathname.startsWith(href) : false;
          return <DropdownItem key={item.id} item={item} isActive={isActive} />;
        })}
      </nav>

      {/* Hamburger */}
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-light-4 text-gray-3 dark:border-dark-1 dark:text-gray-2 md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Menü"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobil drawer */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-light-4 bg-light-1 shadow-lg dark:border-dark-1 dark:bg-dark-3 md:hidden">
          {activeItems.map((item) => {
            const title = locale === "tr" ? item.label_tr : item.label_en;
            const activeChildren = item.children.filter((c) => c.is_active);

            return (
              <div key={item.id} className="border-b border-light-3 last:border-0 dark:border-dark-2">
                {item.href ? (
                  <Link
                    href={localePath(locale, item.href)}
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-3.5 text-sm font-medium text-dark-1 transition-colors hover:bg-light-2 hover:text-teal-3 dark:text-light-3 dark:hover:bg-dark-2 dark:hover:text-teal-2"
                  >
                    {title}
                  </Link>
                ) : (
                  <div className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-gray-2 dark:text-gray-3">
                    {title}
                  </div>
                )}

                {activeChildren.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href ? localePath(locale, child.href) : "#"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 border-t border-light-3 py-3 pl-8 pr-5 text-sm text-gray-3 transition-colors hover:bg-light-2 hover:text-teal-3 dark:border-dark-2 dark:text-gray-2 dark:hover:bg-dark-2 dark:hover:text-teal-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-gray-2 dark:bg-gray-3" />
                    {locale === "tr" ? child.label_tr : child.label_en}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}