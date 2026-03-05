"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useI18n } from "@/features/i18n/I18nContextValue";
import { localePath } from "@/lib/links";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function MobileDrawer({ items }: { items: NavItem[] }) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeItems = items.filter((i) => i.is_active);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Hamburger ───────────────────────────── */}
      <button
        className={`relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 md:hidden ${
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
        className={`fixed inset-0 z-40 bg-dark-4/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* ── Drawer ──────────────────────────────── */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-[85vw] max-w-sm flex-col bg-light-1 shadow-2xl transition-transform duration-300 ease-out dark:bg-dark-3 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-light-4 px-5 py-4 dark:border-dark-1">
          <div className="flex items-center gap-2">
            <Image
              src="/baun_logo.png"
              alt="Balıkesir Üniversitesi"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-extrabold uppercase text-dark-3 dark:text-light-1">
                {locale === "tr" ? "BALIKESİR ÜNİVERSİTESİ" : "BALIKESİR UNIVERSITY"}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-teal-3 dark:text-teal-2">
                International Students
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-light-2 text-gray-3 transition-colors hover:bg-light-3 dark:bg-dark-2 dark:text-gray-2 dark:hover:bg-dark-1"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-0.5 bg-gradient-to-r from-teal-3 via-teal-2 to-amber-2" />

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {activeItems.map((item) => {
            const title = locale === "tr" ? item.label_tr : item.label_en;
            const activeChildren = item.children.filter((c) => c.is_active);

            return (
              <div key={item.id} className="mb-1">
                {item.href ? (
                  <Link
                    href={localePath(locale, item.href)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      pathname.startsWith(localePath(locale, item.href))
                        ? "bg-teal-1/50 text-teal-3 dark:bg-teal-4/20 dark:text-teal-2"
                        : "text-dark-3 hover:bg-light-2 dark:text-light-2 dark:hover:bg-dark-2"
                    }`}
                  >
                    {title}
                  </Link>
                ) : (
                  <div className="mb-1 mt-3 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-2 dark:text-gray-3">
                    {title}
                  </div>
                )}

                {activeChildren.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href ? localePath(locale, child.href) : "#"}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg py-2.5 pl-8 pr-4 text-sm transition-all ${
                      child.href && pathname.startsWith(localePath(locale, child.href))
                        ? "bg-teal-1/30 text-teal-3 dark:bg-teal-4/15 dark:text-teal-2"
                        : "text-gray-3 hover:bg-light-2 hover:text-dark-3 dark:text-gray-2 dark:hover:bg-dark-2 dark:hover:text-light-1"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-2/50 dark:bg-teal-3/50" />
                    {locale === "tr" ? child.label_tr : child.label_en}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-light-4 px-5 py-4 dark:border-dark-1">
          <p className="text-center text-[10px] text-gray-2 dark:text-gray-3">
            © {new Date().getFullYear()} Balıkesir Üniversitesi
          </p>
        </div>
      </div>
    </>
  );
}