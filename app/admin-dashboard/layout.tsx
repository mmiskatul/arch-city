import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardAuthProvider } from "@/components/auth/dashboard-auth-context";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const tokenPresent = Boolean(cookieStore.get("arch_access_token")?.value);
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  if (!tokenPresent || role !== "admin") {
    redirect("/login?redirect=/admin-dashboard");
  }

  return (
    <DashboardAuthProvider dashboard="admin" initialRole={role} initialTokenPresent={tokenPresent}>
      {children}
    </DashboardAuthProvider>
  );
}
