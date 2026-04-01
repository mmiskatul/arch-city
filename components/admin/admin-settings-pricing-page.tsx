"use client";

import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";
import {
  fetchAdminPricingSettings,
  updateAdminPricingSettings,
  type AdminPricingTierSettings,
} from "@/lib/api/admin-settings-api";

type PricingTier = AdminPricingTierSettings["tier"];

const orderedTiers: PricingTier[] = ["Student", "Tutor", "Parent", "Session"];

function cloneTiers(tiers: AdminPricingTierSettings[]) {
  return tiers.map((tier) => ({
    ...tier,
    features: [...tier.features],
    parent_fees: tier.parent_fees ? [...tier.parent_fees] : tier.parent_fees,
  }));
}

function formatLastModified(value: string, updatedBy: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Last modified by ${updatedBy || "Admin"}`;
  }

  return `Last modified by ${updatedBy || "Admin"} on ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function AdminSettingsPricingPage() {
  const [activeTier, setActiveTier] = useState<PricingTier>("Parent");
  const [draftTiers, setDraftTiers] = useState<AdminPricingTierSettings[]>([]);
  const [initialTiers, setInitialTiers] = useState<AdminPricingTierSettings[]>([]);
  const [lastModifiedAt, setLastModifiedAt] = useState<string>("");
  const [updatedBy, setUpdatedBy] = useState<string>("Admin");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAdminPricingSettings();
        if (cancelled) return;

        const nextTiers = cloneTiers(response.tiers);
        setDraftTiers(nextTiers);
        setInitialTiers(cloneTiers(nextTiers));
        setLastModifiedAt(response.last_modified_at);
        setUpdatedBy(response.updated_by);
        if (response.tiers[0]) {
          setActiveTier(response.tiers[0].tier);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load pricing settings.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentTier = useMemo(
    () => draftTiers.find((tier) => tier.tier === activeTier) ?? draftTiers[0],
    [activeTier, draftTiers],
  );

  const canAddFeature = useMemo(() => (currentTier?.features.length ?? 0) < 6, [currentTier]);

  const updateCurrentTier = (next: Partial<AdminPricingTierSettings>) => {
    setDraftTiers((prev) =>
      prev.map((tier) =>
        tier.tier === activeTier
          ? {
              ...tier,
              ...next,
            }
          : tier,
      ),
    );
  };

  const updateParentFee = (index: 0 | 1 | 2 | 3, value: string) => {
    if (activeTier !== "Parent" || !currentTier) return;

    const current = currentTier.parent_fees ?? ["5.00", "5.00", "5.00", "5.00"];
    const next: [string, string, string, string] = [...current] as [string, string, string, string];
    next[index] = value;
    updateCurrentTier({ parent_fees: next });
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await updateAdminPricingSettings({ tiers: draftTiers });
      const nextTiers = cloneTiers(response.tiers);
      setDraftTiers(nextTiers);
      setInitialTiers(cloneTiers(nextTiers));
      setLastModifiedAt(response.last_modified_at);
      setUpdatedBy(response.updated_by);
      setMessage("Pricing settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save pricing settings.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setDraftTiers(cloneTiers(initialTiers));
    setMessage(null);
    setError(null);
  };

  return (
    <AdminSettingsLayout
      title="Pricing & Fees"
      subtitle="Set pricing for your platform"
      rightMeta={lastModifiedAt ? formatLastModified(lastModifiedAt, updatedBy) : undefined}
    >
      <div className="flex justify-end">
        <div className="inline-flex rounded-xl border border-[#d8dce4] bg-white p-1">
          {orderedTiers.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier)}
              className={`rounded-lg px-4 py-2 text-[15px] font-medium transition ${
                activeTier === tier ? "bg-[#4b5563] text-white" : "text-[#5b5b99] hover:bg-[#f7f7f8]"
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
          {loading ? <p className="mb-4 text-[15px] text-[#6b7280]">Loading pricing settings...</p> : null}
          {error ? <p className="mb-4 rounded-lg bg-[#fff1f2] px-3 py-2 text-[14px] text-[#b91c1c]">{error}</p> : null}
          {message ? <p className="mb-4 rounded-lg bg-[#ecfdf5] px-3 py-2 text-[14px] text-[#047857]">{message}</p> : null}

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
                      value={(currentTier?.parent_fees ?? ["5.00", "5.00", "5.00", "5.00"])[index]}
                      onChange={(event) => updateParentFee(index as 0 | 1 | 2 | 3, event.target.value)}
                      className="w-full bg-transparent text-[22px] font-semibold outline-none"
                      disabled={loading}
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
                  value={currentTier?.fee ?? ""}
                  onChange={(event) => updateCurrentTier({ fee: event.target.value })}
                  className="w-full bg-transparent text-[22px] font-semibold outline-none"
                  disabled={loading}
                />
              </span>
            </label>
          )}

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[20px] font-semibold text-[#4b5563]">Body</span>
            <textarea
              value={currentTier?.body ?? ""}
              onChange={(event) => updateCurrentTier({ body: event.target.value })}
              className="h-20 w-full resize-none rounded-xl bg-[#f7f7fb] p-4 text-[14px] leading-6 text-[#374151] outline-none"
              disabled={loading}
            />
          </label>

          <div className="my-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
            <span className="h-px flex-1 bg-[#e5e7eb]" />
            <span>Feature List Display On Landing Page</span>
            <span className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          <div className="space-y-3">
            {(currentTier?.features ?? []).map((feature, index) => (
              <div
                key={`${feature}-${index}`}
                className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5"
              >
                <p className="text-[15px] text-[#4b5563]">{feature}</p>
                <button
                  type="button"
                  onClick={() =>
                    updateCurrentTier({
                      features: (currentTier?.features ?? []).filter((_, i) => i !== index),
                    })
                  }
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#7f78a8] hover:bg-[#f7f7f8]"
                  disabled={loading}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={!canAddFeature || loading}
            onClick={() =>
              updateCurrentTier({
                features: [...(currentTier?.features ?? []), "New feature description"],
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
              onClick={onCancel}
              disabled={loading || saving || draftTiers.length === 0 || JSON.stringify(draftTiers) === JSON.stringify(initialTiers)}
              className="inline-flex h-9 items-center rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void onSave()}
              disabled={loading || saving}
              className="inline-flex h-9 items-center rounded-lg bg-[#20242b] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Tier"}
            </button>
          </div>
        </div>
      </article>
    </AdminSettingsLayout>
  );
}
