"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { TUTOR_SCHEDULE_ROUTE } from "@/lib/routes";
import {
  getTutorScheduleCounts,
  tutorScheduleItems,
  type TutorScheduleItem,
  type TutorScheduleStatus,
} from "@/lib/tutor/schedule-data";

const tabs: Array<{ key: TutorScheduleStatus; label: string }> = [
  { key: "Upcoming", label: "Upcoming" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

function typeClass(type: TutorScheduleItem["type"]) {
  return type === "Virtual"
    ? "bg-[#ffecef] text-[#d94a62]"
    : "bg-[#f1f1f1] text-[#6b7280]";
}

function statusClass(status: TutorScheduleStatus) {
  if (status === "Completed") {
    return "bg-[#ebf7ef] text-[#1b8a5a]";
  }

  if (status === "Cancelled") {
    return "bg-[#f1f1f1] text-[#6b7280]";
  }

  return "bg-[#fff6de] text-[#b58112]";
}

export function TutorSchedulePage() {
  const [activeTab, setActiveTab] = useState<TutorScheduleStatus>("Upcoming");

  const filteredSessions = useMemo(
    () => tutorScheduleItems.filter((item) => item.status === activeTab),
    [activeTab],
  );
  const counts = useMemo(() => getTutorScheduleCounts(), []);

  return (
    <TutorShell>
      <div className="w-full">
        <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">My Schedule</h1>

        <div className="mt-5 overflow-hidden rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 border-b border-[#eceef2] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                const badgeClass =
                  tab.key === "Upcoming"
                    ? "bg-[#d61c3f] text-white"
                    : tab.key === "Completed"
                      ? "bg-[#1b8a5a] text-white"
                      : "bg-[#e5e7eb] text-[#6b7280]";

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 border-b-2 pb-3 text-[14px] font-semibold transition ${
                      active
                        ? "border-[#d61c3f] text-[#d61c3f]"
                        : "border-transparent text-[#6b7280]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${badgeClass}`}>
                      {counts[tab.key]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-[14px] text-[#6b7280]">
              <div className="h-8 w-[128px] rounded-lg border border-[#e5e7eb] bg-[#fafafa]" />
              <span>to</span>
              <div className="h-8 w-[128px] rounded-lg border border-[#e5e7eb] bg-[#fafafa]" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[1.65fr_0.8fr_1fr_0.8fr_0.9fr_0.8fr_0.7fr_0.9fr_0.8fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Student ↕</span>
                <span>Grade</span>
                <span>Date ↕</span>
                <span>Time ↕</span>
                <span>Duration</span>
                <span>Type</span>
                <span>Rate ↕</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="grid grid-cols-[1.65fr_0.8fr_1fr_0.8fr_0.9fr_0.8fr_0.7fr_0.9fr_0.8fr] gap-4 px-4 py-4 text-[14px] text-[#4b5563]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                        {session.studentInitials}
                      </span>
                      <span className="font-medium text-[#4b5563]">{session.studentName}</span>
                    </div>

                    <div>{session.grade}</div>
                    <div>{session.date}</div>
                    <div>{session.time}</div>
                    <div>{session.duration}</div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${typeClass(session.type)}`}>
                        {session.type}
                      </span>
                    </div>
                    <div className="font-semibold text-[#374151]">{session.rate}</div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div>
                      <Link
                        href={`${TUTOR_SCHEDULE_ROUTE}/${session.id}`}
                        className="inline-flex rounded-full border border-[#d61c3f] px-4 py-1.5 text-[12px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}

                {filteredSessions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">
                    No sessions in this section right now.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TutorShell>
  );
}
