import { NotificationPreferencesPanel } from "@/components/settings/notification-preferences-panel";
import { StudentSettingsSubrouteLayout } from "@/components/student/student-settings-subroute-layout";

const options = [
  { key: "email_session_reminders", label: "Email - Session Reminders" },
  { key: "email_booking_confirmations", label: "Email - Booking Confirmations" },
  { key: "email_new_messages", label: "Email - New Messages" },
  { key: "in_app_notifications", label: "In-App Notifications" },
];

export default function Page() {
  return (
    <StudentSettingsSubrouteLayout title="Notification Preferences">
      <NotificationPreferencesPanel options={options} />
    </StudentSettingsSubrouteLayout>
  );
}
