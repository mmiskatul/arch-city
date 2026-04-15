"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheck, FiEdit2, FiMail, FiPhone } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import { getParentScheduleItems } from "@/lib/api/parent-schedule-browser-api";
import type { ParentSessionHistoryItem } from "@/lib/api/parent-schedule-types";
import { getParentStudents, type ParentStudentListItem } from "@/lib/api/parent-students-api";
import {
  parentPlanOptions,
  parentProfile,
} from "@/lib/parent/profile-data";
import { PARENT_STUDENTS_ROUTE } from "@/lib/routes";

type ParentProfileTab = "Personal Info" | "Plan & Billing" | "History";

type ParentProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  initials: string;
  title: string;
  status: string;
};

type ParentProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

const profileTabs: ParentProfileTab[] = ["Personal Info", "Plan & Billing", "History"];
const parentBillingHistory: Array<{ id: string; date: string; description: string; amount: string; status: string }> = [];

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

function deriveInitials(firstName: string, lastName: string): string {
  const first = firstName.trim();
  const last = lastName.trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  return "PA";
}

function normalizeStudentDisplayName(value: string) {
  return String(value || "")
    .replace(/\s+update'?s?\s*$/i, "")
    .trim();
}

function monthLabelFromDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function deriveCurrentPlan(students: ParentStudentListItem[]) {
  const studentCount = students.filter((student) => student.status !== "declined").length;
  const matchingOption =
    parentPlanOptions.find((option) => {
      const match = option.studentLimitLabel.match(/(\d+)/g);
      if (!match?.length) return false;
      const limit = Number(match[match.length - 1]);
      return studentCount <= limit;
    }) ?? parentPlanOptions[parentPlanOptions.length - 1];

  return {
    ...matchingOption,
    summary: `${matchingOption.studentLimitLabel} - Unlimited sessions`,
    enrolledStudents: studentCount,
    currentTierId: matchingOption.id,
  };
}

function mapParentProfile(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  initials: string;
  title: string;
  status: string;
}): ParentProfileData {
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone_number,
    streetAddress: data.street_address,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    initials: data.initials || deriveInitials(data.first_name, data.last_name),
    title: data.title,
    status: data.status,
  };
}

async function getParentProfile(): Promise<ParentProfileData> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const data = await browserApiRequest<{
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    initials: string;
    title: string;
    status: string;
  }>({
    url: `${baseUrl}/parent/profile`,
    method: "GET",
  });
  return mapParentProfile(data as never);
}

async function saveParentProfile(values: ParentProfileForm): Promise<ParentProfileData> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const data = await browserApiRequest<{
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    initials: string;
    title: string;
    status: string;
  }>({
    url: `${baseUrl}/parent/profile`,
    method: "PUT",
    data: {
      first_name: values.firstName.trim(),
      last_name: values.lastName.trim(),
      phone_number: values.phone.trim(),
      street_address: values.streetAddress.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      zip_code: values.zipCode.trim(),
    },
  });
  return mapParentProfile(data as never);
}

function InputField({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold text-[#20242b]">{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        className={`h-11 w-full rounded-lg border border-[#e5e7eb] px-4 text-[14px] ${
          readOnly ? "bg-[#fafafa] text-[#6b7280]" : "bg-white text-[#20242b]"
        }`}
      />
    </div>
  );
}

function PersonalInfoSection({
  values,
  onChange,
  onSave,
  onDiscard,
  isSaving,
  error,
  success,
  lastSavedAt,
}: {
  values: ParentProfileForm;
  onChange: (field: keyof ParentProfileForm, value: string) => void;
  onSave: () => void;
  onDiscard: () => void;
  isSaving: boolean;
  error: string | null;
  success: string | null;
  lastSavedAt: string | null;
}) {
  return (
    <section className="p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">Personal Information</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <InputField label="First Name" value={values.firstName} onChange={(value) => onChange("firstName", value)} />
        <InputField label="Last Name" value={values.lastName} onChange={(value) => onChange("lastName", value)} />
        <InputField label="Email Address" value={values.email} readOnly />
        <InputField label="Phone Number" value={values.phone} onChange={(value) => onChange("phone", value)} />
        <div className="md:col-span-2">
          <InputField
            label="Street Address"
            value={values.streetAddress}
            onChange={(value) => onChange("streetAddress", value)}
          />
        </div>
        <InputField label="City" value={values.city} onChange={(value) => onChange("city", value)} />
        <InputField label="State" value={values.state} onChange={(value) => onChange("state", value)} />
        <InputField label="ZIP Code" value={values.zipCode} onChange={(value) => onChange("zipCode", value)} />
      </div>

      {error ? <p className="mt-4 text-[13px] text-[#d61c3f]">{error}</p> : null}
      {success ? <p className="mt-4 text-[13px] text-[#1b8a5a]">{success}</p> : null}
      {lastSavedAt ? (
        <p className="mt-2 text-[12px] text-[#6b7280]">Last saved at {lastSavedAt}</p>
      ) : null}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onDiscard}
          className="inline-flex h-11 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Personal Info"}
        </button>
      </div>
    </section>
  );
}

function PlanAndBillingSection({
  currentPlan,
}: {
  currentPlan: ReturnType<typeof deriveCurrentPlan>;
}) {
  return (
    <section className="p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">Plan & Billing</h3>

      <div className="mt-5 rounded-[12px] bg-[#fff0f3] px-4 py-4">
        <p className="text-[16px] font-bold text-[#d61c3f]">
          {currentPlan.name} - Currently Active
        </p>
        <p className="mt-1 text-[13px] text-[#6b7280]">
          {currentPlan.enrolledStudents} students enrolled - Unlimited sessions
        </p>
      </div>

      <div className="mt-6">
        <h4 className="text-[18px] font-bold text-[#20242b]">Available Plans</h4>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {parentPlanOptions.map((plan) => {
            const current = plan.id === currentPlan.currentTierId;
            const buttonClassName = current
              ? "bg-[#eceef2] text-[#9ca3af]"
              : plan.actionLabel === "Downgrade"
                ? "border border-[#d61c3f] text-[#d61c3f] hover:bg-[#fff4f6]"
                : "bg-[#d61c3f] text-white hover:bg-[#be1837]";

            return (
              <article
                key={plan.id}
                className={`relative rounded-[16px] border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
                  current ? "border-[#d61c3f]" : "border-[#eceef2]"
                }`}
              >
                {current ? (
                  <span className="absolute right-5 top-[-11px] inline-flex rounded-full bg-[#d61c3f] px-4 py-1 text-[11px] font-semibold text-white">
                    Current Plan
                  </span>
                ) : null}

                <p className="text-[16px] font-bold text-[#20242b]">{plan.name}</p>
                <p className="mt-3 max-w-[280px] text-[13px] leading-5 text-[#6b7280]">
                  Fixed monthly fee based on the number Students included in a parent&apos;s profile
                </p>
                <p className="mt-4 text-[18px] font-bold text-[#20242b]">{plan.price}</p>
                {current ? (
                  <p className="mt-1 text-[12px] font-semibold text-[#6b7280]">Active</p>
                ) : null}

                <div className="mt-4 space-y-2">
                  {[
                    plan.studentLimitLabel,
                    "Top Class vetted tutors",
                    "Access to our vast network of tutors",
                    "24/7 support from our team",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                      <FiCheck className="h-4 w-4 text-[#3d9b68]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={current}
                  className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-[14px] font-semibold transition ${buttonClassName}`}
                >
                  {plan.actionLabel}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h4 className="text-[16px] font-bold text-[#20242b]">Recent Charges</h4>
        <div className="mt-4 overflow-hidden rounded-[12px] border border-[#eceef2]">
          <table className="min-w-full table-fixed border-collapse">
            <thead className="bg-[#fafbfc] text-left text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[14px] text-[#374151]">
              {parentBillingHistory.map((entry) => (
                <tr key={entry.id} className="border-t border-[#eceef2]">
                  <td className="px-4 py-3">{entry.date}</td>
                  <td className="px-4 py-3">{entry.description}</td>
                  <td className="px-4 py-3 font-semibold text-[#20242b]">{entry.amount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
              {parentBillingHistory.length === 0 ? (
                <tr className="border-t border-[#eceef2]">
                  <td className="px-4 py-4 text-[#6b7280]" colSpan={4}>
                    No billing records available yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function HistorySection({
  historyItems,
  students,
}: {
  historyItems: ParentSessionHistoryItem[];
  students: ParentStudentListItem[];
}) {
  const studentFilters = ["All", ...students.map((student) => student.name)] as const;
  const [historyFilter, setHistoryFilter] = useState<string>("All");

  const filteredItems =
    historyFilter === "All"
      ? historyItems.filter((item) => item.status !== "Upcoming")
      : historyItems.filter((item) => item.studentName === historyFilter && item.status !== "Upcoming");

  const groupedItems = filteredItems.reduce<Record<string, ParentSessionHistoryItem[]>>((groups, item) => {
    const monthLabel = monthLabelFromDate(item.sessionDate || item.fullDate || item.createdAt);
    if (!groups[monthLabel]) {
      groups[monthLabel] = [];
    }
    groups[monthLabel].push(item);
    return groups;
  }, {});

  const orderedGroups = Object.entries(groupedItems).sort(([left], [right]) => {
    const leftDate = new Date(`${left} 1`).getTime();
    const rightDate = new Date(`${right} 1`).getTime();
    return rightDate - leftDate;
  });

  return (
    <section className="p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">History</h3>
      <div className="mt-5 flex items-center gap-3 border-b border-[#eceef2] pb-4">
        {studentFilters.map((filter) => {
          const active = historyFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setHistoryFilter(filter)}
              className={`inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-medium transition ${
                active
                  ? "border-[#d61c3f] bg-[#fff4f6] text-[#d61c3f]"
                  : "border-[#d1d5db] bg-white text-[#4b5563] hover:border-[#d61c3f] hover:text-[#d61c3f]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-5">
        {orderedGroups.map(([monthLabel, items]) => (
          <section key={monthLabel}>
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#5f6673]">
              {monthLabel}
            </p>
            <div className="mt-3 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-[14px] border border-[#eceef2] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[16px] font-bold text-[#d94a62]">
                      {item.tutorInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[16px] font-bold text-[#20242b]">{item.tutorName}</p>
                      <p className="text-[13px] text-[#6b7280]">
                        {item.subject} - {item.date} - {item.time}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[12px] text-[#6b7280]">
                        <span className="font-semibold text-[#d61c3f]">{item.studentInitials}</span>
                        <span>{item.studentName}</span>
                        <span>-</span>
                        <span>{item.duration}</span>
                        <span>-</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-medium text-[#4b5563]">{item.status}</p>
                    <p className="mt-4 text-[24px] font-bold text-[#20242b]">{item.rate}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        {filteredItems.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[#d1d5db] bg-white px-5 py-10 text-center text-[14px] text-[#6b7280]">
            No history found for this student.
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ParentProfilePage() {
  const [activeTab, setActiveTab] = useState<ParentProfileTab>("Personal Info");
  const [currentProfile, setCurrentProfile] = useState<ParentProfileData>(parentProfile);
  const [formValues, setFormValues] = useState<ParentProfileForm>(parentProfile);
  const [linkedStudents, setLinkedStudents] = useState<ParentStudentListItem[]>([]);
  const [historyItems, setHistoryItems] = useState<ParentSessionHistoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const currentPlan = deriveCurrentPlan(linkedStudents);

  useEffect(() => {
    getParentProfile()
      .then((profileData) => {
        setCurrentProfile(profileData);
        setFormValues({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
          streetAddress: profileData.streetAddress,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
        });
      })
      .catch(() => {
        // Keep existing fallback data.
      });
  }, []);

  useEffect(() => {
    getParentStudents()
      .then((response) => {
        setLinkedStudents(response.items || []);
      })
      .catch(() => {
        setLinkedStudents([]);
      });

    getParentScheduleItems()
      .then((response) => {
        setHistoryItems(response.items || []);
      })
      .catch(() => {
        setHistoryItems([]);
      });
  }, []);

  const handleFormChange = (field: keyof ParentProfileForm, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleDiscard = () => {
    setFormValues({
      firstName: currentProfile.firstName,
      lastName: currentProfile.lastName,
      email: currentProfile.email,
      phone: currentProfile.phone,
      streetAddress: currentProfile.streetAddress,
      city: currentProfile.city,
      state: currentProfile.state,
      zipCode: currentProfile.zipCode,
    });
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const updated = await saveParentProfile(formValues);
      setCurrentProfile(updated);
      setFormValues({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        streetAddress: updated.streetAddress,
        city: updated.city,
        state: updated.state,
        zipCode: updated.zipCode,
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
            role: "parent",
            firstName: updated.firstName,
            lastName: updated.lastName,
            email: updated.email,
            phone: updated.phone,
            initials: updated.initials,
          },
        }),
      );
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ParentShell>
      <div className="w-full">
        <div className="border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">My Profile</h1>
        </div>

        <div className="grid rounded-b-[12px] border border-t-0 border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="border-b border-[#eceef2] p-4 xl:border-r xl:border-b-0">
            <div className="flex flex-col items-center border-b border-[#eceef2] pb-4 text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#ffe7eb] text-[40px] font-bold text-[#d61c3f]">
                {currentProfile.initials}
                <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#d61c3f] text-white">
                  <FiEdit2 className="h-3.5 w-3.5" />
                </span>
              </div>
              <h2 className="mt-5 text-[18px] font-bold text-[#20242b]">
                {currentProfile.firstName} {currentProfile.lastName}
              </h2>
              <p className="text-[14px] text-[#6b7280]">{currentProfile.title}</p>
              <div className="mt-3 inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
                {currentProfile.status}
              </div>
            </div>

            <div className="space-y-3 border-b border-[#eceef2] py-4 text-[13px] text-[#4b5563]">
              <div className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-[#6b7280]" />
                <span>{currentProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-[#6b7280]" />
                <span>{currentProfile.phone}</span>
              </div>
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">My Students</p>
              <div className="mt-3 space-y-3">
                {linkedStudents.map((student) => (
                  <div key={student.id} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[11px] font-bold text-[#d61c3f]">{student.initials}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">{normalizeStudentDisplayName(student.name)}</p>
                      <p className="text-[12px] text-[#6b7280]">{student.grade}</p>
                    </div>
                  </div>
                ))}
                {linkedStudents.length === 0 ? (
                  <p className="text-[12px] text-[#6b7280]">No linked students yet.</p>
                ) : null}
              </div>
              <Link
                href={PARENT_STUDENTS_ROUTE}
                className="mt-3 inline-flex text-[13px] font-semibold text-[#d61c3f] transition hover:text-[#be1837]"
              >
                Manage students -&gt;
              </Link>
            </div>

            <div className="pt-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">Current Plan</p>
              <div className="mt-3 rounded-[12px] bg-[#fff0f3] px-4 py-4">
                <p className="text-[16px] font-bold text-[#d61c3f]">{currentPlan.name}</p>
                <p className="mt-1 text-[12px] text-[#6b7280]">{currentPlan.summary}</p>
              </div>
              <button
                type="button"
                className="mt-3 text-[13px] font-semibold text-[#d61c3f] transition hover:text-[#be1837]"
              >
                Manage plan -&gt;
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="border-b border-[#eceef2] px-4">
              <div className="flex flex-wrap items-center gap-8 overflow-x-auto">
                {profileTabs.map((tab) => {
                  const active = tab === activeTab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`border-b-2 px-1 py-4 text-[15px] font-medium transition ${
                        active
                          ? "border-[#d61c3f] text-[#d61c3f]"
                          : "border-transparent text-[#4b5563] hover:text-[#20242b]"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === "Personal Info" ? (
              <PersonalInfoSection
                values={formValues}
                onChange={handleFormChange}
                onSave={handleSave}
                onDiscard={handleDiscard}
                isSaving={isSaving}
                error={saveError}
                success={saveSuccess}
                lastSavedAt={lastSavedAt}
              />
            ) : null}
            {activeTab === "Plan & Billing" ? <PlanAndBillingSection currentPlan={currentPlan} /> : null}
            {activeTab === "History" ? <HistorySection historyItems={historyItems} students={linkedStudents.map((student) => ({ ...student, name: normalizeStudentDisplayName(student.name) }))} /> : null}
          </section>
        </div>
      </div>
    </ParentShell>
  );
}

