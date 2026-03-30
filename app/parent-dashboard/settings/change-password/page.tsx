import { ParentSettingsSubrouteLayout } from "@/components/parent/parent-settings-subroute-layout";

export default function Page() {
  return (
    <ParentSettingsSubrouteLayout title="Change Password">
      <div className="grid gap-4">
        {[
          { label: "Current Password", placeholder: "Enter current password" },
          { label: "New Password", placeholder: "Min. 8 characters" },
          { label: "Confirm New Password", placeholder: "Re-enter new password" },
        ].map((field) => (
          <div key={field.label}>
            <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">{field.label}</label>
            <input
              type="password"
              placeholder={field.placeholder}
              className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
            />
          </div>
        ))}
      </div>
    </ParentSettingsSubrouteLayout>
  );
}
