import { Suspense } from "react";
import ResetPasswordForm from "@/components/sections/admin/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm bg-white p-8">
        <h1 className="text-lg font-bold text-gray-900 mb-6">Yeni Şifre</h1>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}