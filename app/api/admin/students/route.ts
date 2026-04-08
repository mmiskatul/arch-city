import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../_common";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = new URLSearchParams();
  const statusFilter = params.get("status_filter");
  const gradeFilter = params.get("grade_filter");
  if (statusFilter) q.set("status_filter", statusFilter);
  if (gradeFilter) q.set("grade_filter", gradeFilter);

  return proxyAuthenticatedBackendRoute(request, {
    method: "GET",
    backendPath: `/admin-dashboard/students${q.toString() ? `?${q.toString()}` : ""}`,
  });
}
