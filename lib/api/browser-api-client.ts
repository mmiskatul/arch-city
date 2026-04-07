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
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") {
      return status;
    }
  }

  if (axios.isAxiosError(error)) {
    return error.response?.status ?? 500;
  }

  return 500;
}

function getMessageFromError(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) {
      return data.trim();
    }
    if (typeof data === "object" && data !== null) {
      const detail = (data as { detail?: unknown; message?: unknown }).detail ?? (data as { message?: unknown }).message;
      if (typeof detail === "string" && detail.trim()) {
        return detail.trim();
      }
    }
  }

  return "";
}

function setBrowserCookie(name: string, value: string, maxAgeSeconds: number) {
  const secureSuffix =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secureSuffix}`;
}

function clearBrowserCookie(name: string) {
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${name}=; Path=/; Expires=${expired}; Max-Age=0; SameSite=Lax`;
}

function persistSessionCookies(data: unknown) {
  if (typeof window === "undefined" || !data || typeof data !== "object") return false;

  const record = data as Record<string, unknown>;
  const accessToken = typeof record.access_token === "string" ? record.access_token : "";
  const refreshToken = typeof record.refresh_token === "string" ? record.refresh_token : "";
  const role = typeof record.role === "string" ? record.role.trim().toLowerCase() : "";

  if (!accessToken || !refreshToken || !role) {
    return false;
  }

  const accessAge = 60 * 60 * 24 * 7;
  const refreshAge = 60 * 60 * 24 * 30;
  setBrowserCookie("arch_access_token", accessToken, accessAge);
  setBrowserCookie("arch_refresh_token", refreshToken, refreshAge);
  setBrowserCookie("arch_user_role", role, refreshAge);
  window.dispatchEvent(new Event("arch-session-updated"));
  return true;
}

async function refreshBrowserSession(): Promise<boolean> {
  const baseUrl = resolveBrowserApiBaseUrl();
  if (!baseUrl || typeof window === "undefined") return false;

  const refreshToken = readBrowserCookie("arch_refresh_token");
  if (!refreshToken) return false;

  try {
    const response = await axios.request<unknown>({
      url: `${baseUrl}/auth/refresh`,
      method: "POST",
      data: { refresh_token: refreshToken },
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    return persistSessionCookies(response.data);
  } catch {
    clearBrowserCookie("arch_access_token");
    clearBrowserCookie("arch_refresh_token");
    clearBrowserCookie("arch_user_role");
    window.dispatchEvent(new Event("arch-session-updated"));
    return false;
  }
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
    const message = getMessageFromError(error) || (axios.isAxiosError(error) && !error.response ? error.message : "");
    if (status === 401 && includeAuth && typeof window !== "undefined") {
      const refreshed = await refreshBrowserSession();
      if (refreshed) {
        requestHeaders.Authorization = `Bearer ${readBrowserCookie("arch_access_token")}`;
        const retryResponse = await axios.request<TResponse>({
          url,
          method,
          data,
          headers: requestHeaders,
          withCredentials,
          timeout,
        });

        return retryResponse.data;
      }
    }
    const apiError = new Error(message ? `${message}` : status === 0 ? "Network Error" : `API failed (${status}).`) as Error & { status?: number };
    apiError.status = status;
    throw apiError;
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

  if (response.status === 401 && includeAuth && typeof window !== "undefined") {
    const refreshed = await refreshBrowserSession();
    if (refreshed) {
      requestHeaders.Authorization = `Bearer ${readBrowserCookie("arch_access_token")}`;
      const retry = await axios.request<TResponse>({
        url,
        method,
        data,
        headers: requestHeaders,
        withCredentials,
        timeout,
        validateStatus: () => true,
      });
      return {
        ok: retry.status >= 200 && retry.status < 300,
        status: retry.status,
        json: async () => retry.data,
        text: async () => {
          if (typeof retry.data === "string") {
            return retry.data;
          }

          try {
            return JSON.stringify(retry.data);
          } catch {
            return "";
          }
        },
      };
    }
  }

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
