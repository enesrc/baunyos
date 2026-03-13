import { Suspense } from "react";
import AdminSidebar from "@/components/sections/admin/AdminSidebar";
import AdminHeader from "@/components/sections/admin/AdminHeader";
import ProtectedGate from "./protected-gate";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProtectedGate>
        <div className="bg-black">
          <div className="mx-auto flex h-screen max-w-6xl overflow-hidden">
            <AdminSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto bg-white p-6">
                <Suspense fallback={null}>
                  {children}
                </Suspense>
              </main>
            </div>
          </div>
        </div>
      </ProtectedGate>
    </Suspense>
  );
}