"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiBell } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_FIND_TUTORS_ROUTE, STUDENT_SCHEDULE_ROUTE } from "@/lib/routes";
import { studentScheduleItems, type StudentScheduleItem } from "@/lib/student/schedule-data";

type ScheduleTab = "Upcoming" | "Completed" | "Cancelled";

const tabs: Array<{ key: ScheduleTab; label: string }> = [
  { key: "Upcoming", label: "Upcoming" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

function pillClass(type: StudentScheduleItem["type"]) {
  return type === "Virtual"
    ? "bg-[#ffecef] text-[#d94a62]"
    : "bg-[#f1f1f1] text-[#6b7280]";
}

function statusClass(status: StudentScheduleItem["status"]) {
  if (status === "Completed") {
    return "bg-[#ebf7ef] text-[#1b8a5a]";
  }

  if (status === "Cancelled") {
    return "bg-[#f8ecef] text-[#c05b6d]";
  }

  return "bg-[#fff6de] text-[#b58112]";
}

export function StudentSchedulePage({ initialSessions }: { initialSessions?: StudentScheduleItem[] }) {
  const [activeTab, setActiveTab] = useState<ScheduleTab>("Upcoming");
  const sessions = initialSessions ?? studentScheduleItems;

  const filteredSessions = useMemo(
    () => sessions.filter((item) => item.status === activeTab),
    [activeTab, sessions],
  );

  const counts = useMemo(
    () => ({
      Upcoming: sessions.filter((item) => item.status === "Upcoming").length,
      Completed: sessions.filter((item) => item.status === "Completed").length,
      Cancelled: sessions.filter((item) => item.status === "Cancelled").length,
    }),
    [sessions],
  );

  return (
    <StudentShell>
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">My Schedule</h1>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <Link
              href={STUDENT_FIND_TUTORS_ROUTE}
              className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
            >
              + Book Session
            </Link>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f4f4f5]"
              aria-label="Notifications"
            >
              <FiBell className="h-4 w-4" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-semibold text-[#d61c3f]">
              JD
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-[12px] border border-[#e7e7eb] bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 border-b border-[#eceef2] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
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
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                        tab.key === "Completed"
                          ? "bg-[#1b8a5a] text-white"
                          : tab.key === "Upcoming"
                            ? "bg-[#d61c3f] text-white"
                            : "bg-[#e5e7eb] text-[#6b7280]"
                      }`}
                    >
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
            <div className="min-w-[920px]">
              <div className="grid grid-cols-[1.15fr_1.65fr_1.15fr_0.8fr_0.9fr_0.9fr_1fr_1.2fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Date ↕</span>
                <span>Tutor ↕</span>
                <span>Subject</span>
                <span>Time ↕</span>
                <span>Duration</span>
                <span>Type</span>
                <span>Status ↕</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="grid grid-cols-[1.15fr_1.65fr_1.15fr_0.8fr_0.9fr_0.9fr_1fr_1.2fr] gap-4 px-4 py-4 text-[14px] text-[#4b5563]"
                  >
                    <div className="font-semibold text-[#4b5563]">{session.date}</div>

                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                        {session.tutorInitials}
                      </span>
                      <span className="font-medium text-[#4b5563]">{session.tutorName}</span>
                    </div>

                    <div>{session.subject}</div>
                    <div>{session.time}</div>
                    <div>{session.duration}</div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${pillClass(session.type)}`}>
                        {session.type}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`${STUDENT_SCHEDULE_ROUTE}/${session.id}`}
                        className="inline-flex rounded-full border border-[#d61c3f] px-4 py-1.5 text-[12px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                      >
                        View
                      </Link>
                      {session.status === "Upcoming" ? (
                        <button
                          type="button"
                          className="inline-flex rounded-full border border-[#f09aaa] px-4 py-1.5 text-[12px] font-semibold text-[#d94a62] transition hover:bg-[#fff4f6]"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
