import { prisma } from "@/lib/prisma";

export async function getQuickAccessItems() {
  return prisma.quickAccess.findMany({
    where: { is_active: true },
    orderBy: { order: "asc" },
  });
}

export async function getQuickAccessItemById(id: number) {
  return prisma.quickAccess.findUnique({ where: { id } });
}