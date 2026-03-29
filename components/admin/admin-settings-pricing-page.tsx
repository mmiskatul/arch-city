"use client";

import { useMemo, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";

type PricingTier = "Student" | "Tutor" | "Parent" | "Session";

type TierContent = {
  fee: string;
  parentFees?: [string, string, string, string];
  body: string;
  features: string[];
};

const tierData: Record<PricingTier, TierContent> = {
  Student: {
    fee: "5.00",
    body: "Only educators certified with the Missouri Department of Elementary and Secondary Education can apply and will be approved (pending the successful completion of our vetting process).",
    features: [
      "Get paid directly by students",
      "Market your services to our vast network of students",
      "24/7 Customer Support",
    ],
  },
  Tutor: {
    fee: "10.00",
    body: "Tutor plans include profile visibility, student management, and session analytics for performance tracking.",
    features: [
      "Tutor profile optimization",
      "Priority listing in search",
      "Session analytics dashboard",
    ],
  },
  Parent: {
    fee: "5.00",
    parentFees: ["5.00", "5.00", "5.00", "5.00"],
    body: "Only educators certified with the Missouri Department of Elementary and Secondary Education can apply and will be approved (pending the successful completion of our vetting process).",
    features: [
      "Get paid directly by students",
      "Market your services to our vast network of students",
      "24/7 Customer Support",
    ],
  },
  Session: {
    fee: "3.00",
    body: "Per-session service fee applied to each scheduled tutoring session with platform support and payment protection.",
    features: [
      "Secure session payments",
      "Automated reminders",
      "Dispute support workflow",
    ],
  },
};

export function AdminSettingsPricingPage() {
  const [activeTier, setActiveTier] = useState<PricingTier>("Parent");
  const [draftData, setDraftData] = useState<Record<PricingTier, TierContent>>(tierData);

  const currentTier = draftData[activeTier];

  const canAddFeature = useMemo(
    () => currentTier.features.length < 6,
    [currentTier.features.length],
  );

  const updateCurrentTier = (next: Partial<TierContent>) => {
    setDraftData((prev) => ({
      ...prev,
      [activeTier]: {
        ...prev[activeTier],
        ...next,
      },
    }));
  };

  const updateParentFee = (index: 0 | 1 | 2 | 3, value: string) => {
    if (activeTier !== "Parent") return;

    const current = currentTier.parentFees ?? ["5.00", "5.00", "5.00", "5.00"];
    const next: [string, string, string, string] = [...current] as [string, string, string, string];
    next[index] = value;
    updateCurrentTier({ parentFees: next });
  };

  return (
    <AdminSettingsLayout
      title="Pricing & Fees"
      subtitle="Set pricing for your platform"
      rightMeta="Last modified by Admin on Oct 24, 2023"
    >
      <div className="flex justify-end">
        <div className="inline-flex rounded-xl border border-[#d8dce4] bg-white p-1">
          {(["Student", "Tutor", "Parent", "Session"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier)}
              className={`rounded-lg px-4 py-2 text-[15px] font-medium transition ${
                activeTier === tier
                  ? "bg-[#4b5563] text-white"
                  : "text-[#5b5b99] hover:bg-[#f7f7f8]"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <article className="mt-4 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
        <div className="border-b border-[#eceef2] px-5 py-4">
          <h2 className="text-[36px] font-bold leading-none text-[#20242b]">
            {activeTier === "Session" ? "Scheduling Fee" : activeTier}
          </h2>
        </div>

        <div className="px-5 py-5">
          {activeTier === "Parent" ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Fee/month for 1 student",
                "Fee/month for 2 student",
                "Fee/month for 3 student",
                "Fee/month for 4 student",
              ].map((label, index) => (
                <label key={label} className="block">
                  <span className="mb-1.5 block text-[16px] font-semibold text-[#4b5563]">{label}</span>
                  <span className="flex h-11 items-center gap-2 rounded-xl bg-[#f7f7fb] px-4 text-[14px] text-[#5b5b99]">
                    <span className="text-[34px] leading-none text-[#4b5563]">$</span>
                    <input
                      value={(currentTier.parentFees ?? ["5.00", "5.00", "5.00", "5.00"])[index]}
                      onChange={(event) => updateParentFee(index as 0 | 1 | 2 | 3, event.target.value)}
                      className="w-full bg-transparent text-[22px] font-semibold outline-none"
                    />
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <label className="block">
              <span className="mb-1.5 block text-[20px] font-semibold text-[#4b5563]">
                {activeTier === "Session" ? "Fee/session" : "Fee/month"}
              </span>
              <span className="flex h-11 items-center gap-2 rounded-xl bg-[#f7f7fb] px-4 text-[14px] text-[#5b5b99]">
                <span className="text-[34px] leading-none text-[#4b5563]">$</span>
                <input
                  value={currentTier.fee}
                  onChange={(event) => updateCurrentTier({ fee: event.target.value })}
                  className="w-full bg-transparent text-[22px] font-semibold outline-none"
                />
              </span>
            </label>
          )}

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[20px] font-semibold text-[#4b5563]">Body</span>
            <textarea
              value={currentTier.body}
              onChange={(event) => updateCurrentTier({ body: event.target.value })}
              className="h-20 w-full resize-none rounded-xl bg-[#f7f7fb] p-4 text-[14px] leading-6 text-[#374151] outline-none"
            />
          </label>

          <div className="my-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
            <span className="h-px flex-1 bg-[#e5e7eb]" />
            <span>Feature List Display On Landing Page</span>
            <span className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          <div className="space-y-3">
            {currentTier.features.map((feature, index) => (
              <div
                key={`${feature}-${index}`}
                className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5"
              >
                <p className="text-[15px] text-[#4b5563]">{feature}</p>
                <button
                  type="button"
                  onClick={() =>
                    updateCurrentTier({
                      features: currentTier.features.filter((_, i) => i !== index),
                    })
                  }
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#7f78a8] hover:bg-[#f7f7f8]"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={!canAddFeature}
            onClick={() =>
              updateCurrentTier({
                features: [...currentTier.features, "New feature description"],
              })
            }
            className="mt-4 inline-flex items-center gap-2 text-[16px] font-semibold text-[#7f78a8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiPlus className="h-4 w-4" />
            Add Feature List
          </button>

          <div className="mt-6 flex items-center justify-end gap-2">
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
              Update Tier
            </button>
          </div>
        </div>
      </article>
    </AdminSettingsLayout>
  );
}
