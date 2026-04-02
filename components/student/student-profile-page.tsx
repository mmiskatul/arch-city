"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBell, FiCheckCircle, FiHelpCircle, FiLogOut } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import { studentScheduleItems } from "@/lib/student/schedule-data";

export type StudentProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  gradeLevel: string;
  initials: string;
  planName: string;
  planPrice: string;
  renewsOn: string;
  activePlanLabel: string;
};

type StudentProfileUpdatePayload = {
  first_name: string;
  last_name: string;
  grade_level: string;
};

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  gradeLevel: string;
};

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

function deriveInitials(firstName: string, lastName: string): string {
  const first = firstName.trim();
  const last = lastName.trim();
  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }
  if (first) {
    return first.slice(0, 2).toUpperCase();
  }
  return "ST";
}

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

async function updateStudentProfile(
  payload: StudentProfileUpdatePayload,
): Promise<StudentProfileData> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const data = await browserApiRequest<{
    first_name: string;
    last_name: string;
    email: string;
    grade_level: string;
    initials: string;
    plan_name: string;
    plan_price: string;
    renews_on: string;
    active_plan_label: string;
  }>({
    url: `${baseUrl}/student/profile`,
    method: "PUT",
    data: payload,
  });

  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    gradeLevel: data.grade_level,
    initials: data.initials,
    planName: data.plan_name,
    planPrice: data.plan_price,
    renewsOn: data.renews_on,
    activePlanLabel: data.active_plan_label,
  };
}

function PersonalInfoSection({
  values,
  isSaving,
  saveError,
  saveSuccess,
  lastSavedAt,
  onChange,
  onSave,
}: {
  values: ProfileFormValues;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: string | null;
  lastSavedAt: string | null;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  onSave: () => void;
}) {
  return (
    <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[18px] font-bold text-[#20242b]">Personal Information</h3>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">First Name</label>
          <input
            value={values.firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#20242b]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Last Name</label>
          <input
            value={values.lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#20242b]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Email Address</label>
          <input
            value={values.email}
            readOnly
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#6b7280]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Grade Level</label>
          <input
            value={values.gradeLevel}
            onChange={(event) => onChange("gradeLevel", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#20242b]"
          />
        </div>
      </div>

      {saveError ? <p className="mt-4 text-[13px] text-[#d61c3f]">{saveError}</p> : null}
      {saveSuccess ? <p className="mt-4 text-[13px] text-[#1b8a5a]">{saveSuccess}</p> : null}
      {lastSavedAt ? (
        <p className="mt-2 text-[12px] text-[#6b7280]">Last saved at {lastSavedAt}</p>
      ) : null}
    </section>
  );
}

function ManagePlanSection({ profile }: { profile: StudentProfileData }) {
  return (
    <section className="space-y-4">
      <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h3 className="text-[18px] font-bold text-[#20242b]">Subscription Plan</h3>

        <div className="mt-4 rounded-[12px] bg-[#fafafb] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-bold text-[#20242b]">{profile.planName}</p>
              <p className="text-[13px] text-[#6b7280]">
                {profile.planPrice} - Renews {profile.renewsOn}
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
            { label: "Current Plan", value: profile.planName },
            { label: "Monthly Cost", value: profile.planPrice },
            { label: "Renewal Date", value: profile.renewsOn },
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

export function StudentProfilePage({ profile }: { profile: StudentProfileData }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Personal Info");
  const [currentProfile, setCurrentProfile] = useState<StudentProfileData>(profile);
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    gradeLevel: profile.gradeLevel,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const handleFieldChange = (field: keyof ProfileFormValues, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleSaveChanges = async () => {
    const firstName = formValues.firstName.trim();
    const lastName = formValues.lastName.trim();
    const gradeLevel = formValues.gradeLevel.trim();

    if (!firstName || !lastName || !gradeLevel) {
      setSaveError("First name, last name, and grade level are required.");
      setSaveSuccess(null);
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const updated = await updateStudentProfile({
        first_name: firstName,
        last_name: lastName,
        grade_level: gradeLevel,
      });

      const resolvedProfile: StudentProfileData = {
        ...updated,
        initials: updated.initials || deriveInitials(updated.firstName, updated.lastName),
      };

      setCurrentProfile(resolvedProfile);
      setFormValues({
        firstName: resolvedProfile.firstName,
        lastName: resolvedProfile.lastName,
        email: resolvedProfile.email,
        gradeLevel: resolvedProfile.gradeLevel,
      });
      setSaveSuccess("Profile updated successfully.");
      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      window.dispatchEvent(
        new CustomEvent("arch-profile-updated", {
          detail: {
            role: "student",
            firstName: resolvedProfile.firstName,
            lastName: resolvedProfile.lastName,
            email: resolvedProfile.email,
            initials: resolvedProfile.initials,
          },
        }),
      );
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StudentShell>
      <div className="w-full">
        <div className="flex items-center justify-between pb-5">
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
              {currentProfile.initials}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe7eb] text-[20px] font-bold text-[#d61c3f]">
                  {currentProfile.initials}
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#20242b]">
                    {currentProfile.firstName} {currentProfile.lastName}
                  </h2>
                  <p className="text-[13px] text-[#6b7280]">
                    {currentProfile.email} - {currentProfile.gradeLevel}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-[#eaf7ef] px-2.5 py-1 text-[11px] font-medium text-[#2d8f5f]">
                    {currentProfile.activePlanLabel}
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

          {activeTab === "Personal Info" ? (
            <PersonalInfoSection
              values={formValues}
              isSaving={isSaving}
              saveError={saveError}
              saveSuccess={saveSuccess}
              lastSavedAt={lastSavedAt}
              onChange={handleFieldChange}
              onSave={handleSaveChanges}
            />
          ) : null}
          {activeTab === "Manage Plan" ? <ManagePlanSection profile={currentProfile} /> : null}
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

