import "server-only";

import axios, { AxiosError, type Method } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

export function formatApiError(error: unknown, fallbackStatus = 500): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? fallbackStatus;
    if (status === 401 || status === 403) {
      redirect("/login");
    }
    throw new Error(`API failed (${status}).`);
  }

  throw error instanceof Error ? error : new Error(`API failed (${fallbackStatus}).`);
}

type ServerRequestOptions<TData = unknown> = {
  path: string;
  method?: Method;
  data?: TData;
  headers?: Record<string, string>;
  timeout?: number;
};

export async function apiRequest<TResponse = unknown, TData = unknown>({
  path,
  method = "GET",
  data,
  headers,
  timeout = 30000,
}: ServerRequestOptions<TData>): Promise<TResponse> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = (await cookies()).get("arch_access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  try {
    const response = await axios.request<TResponse>({
      url: `${baseUrl}${path}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(headers ?? {}),
      },
      withCredentials: true,
      timeout,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? 500;
    if (status === 401 || status === 403) {
      redirect("/login");
    }
    throw new Error(`API failed (${status}).`);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>({ path, method: "GET" });
}

export async function apiPost<TResponse = unknown, TData = unknown>(path: string, data?: TData): Promise<TResponse> {
  return apiRequest<TResponse, TData>({ path, method: "POST", data });
}

export async function apiPut<TResponse = unknown, TData = unknown>(path: string, data?: TData): Promise<TResponse> {
  return apiRequest<TResponse, TData>({ path, method: "PUT", data });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>({ path, method: "DELETE" });
}
