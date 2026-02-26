"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  phone: z.string().min(1, "Telefon gerekli."),
  email: z.string().email("Geçerli bir email girin."),
  logo_text_tr: z.string().min(1, "Türkçe logo yazısı gerekli."),
  logo_text_en: z.string().min(1, "İngilizce logo yazısı gerekli."),
});

export async function updateSiteSettings(_: unknown, formData: FormData) {
  const id = Number(formData.get("id"));

  const parsed = settingsSchema.safeParse({
    phone: formData.get("phone"),
    email: formData.get("email"),
    logo_text_tr: formData.get("logo_text_tr"),
    logo_text_en: formData.get("logo_text_en"),
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.siteSettings.update({ where: { id }, data: parsed.data });

  revalidatePath("/");
  revalidatePath("/admin/site-settings");

  return null;
}