import { cookies } from "next/headers";

import {
  AdminDashboardPage,
  defaultAdminDashboardOverviewData,
  type AdminDashboardOverviewData,
} from "@/components/admin/admin-dashboard-page";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

async function fetchAdminDashboardOverview(): Promise<{
  data: AdminDashboardOverviewData;
  loadError?: string;
}> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    return {
      data: defaultAdminDashboardOverviewData,
      loadError: "NEXT_PUBLIC_API_BASE_URL is not configured. Showing fallback data.",
    };
  }

  const token = (await cookies()).get("arch_access_token")?.value;
  if (!token) {
    return {
      data: defaultAdminDashboardOverviewData,
      loadError: "Missing admin session token. Showing fallback data.",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/admin-dashboard/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: defaultAdminDashboardOverviewData,
        loadError: `Dashboard API failed (${response.status}). Showing fallback data.`,
      };
    }

    const data = (await response.json()) as AdminDashboardOverviewData;
    return { data };
  } catch {
    return {
      data: defaultAdminDashboardOverviewData,
      loadError: "Dashboard API request failed. Showing fallback data.",
    };
  }
}

export default async function AdminDashboardRoute() {
  const { data, loadError } = await fetchAdminDashboardOverview();
  return <AdminDashboardPage data={data} loadError={loadError} />;
}
