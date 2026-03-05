import DesktopNavItem from "@/components/ui/DesktopNavItem";
import MobileDrawer from "./MobileDrawer";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function NavBar({ items }: { items: NavItem[] }) {
  const activeItems = items.filter((i) => i.is_active);

  return (
    <>
      <nav className="hidden w-full flex-wrap items-stretch justify-center md:flex">
        {activeItems.map((item) => {
          return (
            <DesktopNavItem
              key={item.id}
              item={item}
            />
          );
        })}
      </nav>

      <MobileDrawer items={items} />
    </>
  );
}