"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FiCalendar, FiDollarSign, FiUser, FiUsers } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";

export type DataMode = "static" | "dynamic" | "hybrid";

export type EndpointMeta = {
  data_mode: DataMode;
  current_source: string;
  required_system_additions: string[];
  not_required_for_now: string[];
};

type SummaryCardApi = {
  title: string;
  value: string;
  subtitle: string;
  action: string;
  action_route: string;
  icon: string;
};

type SessionRowApi = {
  student: string;
  tutor: string;
  subject: string;
  session_date: string;
  session_time: string;
  session_type: string;
  status: string;
  amount: string;
};

type PendingActionApi = {
  title: string;
  subtitle: string;
  action_label: string;
  action_route: string;
};

type TopTutorApi = {
  name: string;
  subjects: string[];
  earned_mtd: string;
};

export type AdminDashboardOverviewData = {
  meta: EndpointMeta;
  today_label: string;
  summary_meta: EndpointMeta;
  recent_sessions_meta: EndpointMeta;
  pending_actions_meta: EndpointMeta;
  top_tutors_meta: EndpointMeta;
  summary_cards: SummaryCardApi[];
  recent_sessions: SessionRowApi[];
  pending_actions: PendingActionApi[];
  top_tutors_this_month: TopTutorApi[];
};

type SummaryCard = SummaryCardApi & {
  iconComponent: IconType;
  iconClassName: string;
};

const defaultMeta: EndpointMeta = {
  data_mode: "static",
  current_source: "Frontend fallback",
  required_system_additions: [],
  not_required_for_now: [],
};

export const defaultAdminDashboardOverviewData: AdminDashboardOverviewData = {
  meta: defaultMeta,
  today_label: "-",
  summary_meta: defaultMeta,
  recent_sessions_meta: defaultMeta,
  pending_actions_meta: defaultMeta,
  top_tutors_meta: defaultMeta,
  summary_cards: [
    {
      title: "Total Students",
      value: "0",
      subtitle: "Verified student accounts",
      action: "View all",
      action_route: "/admin-dashboard/students",
      icon: "FiUsers",
    },
    {
      title: "Total Tutors",
      value: "0",
      subtitle: "Verified tutor accounts",
      action: "View all",
      action_route: "/admin-dashboard/tutors",
      icon: "FiUser",
    },
    {
      title: "Sessions Today",
      value: "0",
      subtitle: "Sessions module not connected yet",
      action: "View schedule",
      action_route: "/admin-dashboard/schedules",
      icon: "FiCalendar",
    },
    {
      title: "Monthly Revenue",
      value: "$0",
      subtitle: "Revenue module not connected yet",
      action: "View finances",
      action_route: "/admin-dashboard/finances",
      icon: "FiDollarSign",
    },
  ],
  recent_sessions: [],
  pending_actions: [],
  top_tutors_this_month: [],
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getModeClassName(mode: string) {
  return mode === "Virtual" ? "bg-[#ffecef] text-[#d94a62]" : "bg-[#f1f1f1] text-[#6b7280]";
}

function getStatusClassName(status: string) {
  if (status === "Completed") return "bg-[#ebf7ef] text-[#239157]";
  if (status === "Cancelled") return "bg-[#ffecef] text-[#d94a62]";
  return "bg-[#fff6de] text-[#b58112]";
}

function getInitialBadgeClass(index: number) {
  const classes = [
    "bg-[#ffe7eb] text-[#d94a62]",
    "bg-[#f1f1f1] text-[#6b7280]",
    "bg-[#ebf7ef] text-[#239157]",
    "bg-[#fff6de] text-[#b58112]",
  ];
  return classes[index % classes.length];
}

function formatDateLabel(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(parsed);
  }
  return value;
}

function formatTimeLabel(value: string) {
  return value.replace(/\s+([AP]M)\b/gi, " $1").trim();
}

function formatDateTimeLabel(sessionDate: string, sessionTime: string) {
  const dateLabel = formatDateLabel(sessionDate);
  const timeLabel = formatTimeLabel(sessionTime);
  return [dateLabel, timeLabel].filter(Boolean).join(" · ");
}

function getSummaryIcon(iconName: string): IconType {
  if (iconName === "FiUser") return FiUser;
  if (iconName === "FiCalendar") return FiCalendar;
  if (iconName === "FiDollarSign") return FiDollarSign;
  return FiUsers;
}

function getSummaryIconClass(title: string) {
  if (title === "Total Tutors") return "bg-[#ebf7ef] text-[#239157]";
  if (title === "Sessions Today") return "bg-[#fff6de] text-[#b58112]";
  if (title === "Monthly Revenue") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#ffecef] text-[#d61c3f]";
}

function SummaryCardView({ card }: { card: SummaryCard }) {
  const Icon = card.iconComponent;

  return (
    <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">{card.title}</p>
          <p className="mt-3 text-[44px] font-bold leading-none text-[#20242b]">{card.value}</p>
          <p className="mt-2 text-[13px] text-[#6b7280]">{card.subtitle}</p>
          <Link href={card.action_route} className="mt-2 inline-flex text-[13px] font-semibold text-[#d61c3f] transition hover:text-[#b81636]">
            {card.action} &#8594;
          </Link>
        </div>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconClassName}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

function RecentSessionsSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[1.5fr_1.2fr_0.9fr_1fr_0.85fr_0.95fr_0.6fr] gap-3 px-4 py-3">
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-6 animate-pulse rounded-full bg-[#f1f3f6]" />
          <div className="h-6 animate-pulse rounded-full bg-[#f1f3f6]" />
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
        </div>
      ))}
    </div>
  );
}

function PendingActionsSkeleton() {
  return (
    <div className="mt-4 space-y-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between rounded-xl bg-[#f4f5f7] px-3 py-2.5">
          <div className="w-full max-w-[190px] space-y-2">
            <div className="h-4 animate-pulse rounded bg-[#e5e7eb]" />
            <div className="h-3 animate-pulse rounded bg-[#eceef2]" />
          </div>
          <div className="h-8 w-16 animate-pulse rounded-full bg-white" />
        </div>
      ))}
    </div>
  );
}

export function AdminDashboardPage({
  data: initialData = defaultAdminDashboardOverviewData,
  loadError,
  lazySections = false,
}: {
  data?: AdminDashboardOverviewData;
  loadError?: string;
  lazySections?: boolean;
}) {
  const [data, setData] = useState<AdminDashboardOverviewData>(initialData);
  const [isRecentLoading, setIsRecentLoading] = useState<boolean>(lazySections);
  const [isPendingLoading, setIsPendingLoading] = useState<boolean>(lazySections);
  const [sectionsError, setSectionsError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!lazySections) return;

    let cancelled = false;

    const loadSections = async () => {
      setIsRecentLoading(true);
      setIsPendingLoading(true);
      setSectionsError(undefined);

      try {
        const response = await fetch("/api/admin/dashboard/overview", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load dashboard sections.");
        }

        const payload = (await response.json()) as AdminDashboardOverviewData;
        if (cancelled) return;

        setData((current) => ({
          ...current,
          recent_sessions: Array.isArray(payload?.recent_sessions) ? payload.recent_sessions : [],
          pending_actions: Array.isArray(payload?.pending_actions) ? payload.pending_actions : [],
          recent_sessions_meta: payload?.recent_sessions_meta ?? current.recent_sessions_meta,
          pending_actions_meta: payload?.pending_actions_meta ?? current.pending_actions_meta,
        }));
      } catch (error) {
        if (!cancelled) {
          setSectionsError(error instanceof Error ? error.message : "Failed to load dashboard sections.");
        }
      } finally {
        if (!cancelled) {
          setIsRecentLoading(false);
          setIsPendingLoading(false);
        }
      }
    };

    void loadSections();

    return () => {
      cancelled = true;
    };
  }, [lazySections]);

  const summaryCardsSource = Array.isArray(data?.summary_cards)
    ? data.summary_cards
    : defaultAdminDashboardOverviewData.summary_cards;

  const summaryCards: SummaryCard[] = summaryCardsSource.map((card) => ({
    ...card,
    iconComponent: getSummaryIcon(card.icon),
    iconClassName: getSummaryIconClass(card.title),
  }));

  const errorMessage = loadError ?? sectionsError;

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Dashboard</h1>
          <p className="text-[14px] text-[#6b7280]">Today &#8212; {data.today_label}</p>
        </div>

        {errorMessage ? (
          <p className="mt-2 rounded-md border border-[#ffecef] bg-[#fff5f7] px-3 py-2 text-[12px] text-[#d61c3f]">{errorMessage}</p>
        ) : null}

        <section className="mt-5 grid gap-4 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCardView key={card.title} card={card} />
          ))}
        </section>

        <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)]">
          <div className="rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between border-b border-[#eceef2] px-4 py-3">
              <h2 className="text-[24px] font-bold text-[#20242b]">Recent Sessions</h2>
              <Link href="/admin-dashboard/schedules" className="text-[13px] font-semibold text-[#d61c3f]">
                View all &#8594;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[1.5fr_1.2fr_0.9fr_1fr_0.85fr_0.95fr_0.6fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                  <span>Student</span>
                  <span>Tutor</span>
                  <span>Subject</span>
                  <span>Date &amp; Time</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Fee</span>
                </div>

                {isRecentLoading ? (
                  <RecentSessionsSkeleton />
                ) : (
                  <div className="divide-y divide-[#eceef2]">
                    {(Array.isArray(data?.recent_sessions) ? data.recent_sessions : []).map((row, index) => (
                      <div
                        key={`${row.student}-${row.tutor}-${row.session_date}-${row.session_time}`}
                        className="grid grid-cols-[1.5fr_1.2fr_0.9fr_1fr_0.85fr_0.95fr_0.6fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${getInitialBadgeClass(index)}`}>
                            {getInitials(row.student)}
                          </span>
                          <span className="font-medium text-[#20242b]">{row.student}</span>
                        </div>
                        <span>{row.tutor}</span>
                        <span>{row.subject}</span>
                        <span>{formatDateTimeLabel(row.session_date, row.session_time)}</span>
                        <div>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getModeClassName(row.session_type)}`}>
                            {row.session_type}
                          </span>
                        </div>
                        <div>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClassName(row.status)}`}>
                            {row.status}
                          </span>
                        </div>
                        <span className="font-semibold text-[#374151]">{row.amount}</span>
                      </div>
                    ))}

                    {(Array.isArray(data?.recent_sessions) ? data.recent_sessions : []).length === 0 ? (
                      <div className="px-4 py-8 text-center text-[13px] text-[#6b7280]">No recent sessions found.</div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-[24px] font-bold text-[#20242b]">Pending Actions</h3>

              {isPendingLoading ? (
                <PendingActionsSkeleton />
              ) : (
                <div className="mt-4 space-y-3">
                  {(Array.isArray(data?.pending_actions) ? data.pending_actions : []).map((action, index) => (
                    <article key={`${action.title}-${index}`} className="flex items-center justify-between rounded-xl bg-[#f4f5f7] px-3 py-2.5">
                      <div>
                        <p className="text-[14px] font-semibold text-[#374151]">{action.title}</p>
                        <p className="text-[12px] text-[#6b7280]">{action.subtitle}</p>
                      </div>
                      <Link
                        href={action.action_route}
                        className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#4b5563] transition hover:bg-[#f9fafb]"
                      >
                        {action.action_label}
                      </Link>
                    </article>
                  ))}

                  {(Array.isArray(data?.pending_actions) ? data.pending_actions : []).length === 0 ? (
                    <div className="rounded-xl bg-[#f4f5f7] px-3 py-3 text-[13px] text-[#6b7280]">No pending actions found.</div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-[24px] font-bold text-[#20242b]">Top Tutors This Month</h3>

              <div className="mt-4 space-y-3">
                {(Array.isArray(data?.top_tutors_this_month) ? data.top_tutors_this_month : []).map((tutor, index) => (
                  <div key={`${tutor.name}-${index}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${getInitialBadgeClass(index)}`}>
                        {getInitials(tutor.name)}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-[#20242b]">{tutor.name}</p>
                        <p className="text-[12px] text-[#6b7280]">{tutor.subjects.join(", ")}</p>
                      </div>
                    </div>
                    <span className="text-[14px] font-bold text-[#239157]">{tutor.earned_mtd}</span>
                  </div>
                ))}

                {(Array.isArray(data?.top_tutors_this_month) ? data.top_tutors_this_month : []).length === 0 ? (
                  <div className="text-[13px] text-[#6b7280]">No tutor ranking data yet.</div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
