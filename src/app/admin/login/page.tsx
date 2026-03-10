import { Suspense } from "react";
import LoginForm from "@/components/sections/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm bg-white p-8">
        <h1 className="text-lg font-bold text-gray-900 mb-6">BAUN YÖS ADMİN</h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}