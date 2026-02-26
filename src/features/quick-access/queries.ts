import { prisma } from "@/lib/prisma";

export async function getQuickAccessItems() {
  return prisma.quickAccess.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getQuickAccessItemById(id: number) {
  return prisma.quickAccess.findUnique({ where: { id } });
}