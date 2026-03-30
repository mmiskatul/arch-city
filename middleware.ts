import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_ROUTE = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin-dashboard")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("arch_access_token")?.value ?? "";
  const role = (request.cookies.get("arch_user_role")?.value ?? "").toLowerCase();

  if (token && role === "admin") {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = LOGIN_ROUTE;
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};
