import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AdminDashboardPage,
  type AdminDashboardOverviewData,
} from "@/components/admin/admin-dashboard-page";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

async function fetchAdminDashboardOverview(): Promise<AdminDashboardOverviewData> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = (await cookies()).get("arch_access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${baseUrl}/admin-dashboard/overview`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Dashboard API failed (${response.status}).`);
  }

  return (await response.json()) as AdminDashboardOverviewData;
}

export default async function AdminDashboardRoute() {
  const data = await fetchAdminDashboardOverview();
  return <AdminDashboardPage data={data} />;
}
