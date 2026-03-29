import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiCheckCircle,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import {
  parentDashboardState,
  parentStudents,
  parentSummaryCards,
  parentUpcomingSessions,
  type ParentSummaryCard,
} from "@/lib/parent/dashboard-data";
import {
  PARENT_FIND_TUTORS_ROUTE,
  PARENT_MESSAGES_ROUTE,
  PARENT_SCHEDULE_ROUTE,
  PARENT_STUDENTS_ROUTE,
} from "@/lib/routes";

type QuickAction = {
  label: string;
  href: string;
  icon: IconType;
  iconClassName: string;
};

type EmptyStateCard = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  icon: IconType;
  iconClassName: string;
  buttonClassName: string;
};

const emptyStateCards: EmptyStateCard[] = [
  {
    eyebrow: "Empty State — No Students Added",
    title: "No students yet",
    description: "Add your child's profile to start booking sessions with our verified tutors.",
    actionLabel: "+ Add Your First Student",
    href: PARENT_STUDENTS_ROUTE,
    icon: FiUsers,
    iconClassName: "bg-[#ffe8ed] text-[#d61c3f]",
    buttonClassName: "bg-[#d61c3f] text-white hover:bg-[#be1837]",
  },
  {
    eyebrow: "Empty State — No Sessions Booked",
    title: "No sessions scheduled",
    description: "Browse our vetted tutors and book your child's first session today.",
    actionLabel: "Find a Tutor",
    href: PARENT_FIND_TUTORS_ROUTE,
    icon: FiCalendar,
    iconClassName: "bg-[#e9f7f0] text-[#1b8a5a]",
    buttonClassName: "bg-[#d61c3f] text-white hover:bg-[#be1837]",
  },
  {
    eyebrow: "Empty State — No Messages",
    title: "No messages yet",
    description: "Messages from tutors will appear here once your child's sessions are booked.",
    actionLabel: "Book a Session",
    href: PARENT_FIND_TUTORS_ROUTE,
    icon: FiMessageSquare,
    iconClassName: "bg-[#e7f0ff] text-[#2c78f4]",
    buttonClassName: "border border-[#d61c3f] text-[#d61c3f] hover:bg-[#fff4f6]",
  },
  {
    eyebrow: "Empty State — No Session History",
    title: "No completed sessions",
    description: "Completed sessions will appear here. Book your first session to get started.",
    actionLabel: "Find a Tutor",
    href: PARENT_FIND_TUTORS_ROUTE,
    icon: FiCheckCircle,
    iconClassName: "bg-[#fff5d9] text-[#a68010]",
    buttonClassName: "border border-[#d61c3f] text-[#d61c3f] hover:bg-[#fff4f6]",
  },
];

const quickActions: QuickAction[] = [
  {
    label: "Find a Tutor",
    href: PARENT_FIND_TUTORS_ROUTE,
    icon: FiSearch,
    iconClassName: "bg-[#ffecef] text-[#d61c3f]",
  },
  {
    label: "View Schedule",
    href: PARENT_SCHEDULE_ROUTE,
    icon: FiCalendar,
    iconClassName: "bg-[#e9f7f0] text-[#1b8a5a]",
  },
  {
    label: "Manage Students",
    href: PARENT_STUDENTS_ROUTE,
    icon: FiUsers,
    iconClassName: "bg-[#fff5d9] text-[#a68010]",
  },
  {
    label: "Messages",
    href: PARENT_MESSAGES_ROUTE,
    icon: FiMessageSquare,
    iconClassName: "bg-[#e7f0ff] text-[#2c78f4]",
  },
];

function getSummaryIcon(tone: ParentSummaryCard["tone"]) {
  if (tone === "green") {
    return {
      icon: FiCheckCircle,
      iconClassName: "bg-[#ebf7ef] text-[#1b8a5a]",
      valueClassName: "text-[#1b8a5a]",
    };
  }

  if (tone === "gold") {
    return {
      icon: FiUser,
      iconClassName: "bg-[#fff5d9] text-[#a68010]",
      valueClassName: "",
    };
  }

  return {
    icon: FiCalendar,
    iconClassName: "bg-[#ffecef] text-[#d61c3f]",
    valueClassName: "text-[#d61c3f]",
  };
}

function EmptyStateCardView({ card }: { card: EmptyStateCard }) {
  const Icon = card.icon;

  return (
    <section>
      <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6673]">
        {card.eyebrow}
      </p>
      <article className="mt-3 flex min-h-[250px] flex-col items-center justify-center rounded-[16px] bg-[#f9fafb] px-6 py-10 text-center">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClassName}`}>
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="mt-7 text-[18px] font-bold text-[#20242b]">{card.title}</h2>
        <p className="mt-2 max-w-[380px] text-[14px] leading-6 text-[#6b7280]">{card.description}</p>
        <Link
          href={card.href}
          className={`mt-7 inline-flex h-11 items-center justify-center rounded-full px-6 text-[14px] font-semibold transition ${card.buttonClassName}`}
        >
          {card.actionLabel}
        </Link>
      </article>
    </section>
  );
}

function SummaryCardView({ card }: { card: ParentSummaryCard }) {
  const { icon: Icon, iconClassName, valueClassName } = getSummaryIcon(card.tone);

  return (
    <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">
            {card.title}
          </p>
          {card.value ? (
            <p className={`mt-4 text-[22px] font-bold text-[#20242b] ${valueClassName}`}>
              {card.value}
            </p>
          ) : (
            <p className="mt-4 text-[18px] font-bold text-[#20242b]">{card.extra}</p>
          )}
          <p className="mt-1 text-[14px] text-[#6b7280]">{card.subtitle}</p>
        </div>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClassName}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

function EmptyDashboard() {
  return (
    <>
      <div className="border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
        <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Dashboard</h1>
      </div>

      <div className="grid gap-5 bg-white px-4 py-5 sm:px-5 lg:grid-cols-2 lg:px-6">
        {emptyStateCards.map((card) => (
          <EmptyStateCardView key={card.eyebrow} card={card} />
        ))}
      </div>
    </>
  );
}

function ActiveDashboard() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
        <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Dashboard</h1>
        <Link
          href={PARENT_FIND_TUTORS_ROUTE}
          className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
        >
          + Book Session
        </Link>
      </div>

      <div className="bg-white px-4 py-5 sm:px-5 lg:px-6">
        <section className="rounded-[14px] border border-[#e7e7eb] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[14px] font-medium text-[#374151]">Viewing stats for:</span>
            {parentStudents.map((student) => (
              <button
                key={student.name}
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition ${
                  student.active ? "bg-[#d61c3f] text-white" : "bg-[#f3f4f6] text-[#4b5563]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                    student.active ? "bg-[#bf1737] text-white" : "bg-white text-[#d61c3f]"
                  }`}
                >
                  {student.initials}
                </span>
                {student.name}
              </button>
            ))}
            <Link
              href={PARENT_STUDENTS_ROUTE}
              className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-2 text-[14px] font-medium text-[#4b5563] transition hover:bg-[#ebecef]"
            >
              <FiPlus className="h-4 w-4" />
              Add Student
            </Link>
          </div>
        </section>

        <section className="mt-5">
          <p className="text-[18px] font-medium text-[#374151]">Jordan Wilson — 11th Grade</p>

          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {parentSummaryCards.map((card) => (
              <SummaryCardView key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[17px] font-bold text-[#20242b]">Jordan&apos;s Upcoming Sessions</h2>
            <Link href={PARENT_SCHEDULE_ROUTE} className="text-[13px] font-semibold text-[#d61c3f]">
              View full schedule &#8594;
            </Link>
          </div>

          <div className="mt-3 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="hidden grid-cols-[1.5fr_0.9fr_0.7fr_0.9fr_0.7fr_0.7fr_0.8fr_0.8fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
              <span>Tutor</span>
              <span>Date</span>
              <span>Time</span>
              <span>Subject</span>
              <span>Duration</span>
              <span>Type</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {parentUpcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-4 px-4 py-4 md:grid-cols-[1.5fr_0.9fr_0.7fr_0.9fr_0.7fr_0.7fr_0.8fr_0.8fr] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                      {session.tutorInitials}
                    </span>
                    <p className="text-[14px] font-medium text-[#374151]">{session.tutorName}</p>
                  </div>
                  <div className="text-[14px] text-[#4b5563]">{session.date}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.time}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.subject}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.duration}</div>
                  <div>
                    <span className="inline-flex rounded-full bg-[#ffecef] px-2.5 py-1 text-[11px] font-medium text-[#d94a62]">
                      {session.type}
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex rounded-full bg-[#fff6de] px-2.5 py-1 text-[11px] font-medium text-[#b58112]">
                      {session.status}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={PARENT_SCHEDULE_ROUTE}
                      className="inline-flex rounded-full border border-[#d61c3f] px-4 py-1.5 text-[12px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-[17px] font-bold text-[#20242b]">Quick Actions</h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex min-h-[84px] flex-col items-center justify-center rounded-[14px] bg-[#f9fafb] px-4 py-5 text-center transition hover:bg-[#f5f6f8]"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.iconClassName}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-4 text-[15px] font-semibold text-[#20242b]">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

export function ParentDashboardPage() {
  return (
    <ParentShell>
      <div className="w-full">
        {parentDashboardState === "empty" ? <EmptyDashboard /> : <ActiveDashboard />}
      </div>
    </ParentShell>
  );
}
