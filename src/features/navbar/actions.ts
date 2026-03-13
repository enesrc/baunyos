"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

async function reindexSiblings(parentId: number | null, priorityId?: number) {
  const siblings = await prisma.navItem.findMany({
    where: { parent_id: parentId ?? null },
    orderBy: { order: "asc" },
  });

  // Aynı order değerine sahip öğelerde, priorityId olan öğe önce gelir
  if (priorityId) {
    siblings.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      if (a.id === priorityId) return -1;
      if (b.id === priorityId) return 1;
      return 0;
    });
  }

  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].order !== i) {
      await prisma.navItem.update({
        where: { id: siblings[i].id },
        data: { order: i },
      });
    }
  }
}

const navItemSchema = z.object({
  label_tr: z.string().min(1, "Türkçe label gerekli."),
  label_en: z.string().min(1, "İngilizce label gerekli."),
  href: z.string().nullable().optional(),
  order: z.number().default(0),
  parent_id: z.number().nullable().default(null),
});

function parseNavItemFormData(formData: FormData) {
  const parentId = formData.get("parent_id");

  return navItemSchema.safeParse({
    label_tr: formData.get("label_tr"),
    label_en: formData.get("label_en"),
    href: formData.get("href") || null,
    order: Number(formData.get("order") ?? 0),
    parent_id: parentId ? Number(parentId) : null,
  });
}

export async function createNavItem(_: unknown, formData: FormData) {
  await requireAuth();

  const parsed = parseNavItemFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  const item = await prisma.navItem.create({
    data: parsed.data,
  });

  await reindexSiblings(parsed.data.parent_id ?? null, item.id);
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

  const oldItem = await prisma.navItem.findUnique({ where: { id } });
  const oldParentId = oldItem?.parent_id ?? null;

  await prisma.navItem.update({
    where: { id },
    data: parsed.data,
  });

  await reindexSiblings(parsed.data.parent_id ?? null, id);
  if (oldParentId !== (parsed.data.parent_id ?? null)) {
    await reindexSiblings(oldParentId);
  }

  revalidateTag("nav-items", "max");
  redirect("/admin/navbar");
}

export async function deleteNavItem(id: number) {
  await requireAuth();

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Geçersiz navbar öğesi ID.");
  }

  const item = await prisma.navItem.findUnique({ where: { id } });
  const parentId = item?.parent_id ?? null;

  await prisma.navItem.delete({
    where: { id },
  });

  await reindexSiblings(parentId);
  revalidateTag("nav-items", "max");
}
