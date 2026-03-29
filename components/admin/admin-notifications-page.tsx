"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiUserPlus,
} from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  ADMIN_DISPUTE_REPORTS_ROUTE,
  ADMIN_PAYOUT_QUEUE_ROUTE,
  ADMIN_SCHEDULES_ROUTE,
  ADMIN_TUTOR_APPLICATIONS_ROUTE,
  ADMIN_TUTORS_ROUTE,
} from "@/lib/routes";

type NotificationCategory =
  | "Tutor Applications"
  | "Session Alerts"
  | "Payments"
  | "System";

type NotificationActionType = "review" | "investigate" | "view" | "none";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timeLabel: string;
  category: NotificationCategory;
  unread: boolean;
  section: "new" | "earlier";
  action: NotificationActionType;
  href?: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New tutor application",
    message: "James Miller applied to join as a Physics & Calculus tutor. Background check pending.",
    timeLabel: "2 hours ago",
    category: "Tutor Applications",
    unread: true,
    section: "new",
    action: "review",
    href: ADMIN_TUTOR_APPLICATIONS_ROUTE,
  },
  {
    id: "n2",
    title: "New tutor application",
    message: "Alicia Ruiz applied to join as a Spanish & ESL tutor. Documents uploaded.",
    timeLabel: "5 hours ago",
    category: "Tutor Applications",
    unread: true,
    section: "new",
    action: "review",
    href: ADMIN_TUTOR_APPLICATIONS_ROUTE,
  },
  {
    id: "n3",
    title: "Dispute reported",
    message:
      "Patricia Johnson submitted a dispute for session #SS-2039 (Ryan Johnson / Marcus Reynolds - Cancelled).",
    timeLabel: "Yesterday · 6:30 PM",
    category: "Session Alerts",
    unread: true,
    section: "new",
    action: "investigate",
    href: ADMIN_DISPUTE_REPORTS_ROUTE,
  },
  {
    id: "n4",
    title: "Payout processed",
    message: "Weekly payout of $540.00 sent to Marcus Reynolds successfully.",
    timeLabel: "Mar 19 · 9:00 AM",
    category: "Payments",
    unread: true,
    section: "earlier",
    action: "view",
    href: ADMIN_PAYOUT_QUEUE_ROUTE,
  },
  {
    id: "n5",
    title: "Tutor application approved",
    message: "David Kim's application was approved. He is now active on the platform.",
    timeLabel: "Mar 18 · 3:15 PM",
    category: "Tutor Applications",
    unread: true,
    section: "earlier",
    action: "view",
    href: `${ADMIN_TUTORS_ROUTE}/TU-2003`,
  },
  {
    id: "n6",
    title: "System",
    message: "Platform maintenance scheduled for Sunday, March 22 from 2:00 AM - 4:00 AM EST.",
    timeLabel: "Mar 17 · 11:00 AM",
    category: "System",
    unread: true,
    section: "earlier",
    action: "none",
  },
  {
    id: "n7",
    title: "Milestone reached",
    message: "Arch City Tutors just completed 5,000 total sessions on the platform!",
    timeLabel: "Mar 15 · 2:00 PM",
    category: "System",
    unread: true,
    section: "earlier",
    action: "none",
  },
  {
    id: "n8",
    title: "Session cancellation spike",
    message: "5 sessions were cancelled in the last 24 hours. This is above the weekly average.",
    timeLabel: "Mar 14 · 8:00 AM",
    category: "Session Alerts",
    unread: true,
    section: "earlier",
    action: "view",
    href: ADMIN_SCHEDULES_ROUTE,
  },
];

type Tab = "All" | NotificationCategory;

function getIconConfig(item: NotificationItem) {
  if (item.title.toLowerCase().includes("tutor")) {
    return {
      icon: FiUserPlus,
      className: "bg-[#ffecef] text-[#d94a62]",
    };
  }

  if (item.title.toLowerCase().includes("dispute")) {
    return {
      icon: FiAlertTriangle,
      className: "bg-[#fff6de] text-[#9c7a1e]",
    };
  }

  if (item.title.toLowerCase().includes("payout")) {
    return {
      icon: FiDollarSign,
      className: "bg-[#ebf7ef] text-[#239157]",
    };
  }

  if (item.title.toLowerCase().includes("system")) {
    return {
      icon: FiClock,
      className: "bg-[#f1f1f1] text-[#6b7280]",
    };
  }

  if (item.title.toLowerCase().includes("milestone")) {
    return {
      icon: FiCheckCircle,
      className: "bg-[#ebf7ef] text-[#239157]",
    };
  }

  return {
    icon: FiCalendar,
    className: "bg-[#fff6de] text-[#9c7a1e]",
  };
}

function ActionButton({ action, href }: { action: NotificationActionType; href?: string }) {
  if (action === "review") {
    return (
      <Link
        href={href ?? "#"}
        className="inline-flex h-8 items-center rounded-lg bg-[#d61c3f] px-3 text-[12px] font-semibold text-white"
      >
        Review
      </Link>
    );
  }

  if (action === "investigate") {
    return (
      <Link
        href={href ?? "#"}
        className="inline-flex h-8 items-center rounded-lg bg-[#9c7a1e] px-3 text-[12px] font-semibold text-white"
      >
        Investigate
      </Link>
    );
  }

  if (action === "view") {
    return (
      <Link
        href={href ?? "#"}
        className="inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-semibold text-[#d61c3f]"
      >
        View →
      </Link>
    );
  }

  return null;
}

export function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const allCount = items.length;
  const tutorApplicationsCount = items.filter(
    (item) => item.category === "Tutor Applications",
  ).length;

  const filtered = useMemo(() => {
    if (activeTab === "All") return items;
    return items.filter((item) => item.category === activeTab);
  }, [activeTab, items]);

  const newItems = filtered.filter((item) => item.section === "new");
  const earlierItems = filtered.filter((item) => item.section === "earlier");
  const unreadNewCount = newItems.filter((item) => item.unread).length;

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Notifications</h1>
          <button
            type="button"
            onClick={() =>
              setItems((prev) =>
                prev.map((item) => ({ ...item, unread: false, section: "earlier" })),
              )
            }
            className="inline-flex h-10 items-center rounded-xl border border-[#e5e7eb] bg-white px-4 text-[13px] font-semibold text-[#6b7280]"
          >
            Mark all as read
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4 border-b border-[#eceef2] bg-white px-2">
          {(["All", "Tutor Applications", "Session Alerts", "Payments", "System"] as const).map(
            (tab) => {
              const active = tab === activeTab;
              const showAllBadge = tab === "All";
              const showTutorBadge = tab === "Tutor Applications";

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex h-10 items-center gap-1.5 border-b-2 px-2 text-[14px] font-semibold transition ${
                    active
                      ? "border-[#d94a62] text-[#d61c3f]"
                      : "border-transparent text-[#6b7280] hover:text-[#374151]"
                  }`}
                >
                  {tab}
                  {showAllBadge ? (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d61c3f] px-1 text-[10px] font-semibold text-white">
                      {allCount}
                    </span>
                  ) : null}
                  {showTutorBadge ? (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9c7a1e] px-1 text-[10px] font-semibold text-white">
                      {tutorApplicationsCount}
                    </span>
                  ) : null}
                </button>
              );
            },
          )}
        </div>

        <section className="mt-4 space-y-4">
          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
              New - {unreadNewCount} unread
            </p>
            <div className="mt-2 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
              {newItems.length > 0 ? (
                newItems.map((item) => {
                  const { icon: Icon, className } = getIconConfig(item);
                  return (
                    <article
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b border-[#eceef2] px-4 py-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] text-[#374151]">
                            <span className="font-semibold text-[#20242b]">{item.title}</span> —{" "}
                            {item.message}
                          </p>
                          <p className="mt-1 text-[12px] text-[#6b7280]">{item.timeLabel}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <ActionButton action={item.action} href={item.href} />
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="px-4 py-5 text-[13px] text-[#6b7280]">No new notifications.</div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">Earlier</p>
            <div className="mt-2 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
              {earlierItems.length > 0 ? (
                earlierItems.map((item) => {
                  const { icon: Icon, className } = getIconConfig(item);
                  return (
                    <article
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b border-[#eceef2] px-4 py-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] text-[#374151]">
                            <span className="font-semibold text-[#20242b]">{item.title}</span> —{" "}
                            {item.message}
                          </p>
                          <p className="mt-1 text-[12px] text-[#6b7280]">{item.timeLabel}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <ActionButton action={item.action} href={item.href} />
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="px-4 py-5 text-[13px] text-[#6b7280]">No earlier notifications.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
