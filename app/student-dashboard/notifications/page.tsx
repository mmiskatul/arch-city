import { NotificationsCenterPage } from "@/components/notifications-center-page";
import { StudentShell } from "@/components/student/student-shell";

export default function StudentNotificationsPage() {
  return <NotificationsCenterPage role="student" Shell={StudentShell} />;
}
