"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

/* ─── Accordion item for dropdown nav items ──────────── */
function MobileAccordion({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const title = locale === "tr" ? item.label_tr : item.label_en;
  const activeChildren = item.children.filter((c) => c.is_active);

  return (
    <div className="border-b border-light-3 last:border-b-0 dark:border-dark-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-medium text-dark-1 transition-colors hover:bg-light-2 hover:text-teal-3 dark:text-light-2 dark:hover:bg-dark-2 dark:hover:text-teal-2"
      >
        {title}
        <ChevronDown
          size={14}
          className={`text-gray-2 transition-transform duration-200 dark:text-gray-3 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Accordion content */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {activeChildren.map((child) => (
          <Link
            key={child.id}
            href={child.href ? localePath(locale, child.href) : "#"}
            onClick={onNavigate}
            className="flex items-center gap-2.5 border-t border-light-3 py-3 pl-8 pr-5 text-sm text-gray-3 transition-colors hover:bg-light-2 hover:text-teal-3 dark:border-dark-2 dark:text-gray-2 dark:hover:bg-dark-2 dark:hover:text-teal-2"
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-teal-2/50 dark:bg-teal-3/50" />
            {locale === "tr" ? child.label_tr : child.label_en}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── MobileDrawer ───────────────────────────────────── */
export default function MobileDrawer({ items }: { items: NavItem[] }) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeItems = items.filter((i) => i.is_active);

  /* Close on route change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      {/* ── Hamburger ───────────────────────────── */}
      <button
        className={`relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
          open
            ? "bg-teal-3 text-light-1 dark:bg-teal-2"
            : "border border-light-4 text-gray-3 hover:border-teal-3 hover:text-teal-3 dark:border-dark-1 dark:text-gray-2 dark:hover:border-teal-2 dark:hover:text-teal-2"
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü"
      >
        <div className="relative h-4 w-4">
          <span
            className={`absolute left-0 block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
              open ? "top-[7px] rotate-45" : "top-0.5"
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
              open ? "top-[7px] -rotate-45" : "top-[13px]"
            }`}
          />
        </div>
      </button>

      {/* ── Backdrop ────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-dark-4/30 transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />

      {/* ── Dropdown panel (slides down from navbar) ── */}
      <div
        className={`fixed left-0 right-0 z-50 overflow-y-auto border-b border-light-4 bg-light-1 shadow-lg transition-all duration-300 ease-in-out dark:border-dark-1 dark:bg-dark-3 ${
          open ? "max-h-[75vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ top: "var(--mobile-nav-top, 0)" }}
      >
        {activeItems.map((item) => {
          const hasChildren = item.children.length > 0 && !item.href;

          if (hasChildren) {
            return (
              <MobileAccordion key={item.id} item={item} onNavigate={close} />
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href ? localePath(locale, item.href) : "#"}
              onClick={close}
              className="block border-b border-light-3 px-5 py-3.5 text-sm font-medium text-dark-1 transition-colors last:border-b-0 hover:bg-light-2 hover:text-teal-3 dark:border-dark-2 dark:text-light-2 dark:hover:bg-dark-2 dark:hover:text-teal-2"
            >
              {locale === "tr" ? item.label_tr : item.label_en}
            </Link>
          );
        })}
      </div>
    </div>
  );
}