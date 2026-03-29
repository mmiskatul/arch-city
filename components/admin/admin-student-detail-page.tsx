"use client";

import { useState } from "react";
import Link from "next/link";
import { FiBell, FiChevronLeft } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import type { AdminStudentDetail } from "@/lib/admin/students-data";
import { ADMIN_STUDENTS_ROUTE } from "@/lib/routes";

function studentStatusClassName(status: "Active" | "Inactive") {
  if (status === "Active") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#fff6de] text-[#9c7a1e]";
}

function historyStatusClassName(status: "Completed" | "No-Show") {
  if (status === "Completed") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#fff6de] text-[#9c7a1e]";
}

export function AdminStudentDetailPage({ student }: { student: AdminStudentDetail }) {
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);

  const handleSuspendConfirm = () => {
    setIsSuspended(true);
    setShowSuspendConfirm(false);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <Link
          href={ADMIN_STUDENTS_ROUTE}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6b7280]"
        >
          <FiChevronLeft className="h-4 w-4" />
          Back to Students
        </Link>

        <section className="mt-3 rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold ${student.initialsClassName}`}
              >
                {student.initials}
              </span>
              <div>
                <h1 className="text-[30px] font-bold leading-none text-[#20242b]">{student.name}</h1>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  {student.email} · {student.grade} ·{" "}
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${studentStatusClassName(student.status)}`}
                  >
                    {student.status}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSuspendConfirm(true)}
              disabled={isSuspended}
              className="inline-flex h-8 items-center rounded-lg border border-[#f2c3cc] bg-[#ffecef] px-3 text-[12px] font-semibold text-[#d94a62] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSuspended ? "Suspended" : "Suspend"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <article className="rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Total Sessions
              </p>
              <p className="mt-2 text-[34px] font-bold leading-none text-[#20242b]">{student.totalSessions}</p>
              <p className="mt-1 text-[11px] text-[#239157]">{student.totalSessionsDelta}</p>
            </article>

            <article className="rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Current Plan
              </p>
              <p className="mt-2 text-[22px] font-bold leading-none text-[#20242b]">{student.currentPlanName}</p>
              <p className="mt-1 text-[11px] text-[#6b7280]">
                {student.currentPlanMeta} · {student.currentPlanPrice}
              </p>
            </article>

            <article className="rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Member Since
              </p>
              <p className="mt-2 text-[22px] font-bold leading-none text-[#20242b]">{student.memberSince}</p>
              <p className="mt-1 text-[11px] text-[#6b7280]">{student.memberSinceDelta}</p>
            </article>
          </div>
        </section>

        <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
          <div className="space-y-3">
            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Student Information
              </h2>
              <div className="mt-2 space-y-1.5 text-[13px] text-[#4b5563]">
                <p>
                  <span className="text-[#6b7280]">Full Name</span>
                  <br />
                  <span className="font-semibold text-[#20242b]">{student.studentInformation.fullName}</span>
                </p>
                <p>
                  <span className="text-[#6b7280]">Email</span>
                  <br />
                  {student.studentInformation.email}
                </p>
                <p>
                  <span className="text-[#6b7280]">Grade</span>
                  <br />
                  {student.studentInformation.grade}
                </p>
                <p>
                  <span className="text-[#6b7280]">School</span>
                  <br />
                  {student.studentInformation.school}
                </p>
                <p>
                  <span className="text-[#6b7280]">Date of Birth</span>
                  <br />
                  {student.studentInformation.dateOfBirth}
                </p>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Parent / Guardian
              </h2>
              <div className="mt-2 space-y-1.5 text-[13px] text-[#4b5563]">
                <p>
                  <span className="text-[#6b7280]">Name</span>
                  <br />
                  <span className="font-semibold text-[#20242b]">{student.parentGuardian.name}</span>
                </p>
                <p>
                  <span className="text-[#6b7280]">Email</span>
                  <br />
                  {student.parentGuardian.email}
                </p>
                <p>
                  <span className="text-[#6b7280]">Phone</span>
                  <br />
                  {student.parentGuardian.phone}
                </p>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                Plan & Billing
              </h2>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[18px] font-bold text-[#20242b]">{student.planBilling.name}</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${studentStatusClassName(student.planBilling.status)}`}>
                    {student.planBilling.status}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-[#6b7280]">{student.planBilling.sessionsPerMonth}</p>
                <p className="mt-1 text-[28px] font-bold leading-none text-[#d94a62]">
                  {student.planBilling.amount}
                </p>
                <div className="mt-3 flex items-center justify-between text-[12px] text-[#6b7280]">
                  <span>Next billing date</span>
                  <span className="font-semibold text-[#374151]">{student.planBilling.nextBillingDate}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[12px] text-[#6b7280]">
                  <span>Sessions used this month</span>
                  <span className="font-semibold text-[#374151]">{student.planBilling.usedSessions}</span>
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-3">
            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                  Active Lessons
                </h2>
                <p className="text-[11px] text-[#6b7280]">1 active</p>
              </div>

              <div className="mt-3 rounded-xl border border-[#eceef2] bg-[#fafafb] p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[20px] font-bold leading-none text-[#20242b]">{student.activeLesson.subject}</p>
                  <span className="inline-flex rounded-full bg-[#ebf7ef] px-2 py-0.5 text-[10px] font-semibold text-[#239157]">
                    {student.activeLesson.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[12px] text-[#6b7280]">
                  <p>
                    Tutor <span className="font-semibold text-[#20242b]">{student.activeLesson.tutor}</span> · ★{" "}
                    {student.activeLesson.tutorRating}
                  </p>
                  <Link href="#" className="font-semibold text-[#d61c3f]">
                    View Profile →
                  </Link>
                </div>

                <div className="mt-3 grid gap-3 text-[12px] text-[#6b7280] sm:grid-cols-2">
                  <p>
                    Day & Time
                    <br />
                    <span className="font-semibold text-[#20242b]">{student.activeLesson.dayTime}</span>
                  </p>
                  <p>
                    Duration
                    <br />
                    <span className="font-semibold text-[#20242b]">{student.activeLesson.duration}</span>
                  </p>
                  <p>
                    Location
                    <br />
                    <span className="font-semibold text-[#20242b]">{student.activeLesson.location}</span>
                  </p>
                  <p>
                    Rate
                    <br />
                    <span className="font-semibold text-[#20242b]">{student.activeLesson.rate}</span>
                  </p>
                </div>

                <p className="mt-3 text-[12px] text-[#6b7280]">
                  Next Session
                  <br />
                  <span className="font-semibold text-[#374151]">{student.activeLesson.nextSession}</span>
                </p>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                  Upcoming Schedule
                </h2>
                <Link href="#" className="text-[11px] font-semibold text-[#d61c3f]">
                  View All →
                </Link>
              </div>

              <div className="mt-3 divide-y divide-[#eceef2] rounded-xl border border-[#eceef2] bg-[#fafafb]">
                {student.upcomingSchedule.map((item, index) => (
                  <div key={`${item.day}-${index}`} className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-center">
                        <p className="text-[9px] font-semibold uppercase text-[#9ca3af]">{item.month}</p>
                        <p className="text-[16px] font-bold leading-none text-[#d94a62]">{item.day}</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#20242b]">{item.subject}</p>
                        <p className="text-[11px] text-[#6b7280]">
                          {item.tutor} · {item.time} · {item.mode}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-[#ebf7ef] px-2 py-0.5 text-[10px] font-semibold text-[#239157]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                  Session History
                </h2>
                <p className="text-[11px] text-[#6b7280]">{student.totalSessions} total</p>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-[#eceef2]">
                <div className="grid grid-cols-[0.9fr_0.9fr_0.8fr_0.7fr_0.7fr] gap-2 bg-[#fafafb] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                  <span>Date</span>
                  <span>Subject</span>
                  <span>Tutor</span>
                  <span>Duration</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-[#eceef2] bg-white">
                  {student.sessionHistory.map((item, index) => (
                    <div
                      key={`${item.date}-${index}`}
                      className="grid grid-cols-[0.9fr_0.9fr_0.8fr_0.7fr_0.7fr] gap-2 px-3 py-2 text-[12px] text-[#4b5563]"
                    >
                      <span>{item.date}</span>
                      <span>{item.subject}</span>
                      <span>{item.tutor}</span>
                      <span>{item.duration}</span>
                      <span>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${historyStatusClassName(item.status)}`}>
                          {item.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="mt-3 inline-flex h-8 items-center justify-center rounded-lg text-[12px] font-semibold text-[#d94a62]"
              >
                <FiBell className="mr-1 h-3.5 w-3.5" />
                Load more sessions
              </button>
            </article>
          </div>
        </section>
      </div>

      {showSuspendConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#20242b]">Suspend This Student?</h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
              This action will suspend the student account from active scheduling until manually reactivated.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSuspendConfirm(false)}
                className="inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSuspendConfirm}
                className="inline-flex h-9 items-center rounded-full bg-[#d94a62] px-4 text-[13px] font-semibold text-white transition hover:bg-[#bf3d53]"
              >
                Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
