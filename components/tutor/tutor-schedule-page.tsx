"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useDashboardAuth } from "@/components/auth/dashboard-auth-context";
import { TutorShell } from "@/components/tutor/tutor-shell";
import { TUTOR_SCHEDULE_ROUTE } from "@/lib/routes";
import { fetchTutorScheduleItemsClient } from "@/lib/api/tutor-schedule-browser-api";
import { getAdminPreviewTutorSchedule } from "@/lib/admin-preview-data";
import { useTutorApplicationStatus } from "@/lib/tutor/use-tutor-application-status";
import { type TutorScheduleItem, type TutorScheduleStatus } from "@/lib/tutor/schedule-data";

const tabs: Array<{ key: TutorScheduleStatus; label: string }> = [
  { key: "Upcoming", label: "Upcoming" },
  { key: "Expired", label: "Expired" },
  { key: "Completion Requested", label: "Requested" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

function typeClass(type: TutorScheduleItem["type"]) {
  return type === "Virtual"
    ? "bg-[#ffecef] text-[#d94a62]"
    : "bg-[#f1f1f1] text-[#6b7280]";
}

function statusClass(status: TutorScheduleStatus) {
  if (status === "Completion Requested") {
    return "bg-[#fff6de] text-[#9c7a1e]";
  }

  if (status === "Completed") {
    return "bg-[#ebf7ef] text-[#1b8a5a]";
  }

  if (status === "Cancelled") {
    return "bg-[#f1f1f1] text-[#6b7280]";
  }

  if (status === "Expired") {
    return "bg-[#fff1f2] text-[#b42318]";
  }

  return "bg-[#fff6de] text-[#b58112]";
}

function ScheduleTableSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <div
          key={`schedule-skeleton-row-${rowIndex}`}
          className="grid grid-cols-[1.65fr_0.8fr_1fr_0.8fr_0.9fr_0.8fr_0.7fr_0.9fr_0.8fr] gap-4 px-4 py-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-[#eef1f4]" />
            <div className="h-4 w-44 rounded bg-[#eef1f4]" />
          </div>
          <div className="h-4 w-16 rounded bg-[#eef1f4]" />
          <div className="h-4 w-24 rounded bg-[#eef1f4]" />
          <div className="h-4 w-20 rounded bg-[#eef1f4]" />
          <div className="h-4 w-16 rounded bg-[#eef1f4]" />
          <div className="h-6 w-20 rounded-full bg-[#eef1f4]" />
          <div className="h-4 w-14 rounded bg-[#eef1f4]" />
          <div className="h-6 w-20 rounded-full bg-[#eef1f4]" />
          <div className="h-8 w-16 rounded-full bg-[#eef1f4]" />
        </div>
      ))}
    </div>
  );
}

export function TutorSchedulePage() {
  const { isPreviewSession, previewTargetId } = useDashboardAuth();
  const resolvedPreviewTargetId = previewTargetId ?? undefined;
  const [activeTab, setActiveTab] = useState<TutorScheduleStatus>("Upcoming");
  const [sessions, setSessions] = useState<TutorScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { isBlocked: isPending } = useTutorApplicationStatus();
  const isScheduleBlocked = !isPreviewSession && isPending;

  useEffect(() => {
    let mounted = true;

    async function loadSchedule() {
      try {
        setLoadError(null);
        const liveSessions = isPreviewSession ? getAdminPreviewTutorSchedule(resolvedPreviewTargetId) : await fetchTutorScheduleItemsClient();
        if (mounted) {
          setSessions(liveSessions);
        }
      } catch (error) {
        if (mounted) {
          setSessions(getAdminPreviewTutorSchedule(resolvedPreviewTargetId));
          setLoadError(error instanceof Error ? error.message : "Unable to load schedule.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadSchedule();

    return () => {
      mounted = false;
    };
  }, [isPreviewSession, resolvedPreviewTargetId]);

  const filteredSessions = useMemo(
    () =>
      isScheduleBlocked
        ? []
        : sessions.filter((item) => item.status === activeTab),
    [activeTab, isScheduleBlocked, sessions],
  );
  const counts = useMemo(
    () =>
      isScheduleBlocked
        ? { Upcoming: 0, Expired: 0, "Completion Requested": 0, Completed: 0, Cancelled: 0 }
        : sessions.reduce<Record<TutorScheduleStatus, number>>(
            (acc, item) => {
              acc[item.status] += 1;
              return acc;
            },
            {
              Upcoming: 0,
              Expired: 0,
              "Completion Requested": 0,
              Completed: 0,
              Cancelled: 0,
            },
          ),
    [isScheduleBlocked, sessions],
  );

  const isTableLoading = loading || isScheduleBlocked;

  return (
    <TutorShell>
      <div className="w-full">
        <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">My Schedule</h1>

        <div className="mt-5 rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 border-b border-[#eceef2] px-4 py-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                const badgeClass =
                  tab.key === "Upcoming"
                    ? "bg-[#d61c3f] text-white"
                    : tab.key === "Expired"
                      ? "bg-[#b42318] text-white"
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
                <span>Student</span>
                <span>Grade</span>
                <span>Date</span>
                <span>Time</span>
                <span>Duration</span>
                <span>Type</span>
                <span>Rate</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {isTableLoading ? (
                <ScheduleTableSkeleton />
              ) : (
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
                      {loadError
                        ? loadError
                        : isPending
                          ? "No sessions yet. Complete your tutor application first."
                          : "No sessions in this section right now."}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TutorShell>
  );
}


