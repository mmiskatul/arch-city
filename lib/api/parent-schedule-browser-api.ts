import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";
import {
  mapParentScheduleResponse,
  type ParentSessionHistoryResponse,
  type ParentSessionHistoryResponseApi,
} from "@/lib/api/parent-schedule-types";

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return value;
}

export async function getParentScheduleItems(): Promise<ParentSessionHistoryResponse> {
  const data = await browserApiRequest<ParentSessionHistoryResponseApi>({
    url: `${baseUrl()}/parent/schedule`,
    method: "GET",
  });

  return mapParentScheduleResponse(data);
}
