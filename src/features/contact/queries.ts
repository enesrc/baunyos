import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getContact() {
  "use cache";
  cacheTag("contact");

  return prisma.contact.findFirst();
}