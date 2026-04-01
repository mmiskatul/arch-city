import { NextRequest, NextResponse } from "next/server";

import { configurationErrorResponse, getAdminToken, resolveApiBaseUrl, unauthorizedResponse } from "../_common";

export async function GET(request: NextRequest) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) return configurationErrorResponse();

  const token = getAdminToken(request);
  if (!token) return unauthorizedResponse();

  const response = await fetch(`${baseUrl}/admin-dashboard/settings/privacy-policy`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request: NextRequest) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) return configurationErrorResponse();

  const token = getAdminToken(request);
  if (!token) return unauthorizedResponse();

  const body = await request.json().catch(() => ({}));
  const response = await fetch(`${baseUrl}/admin-dashboard/settings/privacy-policy`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
