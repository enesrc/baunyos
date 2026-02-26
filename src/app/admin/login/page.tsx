import LoginForm from "@/components/sections/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface1 p-8 shadow-soft">
        <h1 className="mb-6 text-xl font-semibold">Admin Girişi</h1>
        <LoginForm />
      </div>
    </div>
  );
}