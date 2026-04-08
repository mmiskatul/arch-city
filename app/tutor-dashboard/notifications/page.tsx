import { NotificationsCenterPage } from "@/components/notifications-center-page";
import { TutorShell } from "@/components/tutor/tutor-shell";

export default function TutorNotificationsPage() {
  return <NotificationsCenterPage role="tutor" Shell={TutorShell} />;
}
