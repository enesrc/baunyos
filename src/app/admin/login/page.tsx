import LoginForm from "@/components/sections/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-2 dark:bg-dark-4">
      <div className="w-full max-w-sm rounded-md border border-light-4 bg-light-1 p-8 dark:border-dark-1 dark:bg-dark-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
          BAUN YÖS
        </p>
        <h1 className="mb-6 text-xl font-semibold text-dark-3 dark:text-light-1">Admin Girişi</h1>
        <LoginForm />
      </div>
    </div>
  );
}