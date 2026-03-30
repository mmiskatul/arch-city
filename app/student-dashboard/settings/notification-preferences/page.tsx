import { StudentSettingsSubrouteLayout } from "@/components/student/student-settings-subroute-layout";

export default function Page() {
  return (
    <StudentSettingsSubrouteLayout title="Notification Preferences">
      <div className="space-y-3">
        {[
          "Email - Session Reminders",
          "Email - Booking Confirmations",
          "Email - New Messages",
          "In-App Notifications",
        ].map((item) => (
          <div key={item} className="flex items-center justify-between rounded-lg border border-[#eceef2] bg-[#fafafb] px-4 py-3">
            <p className="text-[14px] font-medium text-[#20242b]">{item}</p>
            <span className="text-[12px] font-semibold text-[#3d9b68]">Enabled</span>
          </div>
        ))}
      </div>
    </StudentSettingsSubrouteLayout>
  );
}
