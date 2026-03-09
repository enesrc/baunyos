"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  header_title_tr: z.string().min(1, "Türkçe header başlık gerekli."),
  header_title_en: z.string().min(1, "İngilizce header başlık gerekli."),
  footer_title_tr: z.string().min(1, "Türkçe footer başlık gerekli."),
  footer_title_en: z.string().min(1, "İngilizce footer başlık gerekli."),
});

export async function updateSiteSettings(_: unknown, formData: FormData) {
  const id = Number(formData.get("id"));

  const parsed = settingsSchema.safeParse({
    header_title_tr: formData.get("header_title_tr"),
    header_title_en: formData.get("header_title_en"),
    footer_title_tr: formData.get("footer_title_tr"),
    footer_title_en: formData.get("footer_title_en"),
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.siteSettings.update({ where: { id }, data: parsed.data });

  revalidatePath("/");
  revalidatePath("/admin/site-settings");

  return null;
}