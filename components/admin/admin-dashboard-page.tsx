import Link from "next/link";
import type { IconType } from "react-icons";
import { FiCalendar, FiDollarSign, FiUser, FiUsers } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  ADMIN_DISPUTE_REPORTS_ROUTE,
  ADMIN_PAYOUT_QUEUE_ROUTE,
  ADMIN_TUTOR_APPLICATIONS_ROUTE,
} from "@/lib/routes";

type SummaryCard = {
  title: string;
  value: string;
  subtitle: string;
  action: string;
  icon: IconType;
  iconClassName: string;
};

type SessionRow = {
  initials: string;
  initialsClassName: string;
  student: string;
  tutor: string;
  subject: string;
  dateTime: string;
  type: string;
  typeClassName: string;
  status: string;
  statusClassName: string;
  fee: string;
};

const summaryCards: SummaryCard[] = [
  {
    title: "Total Students",
    value: "248",
    subtitle: "Active students on platform",
    action: "View all",
    icon: FiUsers,
    iconClassName: "bg-[#ffecef] text-[#d61c3f]",
  },
  {
    title: "Total Tutors",
    value: "64",
    subtitle: "Approved tutors active",
    action: "View all",
    icon: FiUser,
    iconClassName: "bg-[#ebf7ef] text-[#239157]",
  },
  {
    title: "Sessions Today",
    value: "31",
    subtitle: "Sessions scheduled today",
    action: "View schedule",
    icon: FiCalendar,
    iconClassName: "bg-[#fff6de] text-[#b58112]",
  },
  {
    title: "Monthly Revenue",
    value: "$18,420",
    subtitle: "Revenue this month",
    action: "View finances",
    icon: FiDollarSign,
    iconClassName: "bg-[#ebf7ef] text-[#239157]",
  },
];

const sessionRows: SessionRow[] = [
  {
    initials: "JW",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    student: "Jordan Wilson",
    tutor: "Marcus Reynolds",
    subject: "Algebra II",
    dateTime: "Mar 20 · 2:00 PM",
    type: "In-Person",
    typeClassName: "bg-[#f1f1f1] text-[#6b7280]",
    status: "Upcoming",
    statusClassName: "bg-[#fff6de] text-[#b58112]",
    fee: "$45.00",
  },
  {
    initials: "MW",
    initialsClassName: "bg-[#f1f1f1] text-[#6b7280]",
    student: "Maya Wilson",
    tutor: "Lisa Davis",
    subject: "Reading",
    dateTime: "Mar 20 · 3:30 PM",
    type: "Virtual",
    typeClassName: "bg-[#ffecef] text-[#d94a62]",
    status: "Upcoming",
    statusClassName: "bg-[#fff6de] text-[#b58112]",
    fee: "$32.50",
  },
  {
    initials: "AT",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    student: "Alex Thompson",
    tutor: "David Kim",
    subject: "SAT Prep",
    dateTime: "Mar 20 · 10:00 AM",
    type: "Virtual",
    typeClassName: "bg-[#ffecef] text-[#d94a62]",
    status: "Completed",
    statusClassName: "bg-[#ebf7ef] text-[#239157]",
    fee: "$60.00",
  },
  {
    initials: "SL",
    initialsClassName: "bg-[#ebf7ef] text-[#239157]",
    student: "Sophie Lee",
    tutor: "Priya Patel",
    subject: "Chemistry",
    dateTime: "Mar 19 · 5:00 PM",
    type: "In-Person",
    typeClassName: "bg-[#f1f1f1] text-[#6b7280]",
    status: "Completed",
    statusClassName: "bg-[#ebf7ef] text-[#239157]",
    fee: "$55.00",
  },
  {
    initials: "RJ",
    initialsClassName: "bg-[#ffecef] text-[#d94a62]",
    student: "Ryan Johnson",
    tutor: "Marcus Reynolds",
    subject: "Geometry",
    dateTime: "Mar 19 · 1:00 PM",
    type: "In-Person",
    typeClassName: "bg-[#f1f1f1] text-[#6b7280]",
    status: "Cancelled",
    statusClassName: "bg-[#ffecef] text-[#d94a62]",
    fee: "—",
  },
];

function SummaryCardView({ card }: { card: SummaryCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">{card.title}</p>
          <p className="mt-3 text-[44px] font-bold leading-none text-[#20242b]">{card.value}</p>
          <p className="mt-2 text-[13px] text-[#6b7280]">{card.subtitle}</p>
          <Link href="#" className="mt-2 inline-flex text-[13px] font-semibold text-[#d61c3f] transition hover:text-[#b81636]">
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

export function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Dashboard</h1>
          <p className="text-[14px] text-[#6b7280]">Today &#8212; Friday, March 20, 2026</p>
        </div>

        <section className="mt-5 grid gap-4 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCardView key={card.title} card={card} />
          ))}
        </section>

        <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)]">
          <div className="rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between border-b border-[#eceef2] px-4 py-3">
              <h2 className="text-[24px] font-bold text-[#20242b]">Recent Sessions</h2>
              <Link href="#" className="text-[13px] font-semibold text-[#d61c3f]">
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

                <div className="divide-y divide-[#eceef2]">
                  {sessionRows.map((row) => (
                    <div
                      key={`${row.student}-${row.tutor}-${row.dateTime}`}
                      className="grid grid-cols-[1.5fr_1.2fr_0.9fr_1fr_0.85fr_0.95fr_0.6fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${row.initialsClassName}`}
                        >
                          {row.initials}
                        </span>
                        <span className="font-medium text-[#20242b]">{row.student}</span>
                      </div>
                      <span>{row.tutor}</span>
                      <span>{row.subject}</span>
                      <span>{row.dateTime}</span>
                      <div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${row.typeClassName}`}>
                          {row.type}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${row.statusClassName}`}>
                          {row.status}
                        </span>
                      </div>
                      <span className="font-semibold text-[#374151]">{row.fee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-[24px] font-bold text-[#20242b]">Pending Actions</h3>

              <div className="mt-4 space-y-3">
                <article className="flex items-center justify-between rounded-xl bg-[#ffecef] px-3 py-2.5">
                  <div>
                    <p className="text-[14px] font-semibold text-[#d61c3f]">Tutor Applications</p>
                    <p className="text-[12px] text-[#6b7280]">4 pending review</p>
                  </div>
                  <Link
                    href={ADMIN_TUTOR_APPLICATIONS_ROUTE}
                    className="inline-flex h-8 items-center rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white transition hover:bg-[#be1837]"
                  >
                    Review
                  </Link>
                </article>

                <article className="flex items-center justify-between rounded-xl bg-[#fff6de] px-3 py-2.5">
                  <div>
                    <p className="text-[14px] font-semibold text-[#8f6b10]">Dispute Reports</p>
                    <p className="text-[12px] text-[#6b7280]">2 open cases</p>
                  </div>
                  <Link
                    href={ADMIN_DISPUTE_REPORTS_ROUTE}
                    className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#4b5563] transition hover:bg-[#f9fafb]"
                  >
                    View
                  </Link>
                </article>

                <article className="flex items-center justify-between rounded-xl bg-[#f4f5f7] px-3 py-2.5">
                  <div>
                    <p className="text-[14px] font-semibold text-[#374151]">Payout Queue</p>
                    <p className="text-[12px] text-[#6b7280]">18 tutors &#183; $4,320</p>
                  </div>
                  <Link
                    href={ADMIN_PAYOUT_QUEUE_ROUTE}
                    className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#4b5563] transition hover:bg-[#f9fafb]"
                  >
                    View
                  </Link>
                </article>
              </div>
            </div>

            <div className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-[24px] font-bold text-[#20242b]">Top Tutors This Month</h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffecef] text-[10px] font-bold text-[#d94a62]">
                      MR
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">Marcus Reynolds</p>
                      <p className="text-[12px] text-[#6b7280]">Algebra, Geometry</p>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-[#239157]">$2,340</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffecef] text-[10px] font-bold text-[#d94a62]">
                      LD
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">Lisa Davis</p>
                      <p className="text-[12px] text-[#6b7280]">Reading, Writing</p>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-[#239157]">$1,950</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ebf7ef] text-[10px] font-bold text-[#239157]">
                      DK
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">David Kim</p>
                      <p className="text-[12px] text-[#6b7280]">SAT Prep, Math</p>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-[#239157]">$1,820</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
