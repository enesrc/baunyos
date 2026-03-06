"use client";

import TopBar from "./TopBar";
import LogoBar from "./LogoBar";
import NavBar from "./NavBar";
import type { SiteSettings } from "@/generated/prisma/client";
import type { Contact } from "@/generated/prisma/client";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function Header({ siteSettings, navItems, contact }: { siteSettings: SiteSettings, navItems: NavItem[], contact: Contact }) {
  return (
    <>
      <TopBar contact={contact} />
      <LogoBar siteSettings={siteSettings} navItems={navItems} />
      <NavBar items={navItems} />
    </>
  );
}