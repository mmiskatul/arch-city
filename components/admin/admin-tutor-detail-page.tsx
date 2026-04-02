"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiBookOpen, FiBriefcase, FiCheck, FiChevronLeft, FiStar, FiX } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import type { AdminTutorDetail } from "@/lib/admin/tutors-data";
import { ADMIN_TUTORS_ROUTE } from "@/lib/routes";

type TutorAction = "suspend" | "unsuspend";

function tutorStatusClassName(status: "Approved" | "Pending" | "Suspended") {
  if (status === "Approved") return "bg-[#ebf7ef] text-[#239157]";
  if (status === "Pending") return "bg-[#fff6de] text-[#9c7a1e]";
  return "bg-[#ffecef] text-[#d94a62]";
}

function sessionStatusClassName(status: "Completed" | "No-Show") {
  if (status === "Completed") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#fff6de] text-[#9c7a1e]";
}

export function AdminTutorDetailPage({ tutor }: { tutor: AdminTutorDetail }) {
  const router = useRouter();
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [isSuspended, setIsSuspended] = useState(tutor.status === "Suspended");
  const [actionState, setActionState] = useState<TutorAction | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [suspendUntilDate, setSuspendUntilDate] = useState("");

  const handleTutorAction = async () => {
    if (!actionState || isUpdating) return;

    setIsUpdating(true);
    setActionError(null);

    try {
      await browserApiRequest({
        url: `/api/admin/tutors/${tutor.id}`,
        method: "PATCH",
        data:
          actionState === "unsuspend"
            ? { action: "unsuspend" }
            : {
                action: "suspend",
                reason: "",
                until: suspendUntilDate ? new Date(`${suspendUntilDate}T23:59:59.000Z`).toISOString() : null,
              },
      });

      setIsSuspended(actionState === "suspend");
      setActionState(null);
      setShowSuspendConfirm(false);
      if (actionState === "suspend") {
        setSuspendUntilDate("");
      }
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to update tutor status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminShell>
      <div className="w-full">
        <Link
          href={ADMIN_TUTORS_ROUTE}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6b7280]"
        >
          <FiChevronLeft className="h-4 w-4" />
          Back to Tutors
        </Link>

        <section className="mt-3 rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold ${tutor.initialsClassName}`}
              >
                {tutor.initials}
              </span>
              <div>
                <h1 className="text-[42px] font-bold leading-none text-[#20242b]">{tutor.name}</h1>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  {tutor.email} -{" "}
                  <span className="inline-flex items-center gap-1 font-semibold text-[#8f6b10]">
                    <FiStar className="h-3.5 w-3.5 fill-[#c58b1a] text-[#c58b1a]" />
                    {tutor.rating}
                  </span>{" "}
                  -{" "}
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${tutorStatusClassName(
                      isSuspended ? "Suspended" : tutor.status,
                    )}`}
                  >
                    {isSuspended ? "Suspended" : tutor.status}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActionState(isSuspended ? "unsuspend" : "suspend");
                setShowSuspendConfirm(true);
              }}
              disabled={isUpdating}
              className={`inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isSuspended ? "bg-[#239157] hover:bg-[#1d7b49]" : "bg-[#d94a62] hover:bg-[#bf3d53]"
              }`}
            >
              {isSuspended ? "Unsuspend" : "Suspend"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            <article className="rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Total Sessions</p>
              <p className="mt-2 text-[44px] font-bold leading-none text-[#20242b]">{tutor.totalSessions}</p>
              <p className="mt-1 text-[12px] text-[#239157]">{tutor.totalSessionsDelta}</p>
            </article>

            <article className="rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Active Students
              </p>
              <p className="mt-2 text-[44px] font-bold leading-none text-[#20242b]">{tutor.activeStudents}</p>
              <p className="mt-1 text-[12px] text-[#6b7280]">across {tutor.familiesCount} families</p>
            </article>

            <article className="rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Earned (MTD)</p>
              <p className="mt-2 text-[44px] font-bold leading-none text-[#239157]">{tutor.earnedMtd}</p>
              <p className="mt-1 text-[12px] text-[#6b7280]">{tutor.standardRate} rate</p>
            </article>

            <article className="rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Rating</p>
              <p className="mt-2 text-[44px] font-bold leading-none text-[#8f6b10]">{tutor.rating}</p>
              <p className="mt-1 text-[12px] text-[#6b7280]">from {tutor.reviewCount} reviews</p>
            </article>
          </div>
        </section>

        <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.55fr)]">
          <div className="space-y-3">
            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Personal Information
              </h2>
              <div className="mt-2 space-y-1.5 text-[13px] text-[#4b5563]">
                <p>
                  <span className="text-[#6b7280]">Full Name</span>
                  <br />
                  <span className="font-semibold text-[#20242b]">{tutor.personalInformation.fullName}</span>
                </p>
                <p>
                  <span className="text-[#6b7280]">Email</span>
                  <br />
                  {tutor.personalInformation.email}
                </p>
                <p>
                  <span className="text-[#6b7280]">Phone</span>
                  <br />
                  {tutor.personalInformation.phone}
                </p>
                <p>
                  <span className="text-[#6b7280]">School District</span>
                  <br />
                  {tutor.personalInformation.district}
                </p>
                <p>
                  <span className="text-[#6b7280]">Joined</span>
                  <br />
                  {tutor.personalInformation.joined}
                </p>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Bio</h2>
              <p className="mt-2 text-[13px] leading-7 text-[#4b5563]">{tutor.bio}</p>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Education</h2>
              <div className="mt-3 space-y-3">
                {tutor.education.map((item) => (
                  <div key={`${item.degree}-${item.school}`} className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ebf7ef] text-[#239157]">
                      <FiBookOpen className="h-4 w-4" />
                    </span>
                    <div className="text-[13px] text-[#4b5563]">
                      <p className="font-semibold text-[#20242b]">{item.degree}</p>
                      <p>{item.school}</p>
                      <p>{item.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Work Experience
              </h2>
              <div className="mt-3 space-y-3">
                {tutor.workExperience.map((item) => (
                  <div key={`${item.role}-${item.organization}`} className="flex items-start gap-2.5">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconClassName}`}>
                      <FiBriefcase className="h-4 w-4" />
                    </span>
                    <div className="text-[13px] text-[#4b5563]">
                      <p className="font-semibold text-[#20242b]">{item.role}</p>
                      <p>{item.organization}</p>
                      <p>{item.years}</p>
                      <p>{item.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-3">
            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Subjects & Grade Levels
              </h2>
              <div className="mt-3 space-y-2">
                {tutor.subjectLevels.map((item) => (
                  <div
                    key={item.subject}
                    className="flex items-center justify-between rounded-xl border border-[#eceef2] bg-[#fafafb] px-3 py-2.5"
                  >
                    <div>
                      <p className="text-[22px] font-bold leading-none text-[#20242b]">{item.subject}</p>
                      <p className="mt-1 text-[12px] text-[#6b7280]">{item.gradeRange}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        item.level === "Primary"
                          ? "bg-[#ebf7ef] text-[#239157]"
                          : "bg-[#f1f1f1] text-[#6b7280]"
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid gap-3 lg:grid-cols-2">
              <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Rates</h2>
                <div className="mt-3 space-y-2 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b7280]">Standard rate</span>
                    <span className="font-semibold text-[#20242b]">{tutor.rates.standardRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b7280]">SAT Prep rate</span>
                    <span className="font-semibold text-[#20242b]">{tutor.rates.satPrepRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b7280]">Group rate</span>
                    <span className="font-semibold text-[#20242b]">{tutor.rates.groupRate}</span>
                  </div>
                </div>
              </article>

              <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">Locations</h2>
                <div className="mt-3 space-y-2 text-[13px]">
                  {tutor.locations.map((item) => (
                    <p key={item} className="flex items-center gap-2 text-[#4b5563]">
                      <FiCheck className="h-4 w-4 text-[#239157]" />
                      {item}
                    </p>
                  ))}
                  {tutor.disabledLocations.map((item) => (
                    <p key={item} className="flex items-center gap-2 text-[#9ca3af]">
                      <FiX className="h-4 w-4 text-[#cbd5e1]" />
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            </div>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                  Current Students
                </h2>
                <p className="text-[11px] text-[#6b7280]">{tutor.activeStudents} active</p>
              </div>
              <div className="mt-3 space-y-2">
                {tutor.currentStudents.length > 0 ? (
                  tutor.currentStudents.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-xl border border-[#eceef2] bg-[#fafafb] px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${item.initialsClassName}`}
                        >
                          {item.initials}
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold text-[#20242b]">{item.name}</p>
                          <p className="text-[12px] text-[#6b7280]">
                            {item.subject} - {item.schedule}
                          </p>
                        </div>
                      </div>
                      <Link href="#" className="text-[12px] font-semibold text-[#d61c3f]">
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#eceef2] bg-[#fafafb] px-3 py-4 text-center text-[13px] text-[#6b7280]">
                    No current students yet.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                  Recent Sessions
                </h2>
                <p className="text-[11px] text-[#6b7280]">{tutor.totalSessions} total</p>
              </div>
              <div className="mt-3 overflow-hidden rounded-xl border border-[#eceef2]">
                <div className="grid grid-cols-[0.9fr_0.9fr_0.85fr_0.7fr_0.65fr_0.85fr] gap-2 bg-[#fafafb] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                  <span>Date</span>
                  <span>Student</span>
                  <span>Subject</span>
                  <span>Duration</span>
                  <span>Earned</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-[#eceef2] bg-white">
                  {tutor.recentSessions.length > 0 ? (
                    tutor.recentSessions.map((item, index) => (
                      <div
                        key={`${item.date}-${index}`}
                        className="grid grid-cols-[0.9fr_0.9fr_0.85fr_0.7fr_0.65fr_0.85fr] gap-2 px-3 py-2 text-[12px] text-[#4b5563]"
                      >
                        <span>{item.date}</span>
                        <span>{item.student}</span>
                        <span className="font-semibold text-[#374151]">{item.subject}</span>
                        <span>{item.duration}</span>
                        <span className="font-semibold text-[#239157]">{item.earned}</span>
                        <span>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${sessionStatusClassName(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-[13px] text-[#6b7280]">
                      No recent sessions yet.
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      {showSuspendConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#20242b]">
              {actionState === "unsuspend" ? "Unsuspend This Tutor?" : "Suspend This Tutor?"}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
              {actionState === "unsuspend"
                ? "This will restore the tutor account and allow new session bookings again."
                : "This will pause the tutor account and stop new session bookings until you unsuspend it."}
            </p>

            {actionState === "suspend" ? (
              <div className="mt-4 rounded-xl border border-[#eceef2] bg-[#fafafb] p-3">
                <label className="block text-[12px] font-semibold text-[#374151]" htmlFor="suspendUntilDate">
                  Optional end date
                </label>
                <input
                  id="suspendUntilDate"
                  type="date"
                  value={suspendUntilDate}
                  onChange={(event) => setSuspendUntilDate(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2 text-[13px] text-[#20242b]"
                />
                <p className="mt-2 text-[12px] text-[#6b7280]">
                  Leave this blank to keep the tutor suspended until you manually unsuspend them.
                </p>
              </div>
            ) : null}

            {actionError ? (
              <p className="mt-3 rounded-md border border-[#ffecef] bg-[#fff5f7] px-3 py-2 text-[12px] text-[#d61c3f]">
                {actionError}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuspendConfirm(false);
                  setActionState(null);
                  setActionError(null);
                  setSuspendUntilDate("");
                }}
                disabled={isUpdating}
                className="inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTutorAction}
                disabled={isUpdating}
                className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold text-white transition disabled:opacity-60 ${
                  actionState === "unsuspend"
                    ? "bg-[#239157] hover:bg-[#1d7b49]"
                    : "bg-[#d94a62] hover:bg-[#bf3d53]"
                }`}
              >
                {isUpdating
                  ? "Updating..."
                  : actionState === "unsuspend"
                    ? "Yes, Unsuspend"
                    : "Yes, Suspend"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
