"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const contactSchema = z.object({
  title_tr: z.string().min(1),
  title_en: z.string().min(1),
  desc_tr: z.string().default(""),
  desc_en: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  address_tr: z.string().default(""),
  address_en: z.string().default(""),
  google_maps_url: z.string().default(""),
  facebook: z.string().default(""),
  instagram: z.string().default(""),
  youtube: z.string().default(""),
  linkedin: z.string().default(""),
  twitter: z.string().default(""),
});

export async function saveContact(_: unknown, formData: FormData) {
  await requireAuth();

  const parsed = contactSchema.safeParse({
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    desc_tr: formData.get("desc_tr"),
    desc_en: formData.get("desc_en"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address_tr: formData.get("address_tr"),
    address_en: formData.get("address_en"),
    google_maps_url: formData.get("google_maps_url"),
    facebook: formData.get("facebook"),
    instagram: formData.get("instagram"),
    youtube: formData.get("youtube"),
    linkedin: formData.get("linkedin"),
    twitter: formData.get("twitter"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  const existing = await prisma.contact.findFirst();

  if (existing) {
    await prisma.contact.update({
      where: { id: existing.id },
      data: parsed.data,
    });
  } else {
    await prisma.contact.create({
      data: parsed.data,
    });
  }

  revalidateTag("contact", "max");
  return null;
}