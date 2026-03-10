import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getSliders() {
  "use cache";
  cacheTag("sliders");

  return prisma.slider.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getSliderById(id: number) {
  "use cache";
  cacheTag("sliders");

  return prisma.slider.findUnique({
    where: { id },
  });
}