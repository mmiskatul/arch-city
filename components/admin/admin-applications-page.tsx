"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FiCheckCircle, FiClock, FiEye, FiXCircle } from "react-icons/fi";

import {
  type ApplicationRow,
  type ApplicationStatus,
} from "@/lib/admin/types";
import { AdminShell } from "@/components/admin/admin-shell";

type StatusTab = {
  key: ApplicationStatus;
  label: string;
  icon: IconType;
};

const tabs: StatusTab[] = [
  { key: "pending", label: "Pending", icon: FiClock },
  { key: "approved", label: "Approved", icon: FiCheckCircle },
  { key: "rejected", label: "Rejected", icon: FiXCircle },
];

function getStatusPillClass(status: ApplicationStatus) {
  if (status === "approved") {
    return "bg-[#eaf8ee] text-[#1f8f47]";
  }

  if (status === "rejected") {
    return "bg-[#fdebec] text-[#d92d20]";
  }

  return "bg-[#fff3eb] text-[#c76b18]";
}

export function AdminApplicationsPage({ applicationRows }: { applicationRows: ApplicationRow[] }) {
  const [activeTab, setActiveTab] = useState<ApplicationStatus>("pending");
  const [approveTarget, setApproveTarget] = useState<ApplicationRow | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ApplicationRow | null>(null);
  const [rowsState, setRowsState] = useState(applicationRows);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredRows = rowsState.filter((row) => row.status === activeTab);

  const isApproving = approveTarget && loadingId === approveTarget.id;
  const isRejecting = rejectTarget && loadingId === rejectTarget.id;

  async function handleStatusChange(
    target: ApplicationRow,
    status: ApplicationStatus,
    onSettled: () => void,
  ) {
    setLoadingId(target.id);
    try {
      const response = await fetch("/api/admin/applications/operate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id, status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update");
      }
      setRowsState((current) =>
        current.map((row) => (row.id === target.id ? { ...row, status } : row)),
      );
    } finally {
      setLoadingId(null);
      onSettled();
    }
  }

  return (
    <AdminShell breadcrumbLabel="Admin Dashboard">
      <div className="mt-12">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111827]">Applications</h1>
        <p className="mt-2 text-lg text-[#6b7280]">
          Here you can view and manage all applications submitted by tutors:
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-base font-semibold transition ${
                active
                  ? "border-[#ef242a] bg-[#ef242a] text-white"
                  : "border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#ef242a]/35 hover:text-[#111827]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="px-5 pb-1 text-left text-sm font-semibold text-[#6b7280]">Submitted on</th>
              <th className="px-5 pb-1 text-left text-sm font-semibold text-[#6b7280]">Status</th>
              <th className="px-5 pb-1 text-left text-sm font-semibold text-[#6b7280]">Name</th>
              <th className="px-5 pb-1 text-right text-sm font-semibold text-[#6b7280]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="rounded-[24px] border border-[#ececec] bg-white px-6 py-14 text-center text-base text-[#6b7280] shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
                >
                  Nothing to show...
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id} className="overflow-hidden">
                  <td className="rounded-l-[20px] border-y border-l border-[#ececec] bg-white px-5 py-5 text-[15px] text-[#374151] shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                    {row.submittedOn}
                  </td>
                  <td className="border-y border-[#ececec] bg-white px-5 py-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusPillClass(
                        row.status,
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="border-y border-[#ececec] bg-white px-5 py-5 text-[15px] font-medium text-[#111827] shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                    {row.name}
                  </td>
                  <td className="rounded-r-[20px] border-y border-r border-[#ececec] bg-white px-5 py-5 text-right shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center justify-end gap-2">
                      {row.status === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setApproveTarget(row)}
                            className="rounded-xl bg-[#16a34a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#15803d]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectTarget(row)}
                            className="rounded-xl bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b91c1c]"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      <Link
                        href={`/admin-dashboard/applications/${row.id}`}
                        aria-label={`Review ${row.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#8f949e] transition hover:bg-[#f4f4f5] hover:text-[#111827]"
                      >
                        <FiEye className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {approveTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-[580px] rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
            <h2 className="text-[18px] font-semibold text-[#111827]">{approveTarget.name}</h2>
            <div className="my-5 h-px bg-[#ececec]" />
            <p className="max-w-[470px] text-[15px] leading-8 text-[#374151]">
              Are you sure you want to approve this application? This action cannot be undone.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                className="rounded-xl bg-[#16a34a] px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] transition hover:bg-[#15803d]"
                disabled={isApproving}
                onClick={() =>
                  approveTarget &&
                  handleStatusChange(approveTarget, "approved", () => setApproveTarget(null))
                }
              >
                Confirm &amp; approve
              </button>
              <button
                type="button"
                className="text-[15px] font-semibold text-[#6b7280] transition hover:text-[#111827]"
                onClick={() => setApproveTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {rejectTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-[580px] rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
            <h2 className="text-[18px] font-semibold text-[#111827]">{rejectTarget.name}</h2>
            <div className="my-5 h-px bg-[#ececec]" />
            <p className="max-w-[470px] text-[15px] leading-8 text-[#374151]">
              Are you sure you want to reject this application? This action cannot be undone.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                className="rounded-xl bg-[#dc2626] px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] transition hover:bg-[#b91c1c]"
                disabled={isRejecting}
                onClick={() =>
                  rejectTarget &&
                  handleStatusChange(rejectTarget, "rejected", () => setRejectTarget(null))
                }
              >
                Confirm &amp; reject
              </button>
              <button
                type="button"
                className="text-[15px] font-semibold text-[#6b7280] transition hover:text-[#111827]"
                onClick={() => setRejectTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
