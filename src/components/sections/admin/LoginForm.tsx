"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  const inputClass =
    "w-full rounded-md border border-light-4 bg-light-1 px-3 py-2 text-sm text-dark-3 outline-none transition-colors focus:border-teal-3 dark:border-dark-1 dark:bg-dark-3 dark:text-light-1 dark:focus:border-teal-2";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Email</label>
        <input type="email" name="email" className={inputClass} required />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-3 dark:text-gray-2">Şifre</label>
        <input type="password" name="password" className={inputClass} required />
      </div>

      {error && <p className="text-sm text-red-3 dark:text-red-2">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 transition-colors hover:bg-teal-4 disabled:opacity-60 dark:bg-teal-2 dark:hover:bg-teal-3"
      >
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}