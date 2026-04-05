import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_ROUTE = "/login";

type UserRole = "admin" | "student" | "parent" | "tutor";

const dashboardByRole: Record<UserRole, string> = {
  admin: "/admin-dashboard",
  student: "/student-dashboard",
  parent: "/parent-dashboard",
  tutor: "/tutor-dashboard",
};

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function roleFromAccessToken(token: string): string {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return "";

    const payloadJson = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadJson) as { role?: unknown };
    return typeof payload.role === "string" ? payload.role.toLowerCase() : "";
  } catch {
    return "";
  }
}

function requestedDashboardRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin-dashboard")) return "admin";
  if (pathname.startsWith("/student-dashboard")) return "student";
  if (pathname.startsWith("/parent-dashboard")) return "parent";
  if (pathname.startsWith("/tutor-dashboard")) return "tutor";
  return null;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? (url.endsWith("/") ? url.slice(0, -1) : url) : null;
}

function setSessionCookies(response: NextResponse, data: { access_token?: string; refresh_token?: string; role?: string }) {
  const accessToken = String(data.access_token || "").trim();
  const refreshToken = String(data.refresh_token || "").trim();
  const role = String(data.role || "").trim().toLowerCase();
  const accessAge = 60 * 60 * 24 * 7;
  const refreshAge = 60 * 60 * 24 * 30;

  if (accessToken) {
    response.cookies.set("arch_access_token", accessToken, { path: "/", sameSite: "lax", maxAge: accessAge });
  }
  if (refreshToken) {
    response.cookies.set("arch_refresh_token", refreshToken, { path: "/", sameSite: "lax", maxAge: refreshAge });
  }
  if (role) {
    response.cookies.set("arch_user_role", role, { path: "/", sameSite: "lax", maxAge: refreshAge });
  }
}

async function refreshSession(request: NextRequest) {
  const baseUrl = resolveApiBaseUrl();
  const refreshToken = request.cookies.get("arch_refresh_token")?.value ?? "";
  if (!baseUrl || !refreshToken) return null;

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json().catch(() => ({}))) as {
      access_token?: string;
      refresh_token?: string;
      role?: string;
    };

    if (!data.access_token || !data.refresh_token || !data.role) return null;
    return data;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestedRole = requestedDashboardRole(pathname);

  if (!requestedRole) {
    return NextResponse.next();
  }

  const token = request.cookies.get("arch_access_token")?.value ?? "";
  const cookieRole = (request.cookies.get("arch_user_role")?.value ?? "").toLowerCase();
  const tokenRole = token ? roleFromAccessToken(token) : "";
  const tokenValid = Boolean(token && cookieRole && tokenRole && tokenRole === cookieRole);

  if (!tokenValid) {
    const refreshed = await refreshSession(request);
    if (!refreshed) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = LOGIN_ROUTE;
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const refreshedRole = String(refreshed.role || "").toLowerCase() as UserRole;
    const destinationPath =
      refreshedRole === requestedRole ? pathname : dashboardByRole[refreshedRole] || LOGIN_ROUTE;
    const destination = request.nextUrl.clone();
    destination.pathname = destinationPath;
    destination.search = "";
    const response = NextResponse.redirect(destination);
    setSessionCookies(response, refreshed);
    return response;
  }

  if (cookieRole === requestedRole) {
    return NextResponse.next();
  }

  const redirectPath = dashboardByRole[cookieRole as UserRole];
  if (redirectPath) {
    const destination = request.nextUrl.clone();
    destination.pathname = redirectPath;
    destination.search = "";
    return NextResponse.redirect(destination);
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = LOGIN_ROUTE;
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/student-dashboard/:path*",
    "/parent-dashboard/:path*",
    "/tutor-dashboard/:path*",
  ],
};
