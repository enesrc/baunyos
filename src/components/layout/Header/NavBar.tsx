import DesktopNavItem from "@/components/ui/DesktopNavItem";
import type { NavItemGetPayload } from "@/generated/prisma/models/NavItem";

type NavItem = NavItemGetPayload<{ include: { children: true } }>;

export default function NavBar({ items }: { items: NavItem[] }) {
  const activeItems = items.filter((i) => i.is_active);

  return (
    <div className="hidden w-full border-b border-light-4 bg-light-2/95 backdrop-blur-xl dark:border-dark-1 dark:bg-dark-3 md:sticky md:top-0 md:z-40 md:block">
      <div className="flex items-center justify-center px-2 lg:px-0">
        <nav className="flex w-full flex-wrap items-stretch justify-center">
          {activeItems.map((item) => (
            <DesktopNavItem
              key={item.id}
              item={item}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}