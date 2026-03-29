"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiPauseCircle } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";

type PayoutStatus = "Pending" | "Released" | "On Hold";

type PayoutItem = {
  id: string;
  tutorName: string;
  tutorEmail: string;
  period: string;
  sessions: number;
  grossAmount: string;
  platformFee: string;
  netPayout: string;
  dueDate: string;
  payoutMethod: string;
  notes: string;
  status: PayoutStatus;
};

type ActionState = {
  id: string;
  action: "release" | "hold";
} | null;

const initialPayouts: PayoutItem[] = [
  {
    id: "PQ-4401",
    tutorName: "Marcus Reynolds",
    tutorEmail: "marcus.reynolds@email.com",
    period: "Mar 15 - Mar 21",
    sessions: 12,
    grossAmount: "$2,520.00",
    platformFee: "$180.00",
    netPayout: "$2,340.00",
    dueDate: "March 25, 2026",
    payoutMethod: "Bank Transfer",
    notes: "All sessions verified.",
    status: "Pending",
  },
  {
    id: "PQ-4402",
    tutorName: "Lisa Davis",
    tutorEmail: "lisa.davis@email.com",
    period: "Mar 15 - Mar 21",
    sessions: 10,
    grossAmount: "$2,100.00",
    platformFee: "$150.00",
    netPayout: "$1,950.00",
    dueDate: "March 25, 2026",
    payoutMethod: "Bank Transfer",
    notes: "1 billing dispute still open on separate session.",
    status: "Pending",
  },
  {
    id: "PQ-4403",
    tutorName: "David Kim",
    tutorEmail: "david.kim@email.com",
    period: "Mar 15 - Mar 21",
    sessions: 9,
    grossAmount: "$1,980.00",
    platformFee: "$160.00",
    netPayout: "$1,820.00",
    dueDate: "March 25, 2026",
    payoutMethod: "Direct Deposit",
    notes: "Verification complete.",
    status: "Pending",
  },
];

function statusClassName(status: PayoutStatus) {
  if (status === "Released") return "bg-[#ebf7ef] text-[#239157]";
  if (status === "On Hold") return "bg-[#ffecef] text-[#d94a62]";
  return "bg-[#fff6de] text-[#b58112]";
}

export function AdminPayoutQueuePage() {
  const [payouts, setPayouts] = useState<PayoutItem[]>(initialPayouts);
  const [selectedId, setSelectedId] = useState<string>(initialPayouts[0]?.id ?? "");
  const [actionState, setActionState] = useState<ActionState>(null);

  const selectedPayout = useMemo(
    () => payouts.find((item) => item.id === selectedId) ?? null,
    [payouts, selectedId],
  );

  const handleActionConfirm = () => {
    if (!actionState) return;

    setPayouts((prev) =>
      prev.map((item) =>
        item.id === actionState.id
          ? { ...item, status: actionState.action === "release" ? "Released" : "On Hold" }
          : item,
      ),
    );
    setActionState(null);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#20242b]">Payout Queue</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">
              Review tutor payout batches and release or hold each payout.
            </p>
          </div>
          <p className="text-[13px] font-semibold text-[#6b7280]">
            Pending Payouts: {payouts.filter((item) => item.status === "Pending").length}
          </p>
        </div>

        <section className="mt-5 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[0.85fr_1.3fr_1fr_0.75fr_0.8fr_0.85fr_1.1fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                <span>ID</span>
                <span>Tutor</span>
                <span>Period</span>
                <span>Sessions</span>
                <span>Net</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="grid grid-cols-[0.85fr_1.3fr_1fr_0.75fr_0.8fr_0.85fr_1.1fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                  >
                    <span className="font-semibold text-[#374151]">{payout.id}</span>
                    <div>
                      <p className="font-semibold text-[#20242b]">{payout.tutorName}</p>
                      <p className="text-[12px] text-[#6b7280]">{payout.tutorEmail}</p>
                    </div>
                    <span>{payout.period}</span>
                    <span>{payout.sessions}</span>
                    <span className="font-semibold text-[#374151]">{payout.netPayout}</span>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClassName(payout.status)}`}>
                        {payout.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(payout.id)}
                        className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-3 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setActionState({ id: payout.id, action: "release" })}
                        disabled={payout.status === "Released"}
                        className="inline-flex h-8 items-center rounded-full bg-[#239157] px-3 text-[12px] font-semibold text-white transition hover:bg-[#1d7b49] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
                      >
                        Release
                      </button>
                      <button
                        type="button"
                        onClick={() => setActionState({ id: payout.id, action: "hold" })}
                        disabled={payout.status === "On Hold"}
                        className="inline-flex h-8 items-center rounded-full bg-[#d94a62] px-3 text-[12px] font-semibold text-white transition hover:bg-[#bf3d53] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
                      >
                        Hold
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {selectedPayout ? (
          <section className="mt-5 rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-[#20242b]">Payout Review</h2>
                <p className="text-[13px] text-[#6b7280]">
                  {selectedPayout.id} | {selectedPayout.tutorName} | Due {selectedPayout.dueDate}
                </p>
              </div>
              <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClassName(selectedPayout.status)}`}>
                {selectedPayout.status}
              </span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Payout Breakdown</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">Period: {selectedPayout.period}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Sessions: {selectedPayout.sessions}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Gross Amount: {selectedPayout.grossAmount}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Platform Fee: {selectedPayout.platformFee}</p>
                <p className="mt-1 text-[13px] font-semibold text-[#20242b]">Net Payout: {selectedPayout.netPayout}</p>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Payment Details</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">Method: {selectedPayout.payoutMethod}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Due Date: {selectedPayout.dueDate}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Notes: {selectedPayout.notes}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActionState({ id: selectedPayout.id, action: "release" })}
                disabled={selectedPayout.status === "Released"}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#239157] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1d7b49] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                <FiCheckCircle className="h-4 w-4" />
                Release Payout
              </button>
              <button
                type="button"
                onClick={() => setActionState({ id: selectedPayout.id, action: "hold" })}
                disabled={selectedPayout.status === "On Hold"}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d94a62] px-5 text-[13px] font-semibold text-white transition hover:bg-[#bf3d53] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                <FiPauseCircle className="h-4 w-4" />
                Put On Hold
              </button>
            </div>
          </section>
        ) : null}
      </div>

      {actionState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#20242b]">
              {actionState.action === "release" ? "Release This Payout?" : "Put This Payout On Hold?"}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
              {actionState.action === "release"
                ? "This will mark the payout as released and ready for transfer."
                : "This will hold the payout until finance review is complete."}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActionState(null)}
                className="inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleActionConfirm}
                className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold text-white transition ${
                  actionState.action === "release"
                    ? "bg-[#239157] hover:bg-[#1d7b49]"
                    : "bg-[#d94a62] hover:bg-[#bf3d53]"
                }`}
              >
                {actionState.action === "release" ? "Confirm Release" : "Confirm Hold"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
