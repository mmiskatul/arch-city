import { NotificationPreferencesPanel } from "@/components/settings/notification-preferences-panel";

const options = [
  { key: "email_new_booking_requests", label: "Email - New Booking Requests" },
  { key: "email_student_messages", label: "Email - Student Messages" },
  { key: "sms_session_reminders", label: "SMS - Session Reminders" },
  { key: "in_app_notifications", label: "In-App Notifications" },
];

export default function Page() {
  return <NotificationPreferencesPanel options={options} scope="tutor" />;
}
