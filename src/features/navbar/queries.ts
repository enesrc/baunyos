import { prisma } from "@/lib/prisma";

export async function getNavItems() {
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
  return prisma.navItem.findUnique({
    where: { id },
    include: { children: true },
  });
}