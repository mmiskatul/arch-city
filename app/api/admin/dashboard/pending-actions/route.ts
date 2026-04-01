import { NextRequest, NextResponse } from "next/server";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

export async function GET(request: NextRequest) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ detail: "NEXT_PUBLIC_API_BASE_URL is not configured." }, { status: 500 });
  }

  const token = request.cookies.get("arch_access_token")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${baseUrl}/admin-dashboard/pending-actions`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
