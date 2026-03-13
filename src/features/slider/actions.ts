"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const sliderSchema = z.object({
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  order: z.number().default(0),
});

function parseSliderFormData(formData: FormData) {
  return sliderSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    order: Number(formData.get("order") ?? 0),
  });
}

export async function createSlider(_: unknown, formData: FormData) {
  await requireAuth();

  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    return "Görsel gerekli.";
  }

  const parsed = parseSliderFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  const imageUrl = await uploadImage(file);

  await prisma.slider.create({
    data: {
      ...parsed.data,
      image_url: imageUrl,
    },
  });

  revalidateTag("sliders", "max");
  redirect("/admin/slider");
}

export async function updateSlider(_: unknown, formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return "Geçersiz slider ID.";
  }

  const file = formData.get("image") as File;
  const parsed = parseSliderFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  const existing = await prisma.slider.findUnique({
    where: { id },
  });

  if (!existing) {
    return "Slider bulunamadı.";
  }

  let imageUrl = existing.image_url;

  if (file && file.size > 0) {
    await deleteImage(existing.image_url);
    imageUrl = await uploadImage(file);
  }

  await prisma.slider.update({
    where: { id },
    data: {
      ...parsed.data,
      image_url: imageUrl,
    },
  });

  revalidateTag("sliders", "max");
  redirect("/admin/slider");
}

export async function deleteSlider(id: number) {
  await requireAuth();

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Geçersiz slider ID.");
  }

  const slider = await prisma.slider.findUnique({
    where: { id },
  });

  if (slider) {
    await deleteImage(slider.image_url);
  }

  await prisma.slider.delete({
    where: { id },
  });

  revalidateTag("sliders", "max");
}