import { getNotificationsForRole, type NotificationItem, type NotificationRole } from "@/lib/notifications-data";

const STORAGE_PREFIX = "arch-notifications-read:";
export const NOTIFICATIONS_UPDATED_EVENT = "arch-notifications-updated";

function getStorageKey(role: NotificationRole) {
  return `${STORAGE_PREFIX}${role}`;
}

function safeReadStorage(role: NotificationRole) {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(getStorageKey(role));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function safeWriteStorage(role: NotificationRole, ids: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getStorageKey(role), JSON.stringify(ids));
  } catch {
    // Ignore storage failures.
  }
}

export function getNotificationItems(role: NotificationRole): NotificationItem[] {
  const readIds = new Set(safeReadStorage(role));
  return getNotificationsForRole(role).map((item) => ({
    ...item,
    unread: !readIds.has(item.id) && item.unread,
  }));
}

export function getUnreadNotificationCount(role: NotificationRole): number {
  return getNotificationItems(role).filter((item) => item.unread).length;
}

export function markAllNotificationsRead(role: NotificationRole) {
  const items = getNotificationsForRole(role);
  safeWriteStorage(role, items.map((item) => item.id));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  }
}

export function syncNotificationsReadState(role: NotificationRole, ids: string[]) {
  safeWriteStorage(role, ids);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
  }
}
