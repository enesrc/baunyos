"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const pageSchema = z.object({
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  content_tr: z.string().min(1, "Türkçe içerik gerekli."),
  content_en: z.string().min(1, "İngilizce içerik gerekli."),
});

function parsePageFormData(formData: FormData) {
  return pageSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    content_tr: formData.get("content_tr"),
    content_en: formData.get("content_en"),
  });
}

export async function createPage(_: unknown, formData: FormData) {
  await requireAuth();

  const parsed = parsePageFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  await prisma.page.create({
    data: parsed.data,
  });

  revalidateTag("pages", "max");
  redirect("/admin/content-pages");
}

export async function updatePage(_: unknown, formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return "Geçersiz sayfa ID.";
  }

  const parsed = parsePageFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  await prisma.page.update({
    where: { id },
    data: parsed.data,
  });

  revalidateTag("pages", "max");
  redirect("/admin/content-pages");
}

export async function deletePage(id: number) {
  await requireAuth();

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Geçersiz sayfa ID.");
  }

  await prisma.page.delete({
    where: { id },
  });

  revalidateTag("pages", "max");
}