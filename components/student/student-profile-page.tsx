"use client";

import Link from "next/link";
import { FiBell, FiLogOut } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { studentProfile } from "@/lib/student/profile-data";
import { studentScheduleItems } from "@/lib/student/schedule-data";

const profileTabs = ["Personal Info", "Manage Plan", "Session History", "FAQ's & Support"];

const recentSessionHistory = studentScheduleItems
  .filter((item) => item.status === "Completed")
  .slice(0, 3);

export function StudentProfilePage() {
  return (
    <StudentShell>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between px-4 pb-5 lg:px-5">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">My Profile</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f4f4f5]"
              aria-label="Notifications"
            >
              <FiBell className="h-4 w-4" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-semibold text-[#d61c3f]">
              {studentProfile.initials}
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 lg:px-5">
          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe7eb] text-[20px] font-bold text-[#d61c3f]">
                  {studentProfile.initials}
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#20242b]">
                    {studentProfile.firstName} {studentProfile.lastName}
                  </h2>
                  <p className="text-[13px] text-[#6b7280]">
                    {studentProfile.email} · {studentProfile.gradeLevel}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-[#eaf7ef] px-2.5 py-1 text-[11px] font-medium text-[#2d8f5f]">
                    {studentProfile.activePlanLabel}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Edit Photo
              </button>
            </div>
          </section>

          <div className="border-b border-[#eceef2]">
            <div className="flex flex-wrap items-center gap-7 px-3">
              {profileTabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`border-b-2 pb-3 text-[13px] font-semibold ${
                    index === 0
                      ? "border-[#d61c3f] text-[#d61c3f]"
                      : "border-transparent text-[#6b7280]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[18px] font-bold text-[#20242b]">Personal Information</h3>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Save Changes
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                { label: "First Name", value: studentProfile.firstName },
                { label: "Last Name", value: studentProfile.lastName },
                { label: "Email Address", value: studentProfile.email },
                { label: "Grade Level", value: studentProfile.gradeLevel },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">
                    {field.label}
                  </label>
                  <div className="flex h-11 items-center rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563]">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h3 className="text-[18px] font-bold text-[#20242b]">Subscription Plan</h3>

            <div className="mt-4 rounded-[12px] bg-[#fafafb] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[15px] font-bold text-[#20242b]">{studentProfile.planName}</p>
                  <p className="text-[13px] text-[#6b7280]">
                    {studentProfile.planPrice} · Renews {studentProfile.renewsOn}
                  </p>
                </div>
                <span className="inline-flex rounded-full bg-[#eaf7ef] px-3 py-1 text-[11px] font-medium text-[#2d8f5f]">
                  Active
                </span>
              </div>
            </div>

            <p className="mt-4 text-[13px] text-[#6b7280]">
              Your plan includes unlimited session bookings. The $5 scheduling fee applies per session.
            </p>

            <button
              type="button"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
            >
              Cancel Plan
            </button>
          </section>

          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[18px] font-bold text-[#20242b]">Recent Session History</h3>
              <Link href="#" className="text-[13px] font-semibold text-[#d61c3f]">
                View all
              </Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-[12px] border border-[#eceef2]">
              <div className="grid grid-cols-[1.3fr_0.9fr_1fr_0.8fr_0.9fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Tutor</span>
                <span>Date</span>
                <span>Subject</span>
                <span>Duration</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {recentSessionHistory.map((session) => (
                  <div
                    key={session.id}
                    className="grid grid-cols-[1.3fr_0.9fr_1fr_0.8fr_0.9fr] gap-4 px-4 py-4 text-[14px] text-[#4b5563]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                        {session.tutorInitials}
                      </span>
                      <span className="font-medium">{session.tutorName}</span>
                    </div>
                    <div>{session.date}</div>
                    <div>{session.subject}</div>
                    <div>{session.duration}</div>
                    <div>
                      <span className="inline-flex rounded-full bg-[#ebf7ef] px-2.5 py-1 text-[11px] font-medium text-[#1b8a5a]">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <button
            type="button"
            className="inline-flex items-center gap-3 px-2 py-3 text-[14px] font-semibold text-[#d61c3f]"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </StudentShell>
  );
}
