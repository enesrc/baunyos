"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const navItemSchema = z.object({
  label_tr: z.string().min(1, "Türkçe label gerekli."),
  label_en: z.string().min(1, "İngilizce label gerekli."),
  href: z.string().optional(),
  order: z.number().default(0),
  is_active: z.boolean().default(true),
  parent_id: z.number().nullable().default(null),
});

export async function createNavItem(_: unknown, formData: FormData) {
  const parentId = formData.get("parent_id");

  const parsed = navItemSchema.safeParse({
    label_tr: formData.get("label_tr"),
    label_en: formData.get("label_en"),
    href: formData.get("href") || undefined,
    order: Number(formData.get("order") ?? 0),
    is_active: formData.get("is_active") === "on",
    parent_id: parentId ? Number(parentId) : null,
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.navItem.create({ data: parsed.data });

  revalidatePath("/admin/navbar");
  redirect("/admin/navbar");
}

export async function updateNavItem(_: unknown, formData: FormData) {
  const id = Number(formData.get("id"));
  const parentId = formData.get("parent_id");

  const parsed = navItemSchema.safeParse({
    label_tr: formData.get("label_tr"),
    label_en: formData.get("label_en"),
    href: formData.get("href") || undefined,
    order: Number(formData.get("order") ?? 0),
    is_active: formData.get("is_active") === "on",
    parent_id: parentId ? Number(parentId) : null,
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.navItem.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/navbar");
  redirect("/admin/navbar");
}

export async function deleteNavItem(id: number) {
  await prisma.navItem.delete({ where: { id } });
  revalidatePath("/admin/navbar");
}