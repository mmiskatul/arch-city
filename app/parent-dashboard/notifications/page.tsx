import { NotificationsCenterPage } from "@/components/notifications-center-page";
import { ParentShell } from "@/components/parent/parent-shell";

export default function ParentNotificationsPage() {
  return <NotificationsCenterPage role="parent" Shell={ParentShell} />;
}
