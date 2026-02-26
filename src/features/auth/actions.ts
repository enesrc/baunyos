"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email("Geçerli bir email girin."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});

export async function loginAction(_: unknown, formData: FormData) {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return parsed.error.issues[0].message;
    }

    try {
        await auth.api.signInEmail({
            body: parsed.data,
            headers: await headers(),
        });
    } catch {
        return "Email veya şifre hatalı.";
    }

    redirect("/admin");
}