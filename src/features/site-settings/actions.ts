"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  header_title_tr: z.string().min(1, "Türkçe header başlık gerekli."),
  header_title_en: z.string().min(1, "İngilizce header başlık gerekli."),
  footer_title_tr: z.string().min(1, "Türkçe footer başlık gerekli."),
  footer_title_en: z.string().min(1, "İngilizce footer başlık gerekli."),
});

export async function updateSiteSettings(_: unknown, formData: FormData) {
  await requireAuth();

  const parsed = settingsSchema.safeParse({
    header_title_tr: formData.get("header_title_tr"),
    header_title_en: formData.get("header_title_en"),
    footer_title_tr: formData.get("footer_title_tr"),
    footer_title_en: formData.get("footer_title_en"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  const existing = await prisma.siteSettings.findFirst();

  if (existing) {
    await prisma.siteSettings.update({
      where: { id: existing.id },
      data: parsed.data,
    });
  } else {
    await prisma.siteSettings.create({
      data: parsed.data,
    });
  }

  revalidateTag("site-settings", "max");
  return null;
}