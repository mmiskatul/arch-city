import { ParentSettingsSubrouteLayout } from "@/components/parent/parent-settings-subroute-layout";
import { NotificationPreferencesPanel } from "@/components/settings/notification-preferences-panel";

const options = [
  { key: "email_booking_updates", label: "Email - Booking Updates" },
  { key: "email_tutor_messages", label: "Email - Tutor Messages" },
  { key: "sms_session_reminders", label: "SMS - Session Reminders" },
  { key: "in_app_notifications", label: "In-App Notifications" },
];

export default function Page() {
  return (
    <ParentSettingsSubrouteLayout title="Notification Preferences">
      <NotificationPreferencesPanel options={options} />
    </ParentSettingsSubrouteLayout>
  );
}
