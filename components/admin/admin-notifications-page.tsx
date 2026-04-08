import { AdminShell } from "@/components/admin/admin-shell";
import { NotificationsCenterPage } from "@/components/notifications-center-page";

export function AdminNotificationsPage() {
  return <NotificationsCenterPage role="admin" Shell={AdminShell} />;
}
