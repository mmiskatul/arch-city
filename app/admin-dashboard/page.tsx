import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AdminDashboardPage,
  defaultAdminDashboardOverviewData,
  type AdminDashboardOverviewData,
} from "@/components/admin/admin-dashboard-page";

type DashboardSummaryCard = AdminDashboardOverviewData["summary_cards"][number];
type DashboardSummaryResponse = {
  data: DashboardSummaryCard[];
};

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

async function fetchAdminDashboardSummary(): Promise<DashboardSummaryCard[]> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = (await cookies()).get("arch_access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${baseUrl}/admin-dashboard/summary`, {
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
    throw new Error(`Dashboard summary API failed (${response.status}).`);
  }

  const payload = (await response.json()) as DashboardSummaryResponse;
  return payload.data;
}

export default async function AdminDashboardRoute() {
  let summaryCards = defaultAdminDashboardOverviewData.summary_cards;

  try {
    summaryCards = await fetchAdminDashboardSummary();
  } catch {
    // Keep fallback summary cards when summary endpoint is temporarily unavailable.
  }

  const initialData: AdminDashboardOverviewData = {
    ...defaultAdminDashboardOverviewData,
    today_label: todayLabel(),
    summary_cards: summaryCards,
    recent_sessions: [],
    pending_actions: [],
    top_tutors_this_month: [],
  };

  return <AdminDashboardPage data={initialData} lazySections />;
}
