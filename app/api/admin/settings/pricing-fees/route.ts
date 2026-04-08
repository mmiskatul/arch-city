import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../_common";

export async function GET(request: NextRequest) {
  return proxyAuthenticatedBackendRoute(request, {
    method: "GET",
    backendPath: "/admin-dashboard/settings/pricing-fees",
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return proxyAuthenticatedBackendRoute(request, {
    method: "PUT",
    backendPath: "/admin-dashboard/settings/pricing-fees",
    body,
  });
}
