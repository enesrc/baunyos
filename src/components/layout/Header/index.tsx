"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import LogoBar from "./LogoBar";
import NavBar from "./NavBar";
import type { SiteSettings } from "@/generated/prisma/client";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function Header({ siteSettings, navItems }: { siteSettings: SiteSettings, navItems: NavItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={menuOpen ? "hidden" : ""}>
        <TopBar />
      </div>
      <LogoBar
        siteSettings={siteSettings}
        navItems={navItems}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
      />
      <NavBar items={navItems} />
    </>
  );
}