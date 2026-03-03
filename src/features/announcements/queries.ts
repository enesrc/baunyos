import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    where: { is_active: true },
    orderBy: { published_at: "desc" },
  });
}

export async function getAnnouncementById(id: number) {
  return prisma.announcement.findFirst({
    where: { id, is_active: true },
  });
}

export async function getHomeAnnouncements() {
  return prisma.announcement.findMany({
    where: { is_active: true },
    orderBy: { published_at: "desc" },
    take: 6,
  });
}