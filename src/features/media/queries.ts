import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getMediaItems = unstable_cache(
  async (type?: string) => {
    return prisma.media.findMany({
      where: type ? { type } : undefined,
      orderBy: { created_at: "desc" },
    });
  },
  ["media-items"],
  { tags: ["media"] }
);
