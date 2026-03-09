"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/announcements": "Duyurular",
  "/admin/slider": "Slider",
  "/admin/quick-access": "Hızlı Erişim",
  "/admin/navbar": "Navbar",
  "/admin/content-pages": "Sayfalar",
  "/admin/site-settings": "Site Ayarları",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="bg-gray-900 px-6 py-3 border-l border-gray-700">
      <p className="text-sm font-medium text-white">{title}</p>
    </header>
  );
}