"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { revalidateTag } from "next/cache";
import { uploadImage, uploadFile, deleteImage } from "@/lib/upload";

const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];
const ALLOWED_FILE_EXTS = ["pdf"];
const ALLOWED_EXTS = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_FILE_EXTS];

export async function uploadMedia(formData: FormData) {
  await requireAuth();

  const file = formData.get("file") as File;
  if (!file || !file.name) {
    return { error: "Dosya bulunamadı." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTS.includes(ext)) {
    return { error: `Desteklenmeyen dosya türü: .${ext}` };
  }

  const isImage = ALLOWED_IMAGE_EXTS.includes(ext);
  const url = isImage ? await uploadImage(file) : await uploadFile(file);

  await prisma.media.create({
    data: {
      url,
      filename: file.name,
      type: isImage ? "image" : "pdf",
      size: file.size,
    },
  });

  revalidateTag("media");
  return { url };
}

export async function deleteMedia(id: number) {
  await requireAuth();

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Geçersiz medya ID.");
  }

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    throw new Error("Medya bulunamadı.");
  }

  await deleteImage(media.url);
  await prisma.media.delete({ where: { id } });

  revalidateTag("media");
}
