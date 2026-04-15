import { apiGet } from "@/lib/api/api-client";
import {
  mapParentDashboardOverview,
  type ParentDashboardOverview,
  type ParentDashboardOverviewApiResponse,
} from "@/lib/api/parent-dashboard-types";

export async function fetchParentDashboardOverview(): Promise<ParentDashboardOverview> {
  const data = await apiGet<ParentDashboardOverviewApiResponse>("/parent/dashboard/overview");
  return mapParentDashboardOverview(data);
}
