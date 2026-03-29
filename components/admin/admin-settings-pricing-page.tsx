"use client";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";

export function AdminSettingsPricingPage() {
  return (
    <AdminSettingsLayout
      title="Pricing & Fees"
      subtitle="Configure subscription pricing, tutor rates, and platform commission"
    >
      <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-5">
        <h2 className="text-[26px] font-bold text-[#20242b]">Platform Fee Configuration</h2>
        <p className="mt-2 text-[18px] text-[#5b5b99]">
          Manage percentage fees for sessions, payouts, and refunds.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-semibold text-[#4b5563]">Session Fee (%)</span>
            <input defaultValue="20" className="h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-[14px] outline-none" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-semibold text-[#4b5563]">Refund Processing Fee (%)</span>
            <input defaultValue="2" className="h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-[14px] outline-none" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-semibold text-[#4b5563]">Minimum Payout ($)</span>
            <input defaultValue="50" className="h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-[14px] outline-none" />
          </label>
        </div>

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
