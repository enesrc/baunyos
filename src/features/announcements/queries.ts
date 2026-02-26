import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { published_at: "desc" },
  });
}

export async function getAnnouncementById(id: number) {
  return prisma.announcement.findUnique({
    where: { id },
  });
}