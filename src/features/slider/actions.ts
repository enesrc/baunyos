"use server";

import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const sliderSchema = z.object({
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export async function createSlider(_: unknown, formData: FormData) {
  const file = formData.get("image") as File;

  if (!file || file.size === 0) return "Görsel gerekli.";

  const parsed = sliderSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    order: Number(formData.get("order") ?? 0),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  const imageUrl = await uploadImage(file);

  await prisma.slider.create({
    data: { ...parsed.data, image_url: imageUrl },
  });

  revalidatePath("/admin/slider");
  redirect("/admin/slider");
}

export async function updateSlider(_: unknown, formData: FormData) {
  const id = Number(formData.get("id"));
  const file = formData.get("image") as File;

  const parsed = sliderSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    order: Number(formData.get("order") ?? 0),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  const existing = await prisma.slider.findUnique({ where: { id } });
  if (!existing) return "Slider bulunamadı.";

  let imageUrl = existing.image_url;

  if (file && file.size > 0) {
    await deleteImage(existing.image_url);
    imageUrl = await uploadImage(file);
  }

  await prisma.slider.update({
    where: { id },
    data: { ...parsed.data, image_url: imageUrl },
  });

  revalidatePath("/admin/slider");
  redirect("/admin/slider");
}

export async function deleteSlider(id: number) {
  const slider = await prisma.slider.findUnique({ where: { id } });
  if (slider) await deleteImage(slider.image_url);
  await prisma.slider.delete({ where: { id } });
  revalidatePath("/admin/slider");
}