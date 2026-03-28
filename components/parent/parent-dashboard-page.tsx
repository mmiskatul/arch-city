import Link from "next/link";
import type { IconType } from "react-icons";
import { FiCalendar, FiMessageSquare, FiTrendingUp, FiUsers } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import {
  PARENT_FIND_TUTORS_ROUTE,
  PARENT_STUDENTS_ROUTE,
} from "@/lib/routes";

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

const cards: EmptyStateCard[] = [
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
    icon: FiTrendingUp,
    iconClassName: "bg-[#fff5d9] text-[#a68010]",
    buttonClassName: "border border-[#d61c3f] text-[#d61c3f] hover:bg-[#fff4f6]",
  },
];

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

export function ParentDashboardPage() {
  return (
    <ParentShell>
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Dashboard</h1>
        </div>

        <div className="grid gap-5 bg-white px-4 py-5 sm:px-5 lg:grid-cols-2 lg:px-6">
          {cards.map((card) => (
            <EmptyStateCardView key={card.eyebrow} card={card} />
          ))}
        </div>
      </div>
    </ParentShell>
  );
}
