import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  "use cache";
  cacheTag("site-settings");

  return prisma.siteSettings.findFirst();
}