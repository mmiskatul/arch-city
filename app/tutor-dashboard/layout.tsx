import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardAuthProvider } from "@/components/auth/dashboard-auth-context";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE, isDashboardAccessibleForRole } from "@/lib/admin-preview";

export default async function TutorDashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const tokenPresent = Boolean(cookieStore.get("arch_access_token")?.value);
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? null;
  if (!tokenPresent || !isDashboardAccessibleForRole("tutor", role, previewRole)) {
    redirect("/login?redirect=/tutor-dashboard");
  }

  return (
    <DashboardAuthProvider
      dashboard="tutor"
      initialRole={role}
      initialPreviewRole={previewRole}
      initialPreviewTargetId={previewTargetId}
      initialTokenPresent={tokenPresent}
    >
      {children}
    </DashboardAuthProvider>
  );
}
