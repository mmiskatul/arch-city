import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../_common";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = new URLSearchParams();
  const statusFilter = params.get("status_filter");
  if (statusFilter) q.set("status_filter", statusFilter);

  return proxyAuthenticatedBackendRoute(request, {
    method: "GET",
    backendPath: `/admin-dashboard/tutors${q.toString() ? `?${q.toString()}` : ""}`,
  });
}
