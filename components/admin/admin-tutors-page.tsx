"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiDownload, FiStar } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { adminTutors, type AdminTutorStatus, type AdminTutorRow } from "@/lib/admin/tutors-data";
import { ADMIN_TUTORS_ROUTE } from "@/lib/routes";

type TutorFilter = "All Tutors" | "Approved" | "Pending Review" | "Suspended";

const pageSize = 6;

function statusClassName(status: AdminTutorStatus) {
  if (status === "Approved") return "bg-[#ebf7ef] text-[#239157]";
  if (status === "Pending") return "bg-[#fff6de] text-[#9c7a1e]";
  return "bg-[#ffecef] text-[#d94a62]";
}

function toStatus(filter: TutorFilter): AdminTutorStatus | null {
  if (filter === "Approved") return "Approved";
  if (filter === "Pending Review") return "Pending";
  if (filter === "Suspended") return "Suspended";
  return null;
}

export function AdminTutorsPage() {
  const [tutors, setTutors] = useState<AdminTutorRow[]>(adminTutors);
  const [filter, setFilter] = useState<TutorFilter>("All Tutors");
  const [currentPage, setCurrentPage] = useState(1);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);

  const filteredTutors = useMemo(() => {
    const status = toStatus(filter);
    return status ? tutors.filter((item) => item.status === status) : tutors;
  }, [tutors, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredTutors.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = filteredTutors.slice((safePage - 1) * pageSize, safePage * pageSize);

  const startIndex = filteredTutors.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, filteredTutors.length);

  const approvedCount = tutors.filter((item) => item.status === "Approved").length;
  const pendingCount = tutors.filter((item) => item.status === "Pending").length;
  const approveTargetTutor = tutors.find((item) => item.id === approveTargetId) ?? null;

  const handleFilter = (next: TutorFilter) => {
    setFilter(next);
    setCurrentPage(1);
  };

  const updateTutorStatus = (id: string, status: AdminTutorStatus) => {
    setTutors((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const handleApproveConfirm = () => {
    if (!approveTargetId) return;
    updateTutorStatus(approveTargetId, "Approved");
    setApproveTargetId(null);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Tutors</h1>
            <p className="mt-2 text-[14px] text-[#6b7280]">64 approved · 4 pending review</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-[13px] font-semibold text-[#4b5563]"
          >
            <FiDownload className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4 border-b border-[#eceef2] bg-white px-2">
          {(["All Tutors", "Approved", "Pending Review", "Suspended"] as const).map((item) => {
            const active = filter === item;
            const showApprovedBadge = item === "Approved";
            const showPendingBadge = item === "Pending Review";

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleFilter(item)}
                className={`inline-flex h-10 items-center gap-1.5 border-b-2 px-2 text-[14px] font-semibold transition ${
                  active
                    ? "border-[#d94a62] text-[#d61c3f]"
                    : "border-transparent text-[#6b7280] hover:text-[#374151]"
                }`}
              >
                {item}
                {showApprovedBadge ? (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d61c3f] px-1 text-[10px] font-semibold text-white">
                    {approvedCount}
                  </span>
                ) : null}
                {showPendingBadge ? (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8f6b10] px-1 text-[10px] font-semibold text-white">
                    {pendingCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <section className="mt-4 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              <div className="grid grid-cols-[1.7fr_1.45fr_0.75fr_0.7fr_0.9fr_0.95fr_0.85fr_0.95fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Tutor</span>
                <span>Subjects</span>
                <span>Sessions</span>
                <span>Rating</span>
                <span>Hourly Rate</span>
                <span>Earned (MTD)</span>
                <span>Status</span>
                <span> </span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {pageRows.map((tutor) => (
                  <div
                    key={tutor.id}
                    className={`grid grid-cols-[1.7fr_1.45fr_0.75fr_0.7fr_0.9fr_0.95fr_0.85fr_0.95fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563] ${
                      tutor.status === "Pending" ? "bg-[#fffdf3]" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${tutor.initialsClassName}`}
                      >
                        {tutor.initials}
                      </span>
                      <div>
                        <p className="font-semibold text-[#20242b]">{tutor.name}</p>
                        <p className="text-[12px] text-[#6b7280]">{tutor.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {tutor.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex rounded-full border border-[#e5e7eb] bg-[#f7f7f8] px-2.5 py-1 text-[11px] font-medium text-[#6b7280]"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>

                    <span>{tutor.sessions ?? "—"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#8f6b10]">
                      <FiStar className="h-3.5 w-3.5 fill-[#c58b1a] text-[#c58b1a]" />
                      {tutor.rating}
                    </span>
                    <span>{tutor.hourlyRate}</span>
                    <span className="font-semibold text-[#239157]">{tutor.earnedMtd ?? "—"}</span>
                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassName(tutor.status)}`}
                      >
                        {tutor.status}
                      </span>
                    </div>
                    <div>
                      {tutor.status === "Pending" ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setApproveTargetId(tutor.id)}
                            className="inline-flex h-7 items-center rounded-lg bg-[#239157] px-2.5 text-[12px] font-semibold text-white"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTutorStatus(tutor.id, "Suspended")}
                            className="inline-flex h-7 items-center rounded-lg bg-[#d94a62] px-2.5 text-[12px] font-semibold text-white"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={`${ADMIN_TUTORS_ROUTE}/${tutor.id}`}
                          className="inline-flex h-7 items-center rounded-lg border border-[#e5e7eb] bg-[#f7f7f8] px-3 text-[12px] font-semibold text-[#4b5563]"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startIndex}-{endIndex} of {filteredTutors.length} tutors
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
            >
              &#8249;
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const active = safePage === pageNumber;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-[12px] font-semibold ${
                    active
                      ? "border-[#e24961] bg-[#ffecef] text-[#d61c3f]"
                      : "border-[#e5e7eb] bg-white text-[#6b7280]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>

      {approveTargetTutor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#20242b]">Approve This Tutor?</h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
              Confirm approval for {approveTargetTutor.name}. This will move the tutor from pending
              review to approved status.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setApproveTargetId(null)}
                className="inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveConfirm}
                className="inline-flex h-9 items-center rounded-full bg-[#239157] px-4 text-[13px] font-semibold text-white transition hover:bg-[#1d7b49]"
              >
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
