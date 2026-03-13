import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  "use cache";
  cacheTag("announcements");

  return prisma.announcement.findMany({
    orderBy: { published_at: "desc" },
  });
}

export async function getAnnouncementById(id: number) {
  "use cache";
  cacheTag("announcements");

  return prisma.announcement.findUnique({
    where: { id },
  });
}

export async function getHomeAnnouncements() {
  "use cache";
  cacheTag("announcements");

  return prisma.announcement.findMany({
    orderBy: { published_at: "desc" },
    take: 6,
  });
}