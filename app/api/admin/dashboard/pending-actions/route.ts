import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../../_common";

export async function GET(request: NextRequest) {
  return proxyAuthenticatedBackendRoute(request, {
    method: "GET",
    backendPath: "/admin-dashboard/pending-actions",
  });
}
