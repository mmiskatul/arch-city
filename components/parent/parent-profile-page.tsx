"use client";

import Link from "next/link";
import { useState } from "react";
import { FiCheck, FiEdit2, FiMail, FiPhone } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import {
  parentBillingHistory,
  parentProfileHistoryItems,
  parentPlan,
  parentPlanOptions,
  parentProfile,
} from "@/lib/parent/profile-data";
import { parentStudentsData } from "@/lib/parent/students-data";
import { PARENT_STUDENTS_ROUTE } from "@/lib/routes";

type ParentProfileTab = "Personal Info" | "Plan & Billing" | "History";

const profileTabs: ParentProfileTab[] = ["Personal Info", "Plan & Billing", "History"];

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold text-[#20242b]">{label}</label>
      <div className="flex min-h-11 items-center rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] text-[#4b5563]">
        {value}
      </div>
    </div>
  );
}

function PersonalInfoSection() {
  return (
    <section className="p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">Personal Information</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="First Name" value={parentProfile.firstName} />
        <ReadOnlyField label="Last Name" value={parentProfile.lastName} />
        <ReadOnlyField label="Email Address" value={parentProfile.email} />
        <ReadOnlyField label="Phone Number" value={parentProfile.phone} />
        <div className="md:col-span-2">
          <ReadOnlyField label="Street Address" value={parentProfile.streetAddress} />
        </div>
        <ReadOnlyField label="City" value={parentProfile.city} />
        <ReadOnlyField label="State" value={parentProfile.state} />
        <ReadOnlyField label="ZIP Code" value={parentProfile.zipCode} />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
        >
          Discard
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
        >
          Save Personal Info
        </button>
      </div>
    </section>
  );
}

function PlanAndBillingSection() {
  return (
    <section className="p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">Plan & Billing</h3>

      <div className="mt-5 rounded-[12px] bg-[#fff0f3] px-4 py-4">
        <p className="text-[16px] font-bold text-[#d61c3f]">
          {parentPlan.name} - Currently Active
        </p>
        <p className="mt-1 text-[13px] text-[#6b7280]">
          {parentPlan.enrolledStudents} students enrolled - Unlimited sessions - Member since{" "}
          {parentPlan.memberSince}
        </p>
      </div>

      <div className="mt-6">
        <h4 className="text-[18px] font-bold text-[#20242b]">Available Plans</h4>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {parentPlanOptions.map((plan) => {
            const current = plan.id === parentPlan.currentTierId;
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
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function HistorySection() {
  const [historyFilter, setHistoryFilter] = useState<"All" | "Jordan" | "Maya">("All");

  const filteredItems =
    historyFilter === "All"
      ? parentProfileHistoryItems
      : parentProfileHistoryItems.filter((item) => item.student === historyFilter);

  const groupedItems = filteredItems.reduce<Record<string, typeof filteredItems>>((groups, item) => {
    if (!groups[item.monthLabel]) {
      groups[item.monthLabel] = [];
    }
    groups[item.monthLabel].push(item);
    return groups;
  }, {});

  return (
    <section className="p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">History</h3>
      <div className="mt-5 flex items-center gap-3 border-b border-[#eceef2] pb-4">
        {(["All", "Jordan", "Maya"] as const).map((filter) => {
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
        {Object.entries(groupedItems).map(([monthLabel, items]) => (
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
                        {item.subject} - {item.dateLabel}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[12px] text-[#6b7280]">
                        <span className="font-semibold text-[#d61c3f]">{item.studentInitials}</span>
                        <span>{item.student}</span>
                        <span>-</span>
                        <span>{item.duration}</span>
                        <span>-</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-medium text-[#4b5563]">{item.status}</p>
                    <p className="mt-4 text-[24px] font-bold text-[#20242b]">{item.amount}</p>
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
                {parentProfile.initials}
                <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#d61c3f] text-white">
                  <FiEdit2 className="h-3.5 w-3.5" />
                </span>
              </div>
              <h2 className="mt-5 text-[18px] font-bold text-[#20242b]">
                {parentProfile.firstName} {parentProfile.lastName}
              </h2>
              <p className="text-[14px] text-[#6b7280]">{parentProfile.title}</p>
              <div className="mt-3 inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
                {parentProfile.status}
              </div>
            </div>

            <div className="space-y-3 border-b border-[#eceef2] py-4 text-[13px] text-[#4b5563]">
              <div className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-[#6b7280]" />
                <span>{parentProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-[#6b7280]" />
                <span>{parentProfile.phone}</span>
              </div>
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">My Students</p>
              <div className="mt-3 space-y-3">
                {parentStudentsData.map((student) => (
                  <div key={student.id} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[11px] font-bold text-[#d61c3f]">{student.initials}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">{student.name}</p>
                      <p className="text-[12px] text-[#6b7280]">{student.grade}</p>
                    </div>
                  </div>
                ))}
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
                <p className="text-[16px] font-bold text-[#d61c3f]">{parentPlan.name}</p>
                <p className="mt-1 text-[12px] text-[#6b7280]">{parentPlan.summary}</p>
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

            {activeTab === "Personal Info" ? <PersonalInfoSection /> : null}
            {activeTab === "Plan & Billing" ? <PlanAndBillingSection /> : null}
            {activeTab === "History" ? <HistorySection /> : null}
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
