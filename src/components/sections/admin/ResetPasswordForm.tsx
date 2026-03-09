"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = async () => {
    const token = searchParams.get("token");
    if (!token || !password) return;

    setPending(true);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    setPending(false);

    if (error) {
      setError(error.message ?? "Bağlantı geçersiz veya süresi dolmuş.");
    } else {
      router.push("/admin/login");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="password"
        placeholder="Yeni şifre"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(""); }}
        className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-blue-600 transition-colors"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={pending}
        className="bg-blue-600 p-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {pending ? "Kaydediliyor..." : "Şifreyi Güncelle"}
      </button>
    </div>
  );
}