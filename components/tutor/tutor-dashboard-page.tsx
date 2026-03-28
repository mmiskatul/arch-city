import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiPlusCircle,
} from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import {
  TUTOR_AVAILABILITY_ROUTE,
  TUTOR_EARNINGS_ROUTE,
  TUTOR_PROFILE_ROUTE,
  TUTOR_SCHEDULE_ROUTE,
} from "@/lib/routes";
import { tutorDashboardSessions } from "@/lib/tutor/dashboard-data";
import { getTutorScheduleCounts } from "@/lib/tutor/schedule-data";

type SummaryCard = {
  title: string;
  value: string;
  subtitle: string;
  action: string;
  href: string;
  icon: IconType;
  iconClassName: string;
  valueClassName?: string;
};

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
            href={card.href}
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

export function TutorDashboardPage() {
  const counts = getTutorScheduleCounts();
  const summaryCards: SummaryCard[] = [
    {
      title: "Upcoming Sessions",
      value: String(counts.Upcoming),
      subtitle: "Sessions scheduled",
      action: "View schedule",
      href: TUTOR_SCHEDULE_ROUTE,
      icon: FiCalendar,
      iconClassName: "bg-[#fff6de] text-[#b58112]",
    },
    {
      title: "Completed Sessions",
      value: String(counts.Completed),
      subtitle: "All-time completed",
      action: "View history",
      href: TUTOR_SCHEDULE_ROUTE,
      icon: FiCheckCircle,
      iconClassName: "bg-[#ebf7ef] text-[#1b8a5a]",
      valueClassName: "text-[#1b8a5a]",
    },
    {
      title: "Total Earnings",
      value: "$2,115",
      subtitle: "Earned all-time",
      action: "View earnings",
      href: TUTOR_EARNINGS_ROUTE,
      icon: FiDollarSign,
      iconClassName: "bg-[#ffecef] text-[#d94a62]",
      valueClassName: "text-[#d61c3f]",
    },
  ];

  return (
    <TutorShell>
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Hey, Marcus!</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">Saturday, March 28, 2026</p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <Link
              href={TUTOR_AVAILABILITY_ROUTE}
              className="inline-flex h-11 items-center gap-3 rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
            >
              <FiPlusCircle className="h-4 w-4" />
              <span>Manage Availability</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-[#ffcc1d] px-4 py-3 text-[13px] font-medium text-[#7a5200]">
          Spring bookings are picking up! Make sure your availability is up to date to receive new session requests.
        </div>

        <section className="mt-4 grid gap-3 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <SummaryCardView key={card.title} card={card} />
          ))}
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[17px] font-bold text-[#20242b]">Upcoming Sessions</h2>
            <Link href={TUTOR_SCHEDULE_ROUTE} className="text-[13px] font-semibold text-[#d61c3f]">
              View all
            </Link>
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
              {tutorDashboardSessions.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-4 px-4 py-4 md:grid-cols-[1.6fr_1fr_1fr_0.9fr_0.9fr_0.8fr_0.7fr_0.8fr] md:items-center"
                >
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
                    <span className="inline-flex rounded-full bg-[#ffecef] px-2.5 py-1 text-[11px] font-medium text-[#d94a62]">
                      {session.type}
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-[#374151]">{session.rate}</div>
                  <div>
                    <Link
                      href={TUTOR_SCHEDULE_ROUTE}
                      className="inline-flex rounded-full border border-[#d61c3f] px-3.5 py-1.5 text-[12px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="flex items-center justify-between rounded-[12px] bg-[#ffe8ed] px-4 py-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#20242b]">Update Availability</h3>
              <p className="mt-1 text-[13px] text-[#6b7280]">Set your open time slots for students to book.</p>
            </div>
            <Link
              href={TUTOR_AVAILABILITY_ROUTE}
              className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
            >
              Manage
            </Link>
          </div>

          <div className="flex items-center justify-between rounded-[12px] border border-[#eceef2] bg-white px-4 py-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#20242b]">Complete Your Profile</h3>
              <p className="mt-1 text-[13px] text-[#6b7280]">Keep your bio, subjects, and rates up to date.</p>
            </div>
            <Link
              href={TUTOR_PROFILE_ROUTE}
              className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
            >
              Edit Profile
            </Link>
          </div>
        </section>
      </div>
    </TutorShell>
  );
}
