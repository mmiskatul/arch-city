import { NotificationPreferencesPanel } from "@/components/settings/notification-preferences-panel";

const options = [
  { key: "email_session_reminders", label: "Email - Session Reminders" },
  { key: "email_booking_confirmations", label: "Email - Booking Confirmations" },
  { key: "email_new_messages", label: "Email - New Messages" },
  { key: "in_app_notifications", label: "In-App Notifications" },
];

export default function Page() {
  return <NotificationPreferencesPanel options={options} />;
}
