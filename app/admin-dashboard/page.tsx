import {
  AdminDashboardPage,
  defaultAdminDashboardOverviewData,
  type AdminDashboardOverviewData,
} from "@/components/admin/admin-dashboard-page";
import { apiGet } from "@/lib/api/api-client";

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

async function fetchAdminDashboardOverview(): Promise<AdminDashboardOverviewData> {
  const payload = await apiGet<AdminDashboardOverviewData>("/admin-dashboard/overview");
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
