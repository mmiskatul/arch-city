import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

export type NotificationRole = "admin" | "student" | "tutor" | "parent";

export type NotificationActionType = "review" | "investigate" | "view" | "none";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time_label: string;
  category: string;
  unread: boolean;
  section: "new" | "earlier";
  action: NotificationActionType;
  href: string;
  created_at?: string;
};

export type NotificationListResponse = {
  items: NotificationItem[];
  unread_count: number;
  total_notifications: number;
};

export type NotificationCountResponse = {
  unread_count: number;
  total_notifications: number;
};

export type NotificationReadRequest = {
  notification_ids?: string[];
  mark_all?: boolean;
};

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return value;
}

function rolePath(role: NotificationRole) {
  if (role === "admin") return `${baseUrl()}/admin-dashboard/notifications`;
  if (role === "tutor") return "/api/tutor/notifications";
  return `${baseUrl()}/${role}/notifications`;
}

function tutorNotificationUrls(pathSuffix = "") {
  const backendBaseUrl = baseUrl();
  return [`${backendBaseUrl}/tutor/notifications${pathSuffix}`, `/api/tutor/notifications${pathSuffix}`];
}

async function requestWithFallback<TResponse, TData = unknown>({
  urls,
  method,
  data,
}: {
  urls: string[];
  method: "GET" | "POST" | "PUT";
  data?: TData;
}) {
  let lastError: unknown;

  for (const url of urls) {
    try {
      return await browserApiRequest<TResponse, TData>({ url, method, data });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("API request failed.");
}

export async function getNotifications(role: NotificationRole) {
  if (role === "tutor") {
    return requestWithFallback<NotificationListResponse>({
      urls: tutorNotificationUrls(),
      method: "GET",
    });
  }

  return browserApiRequest<NotificationListResponse>({ url: rolePath(role), method: "GET" });
}

export async function getNotificationCount(role: NotificationRole) {
  if (role === "tutor") {
    return requestWithFallback<NotificationCountResponse>({
      urls: tutorNotificationUrls("/count"),
      method: "GET",
    });
  }

  return browserApiRequest<NotificationCountResponse>({ url: `${rolePath(role)}/count`, method: "GET" });
}

export async function markNotificationsRead(role: NotificationRole, payload: NotificationReadRequest) {
  if (role === "tutor") {
    return requestWithFallback<NotificationCountResponse, NotificationReadRequest>({
      urls: tutorNotificationUrls("/read"),
      method: "PUT",
      data: payload,
    });
  }

  return browserApiRequest<NotificationCountResponse>({
    url: `${rolePath(role)}/read`,
    method: "PUT",
    data: payload,
  });
}
