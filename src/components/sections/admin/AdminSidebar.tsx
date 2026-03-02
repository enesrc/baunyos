"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/announcements", label: "Duyurular" },
  { href: "/admin/slider", label: "Slider" },
  { href: "/admin/quick-access", label: "Hızlı Erişim" },
  { href: "/admin/navbar", label: "Navbar" },
  { href: "/admin/content-pages", label: "Sayfalar" },
  { href: "/admin/site-settings", label: "Site Ayarları" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-3">
      <div className="border-b border-light-4 px-6 py-4 dark:border-dark-1">
        <p className="text-sm font-semibold text-dark-3 dark:text-light-1">BAUN YÖS</p>
        <p className="text-xs text-gray-3 dark:text-gray-2">Admin Panel</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === item.href
                ? "bg-teal-1 font-medium text-teal-3 dark:bg-teal-4 dark:text-teal-1"
                : "text-gray-3 hover:bg-light-2 hover:text-dark-3 dark:text-gray-2 dark:hover:bg-dark-2 dark:hover:text-light-1"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-light-4 p-3 dark:border-dark-1">
        <button
          onClick={handleSignOut}
          className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-3 transition-colors hover:bg-light-2 hover:text-red-3 dark:text-gray-2 dark:hover:bg-dark-2 dark:hover:text-red-2"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}