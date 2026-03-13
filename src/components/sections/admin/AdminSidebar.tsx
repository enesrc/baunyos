"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/announcements", label: "Duyurular" },
  { href: "/admin/slider", label: "Slider Görselleri" },
  { href: "/admin/quick-access", label: "Hızlı Erişim Butonları" },
  { href: "/admin/navbar", label: "Navbar Butonları" },
  { href: "/admin/content-pages", label: "Sayfalar" },
  { href: "/admin/media", label: "Medya" },
  { href: "/admin/contact", label: "İletişim" },
  { href: "/admin/site-settings", label: "Site Ayarları" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex w-48 flex-col bg-gray-900 border border-gray-700">
      <div className="px-4 py-4 border-b border-gray-700">
        <p className="text-sm font-bold text-white">BAUN YÖS</p>
      </div>

      <nav className="flex flex-1 flex-col">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 text-sm border-b border-gray-700 ${
              pathname === item.href
                ? "bg-blue-700 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={async () => { await authClient.signOut(); router.push("/admin/login"); }}
        className="px-4 py-3 text-left text-sm text-gray-400 hover:text-white border-t border-gray-700"
      >
        Çıkış Yap
      </button>
    </aside>
  );
}