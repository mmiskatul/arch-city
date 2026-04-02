import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardAuthProvider } from "@/components/auth/dashboard-auth-context";

export default async function ParentDashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const tokenPresent = Boolean(cookieStore.get("arch_access_token")?.value);
  if (!tokenPresent) {
    redirect("/login");
  }

  const role = cookieStore.get("arch_user_role")?.value ?? null;

  return (
    <DashboardAuthProvider dashboard="parent" initialRole={role} initialTokenPresent={tokenPresent}>
      {children}
    </DashboardAuthProvider>
  );
}
