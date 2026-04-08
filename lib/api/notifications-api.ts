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
  return `${baseUrl()}/${role}/notifications`;
}

export async function getNotifications(role: NotificationRole) {
  return browserApiRequest<NotificationListResponse>({ url: rolePath(role), method: "GET" });
}

export async function getNotificationCount(role: NotificationRole) {
  return browserApiRequest<NotificationCountResponse>({ url: `${rolePath(role)}/count`, method: "GET" });
}

export async function markNotificationsRead(role: NotificationRole, payload: NotificationReadRequest) {
  return browserApiRequest<NotificationCountResponse>({
    url: `${rolePath(role)}/read`,
    method: "PUT",
    data: payload,
  });
}
