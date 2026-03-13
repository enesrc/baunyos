"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin/announcements": "Duyurular",
  "/admin/announcements/new": "Yeni Duyuru",
  "/admin/slider": "Slider",
  "/admin/slider/new": "Yeni Slide",
  "/admin/quick-access": "Hızlı Erişim",
  "/admin/quick-access/new": "Yeni Hızlı Erişim",
  "/admin/navbar": "Navbar",
  "/admin/navbar/new": "Yeni Navbar Öğesi",
  "/admin/content-pages": "Sayfalar",
  "/admin/content-pages/new": "Yeni Sayfa",
  "/admin/contact": "İletişim Ayarları",
  "/admin/site-settings": "Site Ayarları",
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/admin/announcements/")) return "Duyuru Düzenle";
  if (pathname.startsWith("/admin/slider/")) return "Slide Düzenle";
  if (pathname.startsWith("/admin/quick-access/")) return "Hızlı Erişim Düzenle";
  if (pathname.startsWith("/admin/navbar/")) return "Navbar Öğesi Düzenle";
  if (pathname.startsWith("/admin/content-pages/")) return "Sayfa Düzenle";
  return "Admin";
}

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between bg-gray-900 px-6 py-4 border border-gray-700 border-l-0">
      <p className="text-sm font-medium text-white">{getTitle(pathname)}</p>
    </header>
  );
}