"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  icon: z.string().min(1, "İkon gerekli."),
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  desc_tr: z.string().min(1, "Türkçe açıklama gerekli."),
  desc_en: z.string().min(1, "İngilizce açıklama gerekli."),
  href: z.string().min(1, "Link gerekli."),
  order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export async function createQuickAccessItem(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    icon: formData.get("icon"),
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    desc_tr: formData.get("desc_tr"),
    desc_en: formData.get("desc_en"),
    href: formData.get("href"),
    order: Number(formData.get("order") ?? 0),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.quickAccess.create({ data: parsed.data });

  revalidatePath("/admin/quick-access");
  redirect("/admin/quick-access");
}

export async function updateQuickAccessItem(_: unknown, formData: FormData) {
  const id = Number(formData.get("id"));

  const parsed = schema.safeParse({
    icon: formData.get("icon"),
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    desc_tr: formData.get("desc_tr"),
    desc_en: formData.get("desc_en"),
    href: formData.get("href"),
    order: Number(formData.get("order") ?? 0),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.quickAccess.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/quick-access");
  redirect("/admin/quick-access");
}

export async function deleteQuickAccessItem(id: number) {
  await prisma.quickAccess.delete({ where: { id } });
  revalidatePath("/admin/quick-access");
}