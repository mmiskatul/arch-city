import "server-only";

import { cookies, headers } from "next/headers";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

async function resolveOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) {
    throw new Error("Unable to resolve request host.");
  }

  const proto = (headerStore.get("x-forwarded-proto") ?? "http").split(",")[0].trim() || "http";
  return `${proto}://${host}`;
}

async function resolveCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function proxyApiGet<T>(path: string): Promise<T> {
  const origin = await resolveOrigin();
  const response = await fetch(`${origin}${normalizePath(path)}`, {
    method: "GET",
    headers: {
      Cookie: await resolveCookieHeader(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Proxy API failed (${response.status}).`);
  }

  return response.json() as Promise<T>;
}
