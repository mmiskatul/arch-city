import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../_common";

export async function GET(request: NextRequest) {
  const rawView = request.nextUrl.searchParams.get("view");
  const view = rawView === "all" || rawView === "rejected" ? rawView : "pending";
  const backendPath =
    view === "all"
      ? "/admin-dashboard/tutor-applications/all"
      : view === "rejected"
        ? "/admin-dashboard/tutor-applications/rejected"
        : "/admin-dashboard/tutor-applications/pending";

  return proxyAuthenticatedBackendRoute(request, {
    method: "GET",
    backendPath,
  });
}
