import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

// Note: auth enforcement is handled by middleware.ts
// Admin layout just provides the shell
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1400px] p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
