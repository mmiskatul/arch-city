import { NextRequest, NextResponse } from "next/server";

export function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

export function getAdminToken(request: NextRequest) {
  return request.cookies.get("arch_access_token")?.value ?? null;
}

export function unauthorizedResponse() {
  return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
}

export function configurationErrorResponse() {
  return NextResponse.json({ detail: "NEXT_PUBLIC_API_BASE_URL is not configured." }, { status: 500 });
}
