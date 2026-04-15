import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";
import {
  mapParentDashboardOverview,
  type ParentDashboardOverview,
  type ParentDashboardOverviewApiResponse,
} from "@/lib/api/parent-dashboard-types";

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return value;
}

export async function getParentDashboardOverview(): Promise<ParentDashboardOverview> {
  const data = await browserApiRequest<ParentDashboardOverviewApiResponse>({
    url: `${baseUrl()}/parent/dashboard/overview`,
    method: "GET",
  });

  return mapParentDashboardOverview(data);
}
