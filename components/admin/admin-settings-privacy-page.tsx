"use client";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";

export function AdminSettingsPrivacyPage() {
  return (
    <AdminSettingsLayout
      title="Privacy & Policy"
      subtitle="Define user data handling rules and compliance settings"
      rightMeta="Last modified by Admin on Oct 24, 2023"
    >
      <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-5">
        <h2 className="text-[26px] font-bold text-[#20242b]">Policy Content</h2>
        <p className="mt-2 text-[18px] text-[#5b5b99]">
          Update how user data is collected, processed, stored, and shared.
        </p>

        <textarea
          defaultValue="We collect minimal personal data required to provide tutoring services and scheduling. Data is securely stored and never sold to third parties."
          className="mt-4 h-[260px] w-full resize-none rounded-xl border border-[#e5e7eb] p-4 text-[14px] leading-7 text-[#374151] outline-none"
        />

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#6b7280]"
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg bg-[#20242b] px-4 text-[14px] font-semibold text-white"
          >
            Save
          </button>
        </div>
      </article>
    </AdminSettingsLayout>
  );
}
