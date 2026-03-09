import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();

  if (!settings) {
    return {
      id: 1,
      header_title_tr: "Uluslararası Öğrenciler",
      header_title_en: "International Students",
      footer_title_tr: "Balıkesir Üniversitesi Uluslararası İlişkiler Merkezi",
      footer_title_en: "Balikesir University International Relations Center",
    };
  }

  return settings;
}