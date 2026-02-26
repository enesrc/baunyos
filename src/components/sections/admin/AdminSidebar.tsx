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
    <aside className="flex h-screen w-56 flex-col border-r border-border bg-surface1">
      <div className="border-b border-border px-6 py-4">
        <p className="text-sm font-semibold">BAUN YÖS</p>
        <p className="text-xs opacity-50">Admin Panel</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm transition hover:bg-surface1 ${pathname === item.href
                ? "bg-accent/10 font-medium text-accent"
                : "opacity-70 hover:opacity-100"
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="w-full rounded-lg px-3 py-2 text-left text-sm opacity-70 transition hover:opacity-100"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}