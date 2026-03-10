"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir email girin."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
});

function getExpiresAt(): Date {
  const now = new Date();
  const expires = new Date();

  expires.setHours(13, 27, 0, 0);

  if (now >= expires) {
    expires.setDate(expires.getDate() + 1);
  }

  return expires;
}

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Form doğrulanamadı.";
  }

  try {
    const result = await auth.api.signInEmail({
      body: parsed.data,
      headers: await headers(),
    });

    await prisma.session.update({
      where: { token: result.token },
      data: { expiresAt: getExpiresAt() },
    });
  } catch {
    return "Email veya şifre hatalı.";
  }

  redirect("/admin");
}