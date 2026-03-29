import { FiAlertCircle, FiLock, FiShield } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";

function ReadOnlyField({
  label,
  placeholder,
  className = "",
}: {
  label: string;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">{label}</label>
      <input
        type="password"
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
      />
    </div>
  );
}

export function TutorSettingsPage() {
  return (
    <TutorShell>
      <div className="w-full">
        <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Settings</h1>

        <div className="mt-5 space-y-5">
          <section className="rounded-[16px] border border-[#eceef2] bg-[#fafafa] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e6f5ee] text-[#4fa97a]">
                <FiLock className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-[18px] font-bold text-[#20242b]">Password & Security</h2>
                <p className="text-[13px] text-[#6b7280]">Last changed 3 months ago</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ReadOnlyField
                label="Current Password"
                placeholder="Enter current password"
                className="md:col-span-2"
              />
              <ReadOnlyField label="New Password" placeholder="Min. 8 characters" />
              <ReadOnlyField label="Confirm New Password" placeholder="Re-enter new password" />
            </div>

            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6b7280]">
              <FiAlertCircle className="h-3.5 w-3.5" />
              <span>Use at least 8 characters with a mix of letters, numbers, and symbols</span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
              >
                Update Password
              </button>
            </div>
          </section>

          <section className="rounded-[16px] border border-[#eceef2] bg-[#fafafa] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff6de] text-[#b58112]">
                <FiShield className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-[18px] font-bold text-[#20242b]">Account Status</h2>
                <p className="text-[13px] text-[#6b7280]">
                  Control your profile visibility and account activity
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-4">
              <div className="space-y-3 text-[14px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">Account Status</span>
                  <span className="inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">Member Since</span>
                  <span className="font-medium text-[#4b5563]">January 15, 2024</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">Background Check</span>
                  <span className="font-medium text-[#3d9b68]">Verified — Expires Dec 2026</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6b7280]">Tutor ID</span>
                  <span className="font-medium text-[#4b5563]">TUT-00142</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[16px] border border-[#f3cfd6] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[18px] font-bold text-[#9f2338]">Danger Zone</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              These actions are permanent and cannot be undone.
            </p>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[14px] font-semibold text-[#20242b]">Delete Account</p>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  Permanently remove your tutor account and all associated data.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full bg-[#e8485f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#d61c3f]"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </TutorShell>
  );
}
