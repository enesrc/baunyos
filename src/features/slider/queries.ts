import { prisma } from "@/lib/prisma";

export async function getSliders() {
  return prisma.slider.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getSliderById(id: number) {
  return prisma.slider.findUnique({ where: { id } });
}