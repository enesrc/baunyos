import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getPages() {
  "use cache";
  cacheTag("pages");

  return prisma.page.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function getPageById(id: number) {
  "use cache";
  cacheTag("pages");

  return prisma.page.findUnique({
    where: { id },
  });
}