import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  "use cache";
  cacheTag("announcements");

  return prisma.announcement.findMany({
    where: { is_active: true },
    orderBy: { published_at: "desc" },
  });
}

export async function getAnnouncementById(id: number) {
  "use cache";
  cacheTag("announcements");

  return prisma.announcement.findFirst({
    where: { id, is_active: true },
  });
}

export async function getHomeAnnouncements() {
  "use cache";
  cacheTag("announcements");

  return prisma.announcement.findMany({
    where: { is_active: true },
    orderBy: { published_at: "desc" },
    take: 6,
  });
}