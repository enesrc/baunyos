import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";

export async function getQuickAccessItems() {
  "use cache";

  cacheTag("quick-access");

  return prisma.quickAccess.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getQuickAccessItemById(id: number) {
  "use cache";

  cacheTag("quick-access");

  return prisma.quickAccess.findUnique({
    where: { id },
  });
}