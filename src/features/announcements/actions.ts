"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const announcementSchema = z.object({
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  content_tr: z.string().min(1, "Türkçe içerik gerekli."),
  content_en: z.string().min(1, "İngilizce içerik gerekli."),
  is_active: z.boolean().default(true),
});

function parseAnnouncementFormData(formData: FormData) {
  return announcementSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    content_tr: formData.get("content_tr"),
    content_en: formData.get("content_en"),
    is_active: formData.get("is_active") === "on",
  });
}

export async function createAnnouncement(_: unknown, formData: FormData) {
  await requireAuth();

  const parsed = parseAnnouncementFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  await prisma.announcement.create({
    data: parsed.data,
  });

  revalidateTag("announcements", "max");
  redirect("/admin/announcements");
}

export async function updateAnnouncement(_: unknown, formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return "Geçersiz duyuru ID.";
  }

  const parsed = parseAnnouncementFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  await prisma.announcement.update({
    where: { id },
    data: parsed.data,
  });

  revalidateTag("announcements", "max");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: number) {
  await requireAuth();

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Geçersiz duyuru ID.");
  }

  await prisma.announcement.delete({
    where: { id },
  });

  revalidateTag("announcements", "max");
}