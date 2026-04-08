import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "arch_access_token";
const REFRESH_COOKIE = "arch_refresh_token";
const ROLE_COOKIE = "arch_user_role";

const ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

export function configurationErrorResponse() {
  return NextResponse.json({ detail: "NEXT_PUBLIC_API_BASE_URL is not configured." }, { status: 500 });
}

export function unauthorizedResponse() {
  return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
}

type SessionTokens = {
  access_token?: string;
  refresh_token?: string;
  role?: string;
};

function setSessionCookies(response: NextResponse, data: SessionTokens) {
  const accessToken = String(data.access_token || "").trim();
  const refreshToken = String(data.refresh_token || "").trim();
  const role = String(data.role || "").trim().toLowerCase();

  if (accessToken) {
    response.cookies.set(ACCESS_COOKIE, accessToken, {
      path: "/",
      sameSite: "lax",
      maxAge: ACCESS_MAX_AGE_SECONDS,
    });
  }
  if (refreshToken) {
    response.cookies.set(REFRESH_COOKIE, refreshToken, {
      path: "/",
      sameSite: "lax",
      maxAge: REFRESH_MAX_AGE_SECONDS,
    });
  }
  if (role) {
    response.cookies.set(ROLE_COOKIE, role, {
      path: "/",
      sameSite: "lax",
      maxAge: REFRESH_MAX_AGE_SECONDS,
    });
  }
}

async function refreshSession(request: NextRequest) {
  const baseUrl = resolveApiBaseUrl();
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value ?? "";
  if (!baseUrl || !refreshToken) return null;

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json().catch(() => ({}))) as SessionTokens;
    if (!data.access_token || !data.refresh_token || !data.role) return null;
    return data;
  } catch {
    return null;
  }
}

function applyResponseCookies(response: NextResponse, session: SessionTokens | null) {
  if (session) {
    setSessionCookies(response, session);
  }
  return response;
}

async function nextResponseFromBackend(backendResponse: Response, session: SessionTokens | null = null) {
  const data = await backendResponse.json().catch(() => ({}));
  return applyResponseCookies(NextResponse.json(data, { status: backendResponse.status }), session);
}

type ProxyAuthenticatedBackendRouteOptions = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  backendPath: string;
  body?: unknown;
  headers?: Record<string, string>;
};

async function sendBackendRequest(
  baseUrl: string,
  token: string,
  { method, backendPath, body, headers }: ProxyAuthenticatedBackendRouteOptions,
) {
  const requestHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(headers ?? {}),
  };

  if (body !== undefined && requestHeaders["Content-Type"] === undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  return fetch(`${baseUrl}${normalizePath(backendPath)}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}

export async function proxyAuthenticatedBackendRoute(
  request: NextRequest,
  options: ProxyAuthenticatedBackendRouteOptions,
) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    return configurationErrorResponse();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value ?? "";
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value ?? "";

  if (!accessToken) {
    if (!refreshToken) {
      return unauthorizedResponse();
    }

    const refreshed = await refreshSession(request);
    if (!refreshed?.access_token) {
      return unauthorizedResponse();
    }

    const backendResponse = await sendBackendRequest(baseUrl, refreshed.access_token, options);
    return nextResponseFromBackend(backendResponse, refreshed);
  }

  const backendResponse = await sendBackendRequest(baseUrl, accessToken, options);
  if (backendResponse.status !== 401 && backendResponse.status !== 403) {
    return nextResponseFromBackend(backendResponse);
  }

  if (!refreshToken) {
    return nextResponseFromBackend(backendResponse);
  }

  const refreshed = await refreshSession(request);
  if (!refreshed?.access_token) {
    return nextResponseFromBackend(backendResponse);
  }

  const retryResponse = await sendBackendRequest(baseUrl, refreshed.access_token, options);
  return nextResponseFromBackend(retryResponse, refreshed);
}
