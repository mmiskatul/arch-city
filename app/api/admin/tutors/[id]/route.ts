import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../../_common";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyAuthenticatedBackendRoute(request, {
    method: "GET",
    backendPath: `/admin-dashboard/tutors/${encodeURIComponent(id)}`,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action = String(body?.action || "").toLowerCase();

  const backendPath =
    action === "unsuspend"
      ? `/admin-dashboard/tutors/${encodeURIComponent(id)}/unsuspend`
      : `/admin-dashboard/tutors/${encodeURIComponent(id)}/suspend`;

  const payload =
    action === "unsuspend"
      ? {}
      : {
          reason: typeof body?.reason === "string" ? body.reason : "",
          until: body?.until ?? null,
        };

  return proxyAuthenticatedBackendRoute(request, {
    method: "PATCH",
    backendPath,
    body: payload,
  });
}
