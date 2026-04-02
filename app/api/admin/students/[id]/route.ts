import { NextRequest, NextResponse } from "next/server";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ detail: "NEXT_PUBLIC_API_BASE_URL is not configured." }, { status: 500 });
  }

  const token = request.cookies.get("arch_access_token")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const response = await fetch(`${baseUrl}/admin-dashboard/students/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ detail: "NEXT_PUBLIC_API_BASE_URL is not configured." }, { status: 500 });
  }

  const token = request.cookies.get("arch_access_token")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action = String(body?.action || "").toLowerCase();

  const backendPath =
    action === "unsuspend"
      ? `/admin-dashboard/students/${encodeURIComponent(id)}/unsuspend`
      : `/admin-dashboard/students/${encodeURIComponent(id)}/suspend`;

  const payload =
    action === "unsuspend"
      ? {}
      : {
          reason: typeof body?.reason === "string" ? body.reason : "",
          until: body?.until ?? null,
        };

  const response = await fetch(`${baseUrl}${backendPath}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
