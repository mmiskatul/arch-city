import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SignupPage } from "@/components/auth/signup-page";
import {
  ADMIN_DASHBOARD_ROUTE,
  PARENT_DASHBOARD_ROUTE,
  STUDENT_DASHBOARD_ROUTE,
  TUTOR_DASHBOARD_ROUTE,
} from "@/lib/routes";

function dashboardRouteForRole(role: string | null) {
  switch (role) {
    case "admin":
      return ADMIN_DASHBOARD_ROUTE;
    case "student":
      return STUDENT_DASHBOARD_ROUTE;
    case "parent":
      return PARENT_DASHBOARD_ROUTE;
    case "tutor":
      return TUTOR_DASHBOARD_ROUTE;
    default:
      return null;
  }
}

export default async function Page() {
  const cookieStore = await cookies();
  const tokenPresent = Boolean(cookieStore.get("arch_access_token")?.value);
  const role = cookieStore.get("arch_user_role")?.value?.toLowerCase() ?? null;
  const dashboardRoute = tokenPresent ? dashboardRouteForRole(role) : null;

  if (dashboardRoute) {
    redirect(dashboardRoute);
  }

  return <SignupPage />;
}
