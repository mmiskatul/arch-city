import axios, { type Method } from "axios";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function resolveBrowserApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

export function readBrowserCookie(name: string) {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : "";
}

function getStatusFromError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? 500;
  }

  return 500;
}

type BrowserRequestOptions<TData = unknown> = {
  url: string;
  method?: Method;
  data?: TData;
  headers?: Record<string, string>;
  includeAuth?: boolean;
  withCredentials?: boolean;
  timeout?: number;
};

export async function browserApiRequest<TResponse = unknown, TData = unknown>({
  url,
  method = "GET",
  data,
  headers,
  includeAuth = true,
  withCredentials = false,
  timeout = 30000,
}: BrowserRequestOptions<TData>): Promise<TResponse> {
  const requestHeaders: Record<string, string> = {
    ...(headers ?? {}),
  };

  if (data !== undefined && requestHeaders["Content-Type"] === undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (includeAuth) {
    const token = readBrowserCookie("arch_access_token");
    if (token && requestHeaders.Authorization === undefined) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await axios.request<TResponse>({
      url,
      method,
      data,
      headers: requestHeaders,
      withCredentials,
      timeout,
    });

    return response.data;
  } catch (error) {
    const status = getStatusFromError(error);
    throw new Error(`API failed (${status}).`);
  }
}

export async function browserApiRequestWithFallback<TResponse = unknown, TData = unknown>({
  urls,
  method = "GET",
  data,
  headers,
  includeAuth = true,
  withCredentials = false,
  timeout = 30000,
}: {
  urls: string[];
  method?: Method;
  data?: TData;
  headers?: Record<string, string>;
  includeAuth?: boolean;
  withCredentials?: boolean;
  timeout?: number;
}): Promise<TResponse> {
  let lastError: unknown;

  for (const url of urls) {
    try {
      return await browserApiRequest<TResponse, TData>({
        url,
        method,
        data,
        headers,
        includeAuth,
        withCredentials,
        timeout,
      });
    } catch (error) {
      lastError = error;
      const status = getStatusFromError(error);
      if (![404, 405, 422, 501].includes(status)) {
        throw error;
      }
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("API request failed.");
}

export async function browserApiRequestRaw<TResponse = unknown, TData = unknown>({
  url,
  method = "GET",
  data,
  headers,
  includeAuth = true,
  withCredentials = false,
  timeout = 30000,
}: BrowserRequestOptions<TData>): Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<TResponse>;
  text: () => Promise<string>;
}> {
  const requestHeaders: Record<string, string> = {
    ...(headers ?? {}),
  };

  if (data !== undefined && requestHeaders["Content-Type"] === undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (includeAuth) {
    const token = readBrowserCookie("arch_access_token");
    if (token && requestHeaders.Authorization === undefined) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await axios.request<TResponse>({
    url,
    method,
    data,
    headers: requestHeaders,
    withCredentials,
    timeout,
    validateStatus: () => true,
  });

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    json: async () => response.data,
    text: async () => {
      if (typeof response.data === "string") {
        return response.data;
      }

      try {
        return JSON.stringify(response.data);
      } catch {
        return "";
      }
    },
  };
}
