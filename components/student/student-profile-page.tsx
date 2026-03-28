"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBell, FiCheckCircle, FiHelpCircle, FiLogOut } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { studentProfile } from "@/lib/student/profile-data";
import { studentScheduleItems } from "@/lib/student/schedule-data";

type ProfileTab = "Personal Info" | "Manage Plan" | "Session History" | "FAQ's & Support";

const profileTabs: ProfileTab[] = [
  "Personal Info",
  "Manage Plan",
  "Session History",
  "FAQ's & Support",
];

const recentSessionHistory = studentScheduleItems.filter((item) => item.status === "Completed");

const faqItems = [
  {
    question: "How does my membership work?",
    answer:
      "Your student plan gives you access to tutor discovery and booking. Session charges are handled separately, and a scheduling fee applies per booking.",
  },
  {
    question: "Can I reschedule a session?",
    answer:
      "Yes. You can manage upcoming sessions from My Schedule. Changes should be made early to avoid cancellation or late-change fees.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Use the message center for tutor-related questions, and contact Arch City Tutors support for billing, membership, or technical issues.",
  },
];

function PersonalInfoSection() {
  return (
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
  );
}

function ManagePlanSection() {
  return (
    <section className="space-y-4">
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

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
          >
            Cancel Plan
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white"
          >
            Upgrade Plan
          </button>
        </div>
      </section>

      <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h3 className="text-[18px] font-bold text-[#20242b]">Billing Details</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { label: "Current Plan", value: studentProfile.planName },
            { label: "Monthly Cost", value: studentProfile.planPrice },
            { label: "Renewal Date", value: studentProfile.renewsOn },
          ].map((item) => (
            <div key={item.label} className="rounded-[12px] bg-[#fafafb] p-4">
              <p className="text-[12px] font-semibold text-[#6b7280]">{item.label}</p>
              <p className="mt-2 text-[15px] font-bold text-[#20242b]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function SessionHistorySection() {
  return (
    <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[18px] font-bold text-[#20242b]">Full Session History</h3>
        <Link href="#" className="text-[13px] font-semibold text-[#d61c3f]">
          Export
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
          {recentSessionHistory.slice(0, 8).map((session) => (
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
  );
}

function FaqSupportSection() {
  return (
    <section className="space-y-4">
      <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h3 className="text-[18px] font-bold text-[#20242b]">FAQ&apos;s & Support</h3>

        <div className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-[12px] border border-[#eceef2] bg-[#fafafb] p-4">
              <div className="flex items-start gap-3">
                <FiHelpCircle className="mt-0.5 h-4 w-4 text-[#d61c3f]" />
                <div>
                  <p className="text-[14px] font-semibold text-[#20242b]">{item.question}</p>
                  <p className="mt-2 text-[13px] leading-6 text-[#6b7280]">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h3 className="text-[18px] font-bold text-[#20242b]">Contact Support</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Arch City Tutors Support",
              value: "info@archcitytutors.com",
            },
            {
              title: "Phone",
              value: "(314) 252-0967",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[12px] bg-[#fafafb] p-4">
              <p className="text-[12px] font-semibold text-[#6b7280]">{item.title}</p>
              <p className="mt-2 text-[15px] font-bold text-[#20242b]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[12px] border border-[#e5f2e8] bg-[#f4fbf6] p-4 text-[13px] text-[#2d8f5f]">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="mt-0.5 h-4 w-4" />
            <p>Response times are usually within one business day for membership or billing questions.</p>
          </div>
        </div>
      </section>
    </section>
  );
}

export function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Personal Info");

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
                    Active Plan - $10/month
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
              {profileTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 pb-3 text-[13px] font-semibold ${
                    activeTab === tab
                      ? "border-[#d61c3f] text-[#d61c3f]"
                      : "border-transparent text-[#6b7280]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "Personal Info" ? <PersonalInfoSection /> : null}
          {activeTab === "Manage Plan" ? <ManagePlanSection /> : null}
          {activeTab === "Session History" ? <SessionHistorySection /> : null}
          {activeTab === "FAQ's & Support" ? <FaqSupportSection /> : null}

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
