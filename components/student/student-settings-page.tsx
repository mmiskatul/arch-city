"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronRight, FiMail, FiPhone } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";

type PreferenceItem = {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
};

const initialPreferences: PreferenceItem[] = [
  {
    key: "session-reminders",
    title: "Email — Session Reminders",
    description: "Get emailed 24 hours before each session",
    enabled: true,
  },
  {
    key: "booking-confirmations",
    title: "Email — Booking Confirmations",
    description: "Receive confirmation when a session is booked or cancelled",
    enabled: true,
  },
  {
    key: "new-messages",
    title: "Email — New Messages",
    description: "Get emailed when a tutor sends you a message",
    enabled: false,
  },
  {
    key: "platform-announcements",
    title: "Email — Platform Announcements",
    description: "Updates and news from Arch City Tutors",
    enabled: true,
  },
  {
    key: "in-app-notifications",
    title: "In-App Notifications",
    description: "Show notification badges in the dashboard",
    enabled: true,
  },
];

const faqItems = [
  {
    question: "How do I book a tutoring session?",
    answer: "",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Full tutor session rate is required if you cancel within 12 hours of the session start time. The $5 scheduling fee is non-refundable.",
  },
  {
    question: "How do I pay my tutor?",
    answer: "",
  },
  {
    question: "What subjects are available for tutoring?",
    answer: "",
  },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition ${
        enabled ? "bg-[#d61c3f]" : "bg-[#e5e7eb]"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
          enabled ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function StudentSettingsPage() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(1);

  function togglePreference(key: string) {
    setPreferences((current) =>
      current.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  }

  function toggleFaq(index: number) {
    setOpenFaqIndex((current) => (current === index ? null : index));
  }

  return (
    <StudentShell>
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="flex items-center justify-between pb-5">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Settings</h1>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-semibold text-[#d61c3f]">
            JD
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[18px] font-bold text-[#20242b]">Notification Preferences</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              Choose how and when you want to receive notifications.
            </p>

            <div className="mt-4 divide-y divide-[#eceef2]">
              {preferences.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-[14px] font-semibold text-[#20242b]">{item.title}</p>
                    <p className="mt-1 text-[12px] text-[#6b7280]">{item.description}</p>
                  </div>
                  <Toggle enabled={item.enabled} onToggle={() => togglePreference(item.key)} />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white"
            >
              Save Preferences
            </button>
          </section>

          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[18px] font-bold text-[#20242b]">Change Password</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              Use a strong password you don&apos;t use elsewhere.
            </p>

            <div className="mt-4 grid gap-4">
              {[
                { label: "Current Password", placeholder: "Enter current password" },
                { label: "New Password", placeholder: "Min. 8 characters" },
                { label: "Confirm New Password", placeholder: "Repeat new password" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">
                    {field.label}
                  </label>
                  <input
                    type="password"
                    placeholder={field.placeholder}
                    className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white"
            >
              Update Password
            </button>
          </section>

          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[18px] font-bold text-[#20242b]">Help & FAQ&apos;s</h2>

            <div className="mt-4 space-y-2">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <button
                    key={item.question}
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="block w-full rounded-[12px] border border-[#eceef2] bg-[#fafafb] px-4 py-3 text-left"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[14px] font-semibold text-[#20242b]">{item.question}</p>
                      {isOpen ? (
                        <FiChevronDown className="h-4 w-4 text-[#9ca3af]" />
                      ) : (
                        <FiChevronRight className="h-4 w-4 text-[#9ca3af]" />
                      )}
                    </div>
                    {isOpen && item.answer ? (
                      <p className="mt-2 text-[12px] leading-6 text-[#6b7280]">{item.answer}</p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[18px] font-bold text-[#20242b]">Contact Support</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              Reach out to the Arch City Tutors management team.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                <FiPhone className="h-4 w-4" />
                <span>(314) 252-0967</span>
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                <FiMail className="h-4 w-4" />
                <span>Email Support</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </StudentShell>
  );
}
