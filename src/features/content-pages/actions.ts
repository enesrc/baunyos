"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const pageSchema = z.object({
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  slug: z
    .string()
    .min(1, "Slug gerekli.")
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  content_tr: z.string().min(1, "Türkçe içerik gerekli."),
  content_en: z.string().min(1, "İngilizce içerik gerekli."),
  is_active: z.boolean().default(true),
});

export async function createPage(_: unknown, formData: FormData) {
  const parsed = pageSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    slug: formData.get("slug"),
    content_tr: formData.get("content_tr"),
    content_en: formData.get("content_en"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  try {
    await prisma.page.create({ data: parsed.data });
  } catch {
    return "Bu slug zaten kullanımda.";
  }

  revalidatePath("/admin/content-pages");
  redirect("/admin/content-pages");
}

export async function updatePage(_: unknown, formData: FormData) {
  const id = Number(formData.get("id"));

  const parsed = pageSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    slug: formData.get("slug"),
    content_tr: formData.get("content_tr"),
    content_en: formData.get("content_en"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  try {
    await prisma.page.update({ where: { id }, data: parsed.data });
  } catch {
    return "Bu slug zaten kullanımda.";
  }

  revalidatePath("/admin/content-pages");
  revalidatePath(`/tr/icerik/${parsed.data.slug}`);
  revalidatePath(`/en/icerik/${parsed.data.slug}`);
  redirect("/admin/content-pages");
}

export async function deletePage(id: number) {
  await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/content-pages");
}