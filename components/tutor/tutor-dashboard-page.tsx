"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { IconType } from "react-icons";
import { FiCalendar, FiCheckCircle, FiDollarSign, FiPlusCircle } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import { fetchTutorScheduleItemsClient } from "@/lib/api/tutor-schedule-browser-api";
import { TUTOR_APPLY_ROUTE, TUTOR_AVAILABILITY_ROUTE, TUTOR_EARNINGS_ROUTE, TUTOR_PROFILE_ROUTE, TUTOR_SCHEDULE_ROUTE } from "@/lib/routes";
import { tutorPendingBanner } from "@/lib/tutor/dashboard-data";
import type { TutorScheduleItem } from "@/lib/tutor/schedule-data";
import { useTutorApplicationStatus } from "@/lib/tutor/use-tutor-application-status";

type DashboardView = "overview" | "schedule" | "earnings";

type SummaryCard = {
  title: string;
  value: string;
  subtitle: string;
  action: string;
  view: DashboardView;
  icon: IconType;
  iconClassName: string;
  valueClassName?: string;
};

function SummaryCardView({ card, onView }: { card: SummaryCard; onView: (view: DashboardView) => void }) {
  const Icon = card.icon;

  return (
    <article className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">{card.title}</p>
          <p className={`mt-3 text-[22px] font-bold text-[#20242b] ${card.valueClassName ?? ""}`}>{card.value}</p>
          <p className="mt-1 text-[13px] text-[#6b7280]">{card.subtitle}</p>
          <button
            type="button"
            onClick={() => onView(card.view)}
            className="mt-2 inline-flex text-[13px] font-semibold text-[#d61c3f] transition hover:text-[#b81636]"
          >
            {card.action} &#8594;
          </button>
        </div>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconClassName}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

function parseCurrency(value: string) {
  const normalized = String(value || "").replace(/[^0-9.]+/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function isCompletedSession(session: TutorScheduleItem) {
  return session.status === "Completed";
}

function isUpcomingSession(session: TutorScheduleItem) {
  return session.status === "Upcoming" || session.status === "Completion Requested";
}

export function TutorDashboardPage() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [scheduleItems, setScheduleItems] = useState<TutorScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
  const [firstName, setFirstName] = useState("Tutor");
  const { status, isApproved, isPendingApplication, isNotSubmitted } = useTutorApplicationStatus();
  const showApplicationState = !isApproved;
  const showSubmittedMessage = searchParams.get("application") === "submitted";
  const applicationLabel =
    isPendingApplication
      ? "Your application is pending review."
      : status === "rejected"
        ? "Your application was not approved yet."
        : "Apply as a tutor to unlock your dashboard.";
  const bannerMessage = isNotSubmitted
    ? applicationLabel
    : isPendingApplication
      ? tutorPendingBanner
      : status === "rejected"
        ? "Your tutor application was rejected. Please update your profile and reapply."
        : "Spring bookings are picking up! Make sure your availability is up to date to receive new session requests.";

  useEffect(() => {
    let active = true;

    async function loadSchedule() {
      if (showApplicationState) {
        setScheduleItems([]);
        setLoadingSchedule(false);
        return;
      }

      setLoadingSchedule(true);
      setScheduleError("");

      try {
        const items = await fetchTutorScheduleItemsClient();
        if (!active) return;
        setScheduleItems(items);
      } catch (error) {
        if (!active) return;
        setScheduleItems([]);
        setScheduleError(error instanceof Error ? error.message : "Failed to load tutor schedule.");
      } finally {
        if (active) {
          setLoadingSchedule(false);
        }
      }
    }

    void loadSchedule();

    return () => {
      active = false;
    };
  }, [showApplicationState]);

  useEffect(() => {
    let active = true;

    async function loadTutorProfile() {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, "");
      if (!baseUrl) return;

      try {
        const profile = await browserApiRequest<{
          first_name?: string;
          last_name?: string;
        }>({
          url: `${baseUrl}/tutor/profile`,
          method: "GET",
        });

        if (!active) return;

        const nextFirstName = String(profile.first_name || "").trim();
        setFirstName(nextFirstName || "Tutor");
      } catch {
        if (active) {
          setFirstName("Tutor");
        }
      }
    }

    void loadTutorProfile();

    return () => {
      active = false;
    };
  }, []);

  const dashboardMetrics = useMemo(() => {
    const upcoming = scheduleItems.filter(isUpcomingSession);
    const completed = scheduleItems.filter(isCompletedSession);
    const totalEarnings = completed.reduce((sum, item) => sum + parseCurrency(item.rate), 0);

    return {
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      totalEarnings: formatCurrency(totalEarnings),
      upcomingSessions: upcoming.slice(0, 5),
      completedSessions: completed.slice(0, 4),
    };
  }, [scheduleItems]);

  const summaryCards: SummaryCard[] = [
    {
      title: "Upcoming Sessions",
      value: String(dashboardMetrics.upcomingCount),
      subtitle: "Live sessions scheduled",
      action: "View schedule",
      view: "schedule",
      icon: FiCalendar,
      iconClassName: "bg-[#fff6de] text-[#b58112]",
    },
    {
      title: "Completed Sessions",
      value: String(dashboardMetrics.completedCount),
      subtitle: "Completed sessions loaded",
      action: "View history",
      view: "schedule",
      icon: FiCheckCircle,
      iconClassName: "bg-[#ebf7ef] text-[#1b8a5a]",
      valueClassName: "text-[#1b8a5a]",
    },
    {
      title: "Total Earnings",
      value: dashboardMetrics.totalEarnings,
      subtitle: "Derived from completed sessions",
      action: "View earnings",
      view: "earnings",
      icon: FiDollarSign,
      iconClassName: "bg-[#ffecef] text-[#d94a62]",
      valueClassName: "text-[#d61c3f]",
    },
  ];

  function renderPreviewPanel() {
    if (activeView === "schedule") {
      return (
        <section className="mt-4 rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-[#20242b]">Schedule Preview</h2>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                A quick view of your upcoming sessions. Use the full schedule page if you want the complete table.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView("overview")}
                className="inline-flex h-9 items-center rounded-full border border-[#e5e7eb] px-4 text-[13px] font-semibold text-[#374151]"
              >
                Back to overview
              </button>
              <Link
                href={TUTOR_SCHEDULE_ROUTE}
                className="inline-flex h-9 items-center rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
              >
                Open full schedule
              </Link>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[12px] border border-[#e7e7eb]">
            <div className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr_0.9fr_0.8fr_0.7fr_0.8fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
              <span>Student</span>
              <span>Grade</span>
              <span>Date</span>
              <span>Time</span>
              <span>Duration</span>
              <span>Type</span>
              <span>Rate</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-[#eceef2]">
              {loadingSchedule ? (
                <div className="px-4 py-6 text-center text-[14px] text-[#6b7280]">Loading live schedule...</div>
              ) : null}
              {!loadingSchedule && scheduleError ? (
                <div className="px-4 py-6 text-center text-[14px] text-[#b4233b]">{scheduleError}</div>
              ) : null}
              {!loadingSchedule && !scheduleError && dashboardMetrics.upcomingSessions.length === 0 ? (
                <div className="px-4 py-6 text-center text-[14px] text-[#6b7280]">No upcoming sessions found.</div>
              ) : null}
              {!loadingSchedule &&
                !scheduleError &&
                dashboardMetrics.upcomingSessions.map((session) => (
                <div key={session.id} className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr_0.9fr_0.8fr_0.7fr_0.8fr] gap-4 px-4 py-4 text-[13px] text-[#4b5563]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                      {session.studentInitials}
                    </span>
                    <div>
                      <p className="font-semibold text-[#20242b]">{session.studentName}</p>
                      <p className="text-[12px] text-[#6b7280]">Session #{session.id}</p>
                    </div>
                  </div>
                  <span>{session.grade}</span>
                  <span>{session.date}</span>
                  <span>{session.time}</span>
                  <span>{session.duration}</span>
                  <span className="inline-flex w-fit rounded-full bg-[#ffecef] px-2.5 py-1 text-[11px] font-medium text-[#d94a62]">
                    {session.type}
                  </span>
                  <span className="font-semibold text-[#374151]">{session.rate}</span>
                  <span className="inline-flex w-fit rounded-full bg-[#fff6de] px-2.5 py-1 text-[11px] font-medium text-[#b58112]">
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (activeView === "earnings") {
      const earningsRows = dashboardMetrics.completedSessions;
      return (
        <section className="mt-4 rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-[#20242b]">Earnings Preview</h2>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                A compact view of your earnings log without leaving the dashboard shell.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView("overview")}
                className="inline-flex h-9 items-center rounded-full border border-[#e5e7eb] px-4 text-[13px] font-semibold text-[#374151]"
              >
                Back to overview
              </button>
              <Link
                href={TUTOR_EARNINGS_ROUTE}
                className="inline-flex h-9 items-center rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
              >
                Open earnings page
              </Link>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <article className="rounded-[12px] border border-[#eceef2] bg-[#fafafb] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">This Month</p>
              <p className="mt-3 text-[22px] font-bold text-[#d61c3f]">{dashboardMetrics.totalEarnings}</p>
              <p className="mt-1 text-[13px] text-[#6b7280]">Derived from completed sessions loaded from the backend</p>
            </article>
            <article className="rounded-[12px] border border-[#eceef2] bg-[#fafafb] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">Completed Sessions</p>
              <p className="mt-3 text-[22px] font-bold text-[#1b8a5a]">{dashboardMetrics.completedCount}</p>
              <p className="mt-1 text-[13px] text-[#6b7280]">Loaded from your live schedule</p>
            </article>
            <article className="rounded-[12px] border border-[#eceef2] bg-[#fafafb] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">All-Time Total</p>
              <p className="mt-3 text-[22px] font-bold text-[#b58112]">{dashboardMetrics.totalEarnings}</p>
              <p className="mt-1 text-[13px] text-[#6b7280]">{dashboardMetrics.completedCount} sessions completed</p>
            </article>
          </div>

          <div className="mt-4 overflow-hidden rounded-[12px] border border-[#e7e7eb]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
              <span>Student</span>
              <span>Date</span>
              <span>Subject</span>
              <span>Duration</span>
              <span>Type</span>
              <span>Rate</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-[#eceef2]">
              {earningsRows.slice(0, 4).map((row) => (
                <div key={row.id} className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_0.7fr_0.7fr] gap-4 px-4 py-4 text-[13px] text-[#4b5563]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                      {row.studentInitials}
                    </span>
                    <span className="font-medium text-[#4b5563]">{row.studentName}</span>
                  </div>
                  <span>{row.date}</span>
                  <span>{row.subject}</span>
                  <span>{row.duration}</span>
                  <span>{row.type}</span>
                  <span className="font-semibold text-[#374151]">{row.rate}</span>
                  <span className="inline-flex w-fit rounded-full bg-[#e2f5ea] px-2.5 py-1 text-[11px] font-medium text-[#41a16f]">
                    Completed
                  </span>
                </div>
              ))}
              {earningsRows.length === 0 ? (
                <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">
                  No completed sessions yet. Earnings will appear after a tutor and student mark the session as completed.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    return null;
  }

  return (
    <TutorShell>
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Hey, {firstName}!</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">Saturday, March 28, 2026</p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <Link
              href={showApplicationState ? TUTOR_APPLY_ROUTE : TUTOR_AVAILABILITY_ROUTE}
              className={`inline-flex h-11 items-center gap-3 rounded-full px-5 text-[14px] font-semibold text-white transition ${
                showApplicationState ? "bg-[#4b5563] hover:bg-[#374151]" : "bg-[#d61c3f] hover:bg-[#be1837]"
              }`}
            >
              {!showApplicationState ? <FiPlusCircle className="h-4 w-4" /> : null}
              <span>{showApplicationState ? "Apply" : "Manage Availability"}</span>
            </Link>
          </div>
        </div>

        {showSubmittedMessage ? (
          <div className="mt-4 rounded-lg bg-[#e8f8ec] px-4 py-3 text-[13px] font-medium text-[#166534]">
            Application submitted successfully. Waiting for admin response.
          </div>
        ) : null}

        <div className="mt-4 rounded-lg bg-[#ffcc1d] px-4 py-3 text-[13px] font-medium text-[#7a5200]">
          {showApplicationState ? bannerMessage : "Spring bookings are picking up! Make sure your availability is up to date to receive new session requests."}
        </div>

        {showApplicationState ? null : (
          <>
            <section className="mt-4 grid gap-3 lg:grid-cols-3">
              {summaryCards.map((card) => (
                <SummaryCardView key={card.title} card={card} onView={setActiveView} />
              ))}
            </section>

            {renderPreviewPanel()}

            <section className={`mt-5 ${activeView !== "overview" ? "hidden" : ""}`}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[17px] font-bold text-[#20242b]">Upcoming Sessions</h2>
                <button
                  type="button"
                  onClick={() => setActiveView("schedule")}
                  className="text-[13px] font-semibold text-[#d61c3f]"
                >
                  View all
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="hidden grid-cols-[1.6fr_1fr_1fr_0.9fr_0.9fr_0.8fr_0.7fr_0.8fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
                  <span>Student</span>
                  <span>Grade</span>
                  <span>Date</span>
                  <span>Time</span>
                  <span>Duration</span>
                  <span>Type</span>
                  <span>Rate</span>
                  <span>Actions</span>
                </div>

                <div className="divide-y divide-[#eceef2]">
                  {loadingSchedule ? (
                    <div className="px-4 py-6 text-center text-[14px] text-[#6b7280]">Loading live schedule...</div>
                  ) : null}
                  {!loadingSchedule && scheduleError ? (
                    <div className="px-4 py-6 text-center text-[14px] text-[#b4233b]">{scheduleError}</div>
                  ) : null}
                  {!loadingSchedule && !scheduleError && dashboardMetrics.upcomingSessions.map((session) => (
                    <div key={session.id} className="grid gap-4 px-4 py-4 md:grid-cols-[1.6fr_1fr_1fr_0.9fr_0.9fr_0.8fr_0.7fr_0.8fr] md:items-center">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                          {session.studentInitials}
                        </span>
                        <p className="text-[14px] font-semibold text-[#20242b]">{session.studentName}</p>
                      </div>
                      <div className="text-[13px] text-[#4b5563]">{session.grade}</div>
                      <div className="text-[13px] text-[#4b5563]">{session.date}</div>
                      <div className="text-[13px] text-[#4b5563]">{session.time}</div>
                      <div className="text-[13px] text-[#4b5563]">{session.duration}</div>
                      <div>
                        <span className="inline-flex rounded-full bg-[#ffecef] px-2.5 py-1 text-[11px] font-medium text-[#d94a62]">{session.type}</span>
                      </div>
                      <div className="text-[14px] font-semibold text-[#374151]">{session.rate}</div>
                      <div>
                        <button
                          type="button"
                          onClick={() => setActiveView("schedule")}
                          className="inline-flex rounded-full border border-[#d61c3f] px-3.5 py-1.5 text-[12px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className={`mt-4 grid gap-3 lg:grid-cols-2 ${activeView !== "overview" ? "hidden" : ""}`}>
              <div className="flex items-center justify-between rounded-[12px] bg-[#ffe8ed] px-4 py-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#20242b]">Update Availability</h3>
                  <p className="mt-1 text-[13px] text-[#6b7280]">Set your open time slots for students to book.</p>
                </div>
                <Link href={TUTOR_AVAILABILITY_ROUTE} className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]">
                  Manage
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-[12px] border border-[#eceef2] bg-white px-4 py-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#20242b]">Complete Your Profile</h3>
                  <p className="mt-1 text-[13px] text-[#6b7280]">Keep your bio, subjects, and rates up to date.</p>
                </div>
                <Link href={TUTOR_PROFILE_ROUTE} className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]">
                  Edit Profile
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </TutorShell>
  );
}
