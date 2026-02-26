"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const announcementSchema = z.object({
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  content_tr: z.string().min(1, "Türkçe içerik gerekli."),
  content_en: z.string().min(1, "İngilizce içerik gerekli."),
  is_active: z.boolean().default(true),
});

export async function createAnnouncement(_: unknown, formData: FormData) {
  const parsed = announcementSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    content_tr: formData.get("content_tr"),
    content_en: formData.get("content_en"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  await prisma.announcement.create({ data: parsed.data });

  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function updateAnnouncement(_: unknown, formData: FormData) {
  const id = Number(formData.get("id"));

  const parsed = announcementSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    content_tr: formData.get("content_tr"),
    content_en: formData.get("content_en"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  await prisma.announcement.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: number) {
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcements");
}