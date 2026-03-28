import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";

type SummaryCard = {
  title: string;
  value: string;
  subtitle: string;
  action: string;
  icon: IconType;
  iconClassName: string;
  valueClassName?: string;
};

type SessionRow = {
  initials: string;
  initialsClassName: string;
  tutor: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  typeClassName: string;
  status: string;
};

const summaryCards: SummaryCard[] = [
  {
    title: "Total Sessions",
    value: "24",
    subtitle: "All-time tutoring sessions",
    action: "View all",
    icon: FiCalendar,
    iconClassName: "bg-[#ffecef] text-[#d61c3f]",
  },
  {
    title: "Upcoming",
    value: "3",
    subtitle: "Scheduled sessions",
    action: "View upcoming",
    icon: FiClock,
    iconClassName: "bg-[#fff6de] text-[#b58112]",
  },
  {
    title: "Completed",
    value: "19",
    subtitle: "Completed sessions",
    action: "View history",
    icon: FiCheckCircle,
    iconClassName: "bg-[#ebf7ef] text-[#1b8a5a]",
    valueClassName: "text-[#1b8a5a]",
  },
  {
    title: "Cancelled",
    value: "2",
    subtitle: "Cancelled sessions",
    action: "View cancelled",
    icon: FiXCircle,
    iconClassName: "bg-[#ffecef] text-[#d94a62]",
    valueClassName: "text-[#d94a62]",
  },
];

const sessionRows: SessionRow[] = [
  {
    initials: "MT",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    tutor: "Marcus Thompson",
    subject: "Algebra II",
    date: "Mon, Mar 30",
    time: "4:00 PM",
    duration: "60 min",
    type: "Virtual",
    typeClassName: "bg-[#ffecef] text-[#d94a62]",
    status: "Upcoming",
  },
  {
    initials: "SA",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    tutor: "Sandra Avery",
    subject: "English Literature",
    date: "Wed, Apr 1",
    time: "3:30 PM",
    duration: "45 min",
    type: "In-Person",
    typeClassName: "bg-[#f1f1f1] text-[#6b7280]",
    status: "Upcoming",
  },
  {
    initials: "RJ",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    tutor: "Rebecca Jones",
    subject: "Biology",
    date: "Fri, Apr 3",
    time: "5:00 PM",
    duration: "60 min",
    type: "Virtual",
    typeClassName: "bg-[#ffecef] text-[#d94a62]",
    status: "Upcoming",
  },
];

function SummaryCardView({ card }: { card: SummaryCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">
            {card.title}
          </p>
          <p className={`mt-3 text-[22px] font-bold text-[#20242b] ${card.valueClassName ?? ""}`}>
            {card.value}
          </p>
          <p className="mt-1 text-[13px] text-[#6b7280]">{card.subtitle}</p>
          <Link
            href="#"
            className="mt-2 inline-flex text-[13px] font-semibold text-[#d61c3f] transition hover:text-[#b81636]"
          >
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

export function StudentDashboardPage() {
  return (
    <StudentShell>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Hey, Jordan! 👋</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">Saturday, March 28, 2026</p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <Link
              href="#"
              className="inline-flex h-11 items-center gap-3 rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c11436]">
                <FiSearch className="h-3.5 w-3.5" />
              </span>
              <span>Find Tutor</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg bg-[#ffcc1d] px-4 py-3 text-[13px] font-medium text-[#7a5200]">
          <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Spring tutoring sessions are now available! Book early to secure your preferred tutor and time slot.</p>
        </div>

        <section className="mt-4 grid gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCardView key={card.title} card={card} />
          ))}
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[17px] font-bold text-[#20242b]">Upcoming Sessions</h2>
            <Link href="#" className="text-[13px] font-semibold text-[#d61c3f]">
              View all sessions
            </Link>
          </div>

          <div className="mt-3 overflow-hidden rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="hidden grid-cols-[1.6fr_0.9fr_0.7fr_0.7fr_0.8fr_0.9fr_1fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
              <span>Tutor</span>
              <span>Date</span>
              <span>Time</span>
              <span>Duration</span>
              <span>Type</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {sessionRows.map((row) => (
                <div
                  key={`${row.tutor}-${row.date}`}
                  className="grid gap-4 px-4 py-4 md:grid-cols-[1.6fr_0.9fr_0.7fr_0.7fr_0.8fr_0.9fr_1fr] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${row.initialsClassName}`}>
                      {row.initials}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#20242b]">{row.tutor}</p>
                      <p className="text-[12px] text-[#6b7280]">{row.subject}</p>
                    </div>
                  </div>

                  <div className="text-[13px] text-[#4b5563]">{row.date}</div>
                  <div className="text-[13px] text-[#4b5563]">{row.time}</div>
                  <div className="text-[13px] text-[#4b5563]">{row.duration}</div>

                  <div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${row.typeClassName}`}>
                      {row.type}
                    </span>
                  </div>

                  <div>
                    <span className="inline-flex rounded-full bg-[#fff6de] px-2.5 py-1 text-[11px] font-medium text-[#b58112]">
                      {row.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href="#"
                      className="inline-flex rounded-full border border-[#d61c3f] px-3.5 py-1.5 text-[12px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                    >
                      Details
                    </Link>
                    <Link href="#" className="text-[12px] font-semibold text-[#d61c3f]">
                      Cancel
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 flex flex-col items-start justify-between gap-4 rounded-[12px] bg-[#ffe8ed] px-4 py-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-[16px] font-bold text-[#20242b]">Need more help?</h3>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              Browse Missouri-certified tutors available for your subjects.
            </p>
          </div>

          <Link
            href="#"
            className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-6 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
          >
            Find a Tutor
          </Link>
        </section>
      </div>
    </StudentShell>
  );
}
