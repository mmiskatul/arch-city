import { NextRequest } from "next/server";

import { proxyAuthenticatedBackendRoute } from "../../_common";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyAuthenticatedBackendRoute(request, {
    method: "GET",
    backendPath: `/tutor/schedule/${encodeURIComponent(id)}`,
  });
}
