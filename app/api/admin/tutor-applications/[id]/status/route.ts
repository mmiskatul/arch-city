import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../../../_common";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  return proxyAuthenticatedBackendRoute(request, {
    method: "PATCH",
    backendPath: `/admin-dashboard/tutor-applications/${encodeURIComponent(id)}/status`,
    body,
  });
}
