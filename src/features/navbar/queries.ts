import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getNavItems() {
  "use cache";
  cacheTag("nav-items");

  return prisma.navItem.findMany({
    where: { parent_id: null },
    orderBy: { order: "asc" },
    include: {
      children: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getNavItemById(id: number) {
  "use cache";
  cacheTag("nav-items");

  if (!id || isNaN(id)) return null;

  return prisma.navItem.findUnique({
    where: { id },
    include: { children: true },
  });
}