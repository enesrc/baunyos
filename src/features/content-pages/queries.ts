import { prisma } from "@/lib/prisma";

export async function getPages() {
  return prisma.page.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function getPageById(id: number) {
  return prisma.page.findUnique({ where: { id } });
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}