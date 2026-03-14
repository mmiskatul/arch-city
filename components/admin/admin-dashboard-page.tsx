"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiCheckCircle,
  FiCheckSquare,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiMonitor,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";

type StatCard = {
  title: string;
  value: string;
  action: string;
  icon: IconType;
  href: string;
};

const statCards: StatCard[] = [
  {
    title: "Applications to Review",
    value: "0",
    action: "View",
    icon: FiFileText,
    href: "/admin-dashboard/applications",
  },
  {
    title: "Subscription Fee Collected",
    value: "$1,195",
    action: "View",
    icon: FiCheckSquare,
    href: "#",
  },
  {
    title: "Scheduling Fee Collected",
    value: "$915",
    action: "View",
    icon: FiDollarSign,
    href: "#",
  },
  {
    title: "Total Users",
    value: "672",
    action: "View all",
    icon: FiUsers,
    href: "#",
  },
  {
    title: "Subscribed Users",
    value: "1",
    action: "View all",
    icon: FiCheckSquare,
    href: "#",
  },
  {
    title: "Subscribed Parents",
    value: "16",
    action: "View all",
    icon: FiClock,
    href: "#",
  },
  {
    title: "Active Tutors",
    value: "168",
    action: "View all",
    icon: FiMonitor,
    href: "#",
  },
  {
    title: "Tutoring Sessions",
    value: "183",
    action: "View all",
    icon: FiCalendar,
    href: "#",
  },
  {
    title: "Upcoming Tutoring Sessions",
    value: "1",
    action: "View all",
    icon: FiClock,
    href: "#",
  },
  {
    title: "Completed Tutoring Sessions",
    value: "85",
    action: "View all",
    icon: FiCheckCircle,
    href: "#",
  },
  {
    title: "Cancelled Tutoring Sessions",
    value: "97",
    action: "View all",
    icon: FiXCircle,
    href: "#",
  },
];

function StatCardView({ card }: { card: StatCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-[24px] border border-[#ececec] bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#db1820] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[15px] text-[#6b7280]">{card.title}</p>
          <p className="mt-1 text-[18px] font-bold text-[#111827]">{card.value}</p>
        </div>
        <Link
          href={card.href}
          className="rounded-xl bg-[#ef242a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#d91b21]"
        >
          {card.action}
        </Link>
      </div>
    </article>
  );
}

export function AdminDashboardPage() {
  return (
    <AdminShell breadcrumbLabel="Admin Dashboard">
      <div className="mt-12">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111827]">
          Welcome Arch City Tutors!
        </h1>
        <p className="mt-2 text-lg text-[#6b7280]">
          A brand new day is here. It&apos;s your day to manage the platform.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatCardView key={card.title} card={card} />
        ))}
      </div>
    </AdminShell>
  );
}
