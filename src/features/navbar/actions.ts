"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const navItemSchema = z.object({
  label_tr: z.string().min(1, "Türkçe label gerekli."),
  label_en: z.string().min(1, "İngilizce label gerekli."),
  href: z.string().nullable().optional(),
  order: z.number().default(0),
  is_active: z.boolean().default(true),
  parent_id: z.number().nullable().default(null),
});

function parseNavItemFormData(formData: FormData) {
  const parentId = formData.get("parent_id");

  return navItemSchema.safeParse({
    label_tr: formData.get("label_tr"),
    label_en: formData.get("label_en"),
    href: formData.get("href") || null,
    order: Number(formData.get("order") ?? 0),
    is_active: formData.get("is_active") === "on",
    parent_id: parentId ? Number(parentId) : null,
  });
}

export async function createNavItem(_: unknown, formData: FormData) {
  await requireAuth();

  const parsed = parseNavItemFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  await prisma.navItem.create({
    data: parsed.data,
  });

  revalidateTag("nav-items", "max");
  redirect("/admin/navbar");
}

export async function updateNavItem(_: unknown, formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return "Geçersiz navbar öğesi ID.";
  }

  const parsed = parseNavItemFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  await prisma.navItem.update({
    where: { id },
    data: parsed.data,
  });

  revalidateTag("nav-items", "max");
  redirect("/admin/navbar");
}

export async function deleteNavItem(id: number) {
  await requireAuth();

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Geçersiz navbar öğesi ID.");
  }

  await prisma.navItem.delete({
    where: { id },
  });

  revalidateTag("nav-items", "max");
}