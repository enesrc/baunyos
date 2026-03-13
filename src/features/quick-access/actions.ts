"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

async function reindexQuickAccess(priorityId?: number) {
  const items = await prisma.quickAccess.findMany({
    orderBy: { order: "asc" },
  });

  if (priorityId) {
    items.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      if (a.id === priorityId) return -1;
      if (b.id === priorityId) return 1;
      return 0;
    });
  }

  for (let i = 0; i < items.length; i++) {
    if (items[i].order !== i) {
      await prisma.quickAccess.update({
        where: { id: items[i].id },
        data: { order: i },
      });
    }
  }
}

const quickAccessItemSchema = z.object({
  icon: z.string().min(1, "İkon gerekli."),
  title_tr: z.string().min(1, "Türkçe başlık gerekli."),
  title_en: z.string().min(1, "İngilizce başlık gerekli."),
  desc_tr: z.string().min(1, "Türkçe açıklama gerekli."),
  desc_en: z.string().min(1, "İngilizce açıklama gerekli."),
  href: z.string().min(1, "Link gerekli."),
  order: z.number().default(0),
});

function parseQuickAccessItemFormData(formData: FormData) {
  return quickAccessItemSchema.safeParse({
    icon: formData.get("icon"),
    title_tr: formData.get("title_tr"),
    title_en: formData.get("title_en"),
    desc_tr: formData.get("desc_tr"),
    desc_en: formData.get("desc_en"),
    href: formData.get("href"),
    order: Number(formData.get("order") ?? 0),
  });
}

export async function createQuickAccessItem(_: unknown, formData: FormData) {
  await requireAuth();

  const parsed = parseQuickAccessItemFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  const item = await prisma.quickAccess.create({
    data: parsed.data,
  });

  await reindexQuickAccess(item.id);
  revalidateTag("quick-access", "max");
  redirect("/admin/quick-access");
}

export async function updateQuickAccessItem(_: unknown, formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return "Geçersiz hızlı erişim ID.";
  }

  const parsed = parseQuickAccessItemFormData(formData);

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  await prisma.quickAccess.update({
    where: { id },
    data: parsed.data,
  });

  await reindexQuickAccess(id);
  revalidateTag("quick-access", "max");
  redirect("/admin/quick-access");
}

export async function deleteQuickAccessItem(id: number) {
  await requireAuth();

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Geçersiz hızlı erişim ID.");
  }

  await prisma.quickAccess.delete({
    where: { id },
  });

  await reindexQuickAccess();
  revalidateTag("quick-access", "max");
}
