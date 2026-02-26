import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        phone: "0266 612 1400",
        email: "yos.ofis@balikesir.edu.tr",
        logo_text_tr: "ULUSLARARASI ÖĞRENCİ",
        logo_text_en: "INTERNATIONAL STUDENT",
      },
    });
  }

  return settings;
}