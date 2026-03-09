"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder="E-posta"
        required
        className="w-full border border-gray-300 p-3 text-sm text-black outline-none focus:border-blue-600 transition-colors"
      />
      <input
        type="password"
        name="password"
        placeholder="Şifre"
        required
        className="w-full border border-gray-300 p-3 text-sm text-black outline-none focus:border-blue-600 transition-colors"
      />

      {error && <p className="text-red-600 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 p-3 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}