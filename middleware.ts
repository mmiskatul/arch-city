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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestedRole = requestedDashboardRole(pathname);

  if (!requestedRole) {
    return NextResponse.next();
  }

  const token = request.cookies.get("arch_access_token")?.value ?? "";
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_ROUTE;
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const tokenRole = roleFromAccessToken(token);
  const cookieRole = (request.cookies.get("arch_user_role")?.value ?? "").toLowerCase();
  const effectiveRole = tokenRole || cookieRole;

  if (!effectiveRole) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_ROUTE;
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (effectiveRole === requestedRole) {
    return NextResponse.next();
  }

  const redirectPath = dashboardByRole[effectiveRole as UserRole];
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
