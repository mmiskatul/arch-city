import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../_common";

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return proxyAuthenticatedBackendRoute(request, {
    method: "PUT",
    backendPath: "/admin-dashboard/settings/password",
    body,
  });
}
