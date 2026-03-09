"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/features/auth/actions";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, null);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleReset = async () => {
    if (!resetEmail) return;
    await authClient.requestPasswordReset({
      email: resetEmail,
      redirectTo: "/admin/reset-password",
    });
    setResetSent(true);
  };

  if (resetMode) {
    return (
      <div className="flex flex-col gap-4">
        {resetSent ? (
          <p className="text-sm text-green-600">Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.</p>
        ) : (
          <>
            <input
              type="email"
              placeholder="E-posta"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-blue-600 transition-colors"
            />
            <button
              onClick={handleReset}
              className="bg-blue-600 p-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Sıfırlama Bağlantısı Gönder
            </button>
          </>
        )}
        <button type="button" onClick={() => setResetMode(false)} className="text-xs text-gray-400 hover:text-gray-600 text-left">
          Geri dön
        </button>
      </div>
    );
  }

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

      <button type="button" onClick={() => setResetMode(true)} className="text-xs text-gray-400 hover:text-gray-600 text-left">
        Şifremi unuttum
      </button>
    </form>
  );
}