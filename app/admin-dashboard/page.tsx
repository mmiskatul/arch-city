import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
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
    throw new Error(`Dashboard overview API failed (${response.status}).`);
  }

  const payload = (await response.json()) as AdminDashboardOverviewData;
  if (!payload || !Array.isArray(payload.summary_cards)) {
    return defaultAdminDashboardOverviewData;
  }

  return {
    ...defaultAdminDashboardOverviewData,
    ...payload,
    summary_cards: payload.summary_cards,
    recent_sessions: Array.isArray(payload.recent_sessions) ? payload.recent_sessions : [],
    pending_actions: Array.isArray(payload.pending_actions) ? payload.pending_actions : [],
    top_tutors_this_month: Array.isArray(payload.top_tutors_this_month) ? payload.top_tutors_this_month : [],
  };
}

export default async function AdminDashboardRoute() {
  let initialData: AdminDashboardOverviewData = {
    ...defaultAdminDashboardOverviewData,
    today_label: todayLabel(),
  };

  try {
    const overview = await fetchAdminDashboardOverview();
    initialData = {
      ...initialData,
      ...overview,
      // Keep section placeholders for client-side section skeleton reload.
      recent_sessions: [],
      pending_actions: [],
      top_tutors_this_month: overview.top_tutors_this_month,
    };
  } catch {
    // Keep fallback overview when backend is temporarily unavailable.
  }

  return <AdminDashboardPage data={initialData} lazySections />;
}
