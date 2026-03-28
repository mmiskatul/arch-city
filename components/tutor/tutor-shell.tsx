"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiGrid,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";

import {
  TUTOR_AVAILABILITY_ROUTE,
  TUTOR_DASHBOARD_ROUTE,
  TUTOR_EARNINGS_ROUTE,
  TUTOR_MESSAGES_ROUTE,
  TUTOR_PROFILE_ROUTE,
  TUTOR_SCHEDULE_ROUTE,
  TUTOR_SETTINGS_ROUTE,
} from "@/lib/routes";
import { tutorMessagesUnreadCount } from "@/lib/tutor/dashboard-data";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  badge?: string;
};

const hiddenScrollbarStyle: CSSProperties = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

const menuItems: NavItem[] = [
  { label: "Dashboard", href: TUTOR_DASHBOARD_ROUTE, icon: FiGrid },
  { label: "My Schedule", href: TUTOR_SCHEDULE_ROUTE, icon: FiCalendar },
  { label: "Availability", href: TUTOR_AVAILABILITY_ROUTE, icon: FiClock },
  {
    label: "Messages",
    href: TUTOR_MESSAGES_ROUTE,
    icon: FiMessageSquare,
    badge: tutorMessagesUnreadCount > 0 ? String(tutorMessagesUnreadCount) : undefined,
  },
  { label: "Earnings", href: TUTOR_EARNINGS_ROUTE, icon: FiDollarSign },
  { label: "Profile", href: TUTOR_PROFILE_ROUTE, icon: FiUser },
  { label: "Settings", href: TUTOR_SETTINGS_ROUTE, icon: FiSettings },
];

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium transition ${
        active
          ? "bg-[#ffe9ec] text-[#d61c3f]"
          : "text-[#4b5563] hover:bg-[#f7f7f8]"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </span>
      {item.badge ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d61c3f] px-1.5 text-[10px] font-semibold text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export function TutorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#fbfbfc] text-[#1f2937]">
      <div className="min-h-screen xl:pl-[182px]">
        <aside className="w-full border-b border-[#eceef2] bg-white xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:w-[182px] xl:border-r xl:border-b-0">
          <div className="border-b border-[#eceef2] px-4 py-5">
            <Link href="/" className="block">
              <p className="text-[14px] font-bold leading-none text-[#d61c3f]">Arch City Tutors</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                Tutor Portal
              </p>
            </Link>
          </div>

          <div
            className="flex flex-col justify-between px-3 py-4 xl:h-[calc(100vh-73px)]"
            style={hiddenScrollbarStyle}
          >
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  active={
                    pathname === item.href ||
                    (item.href !== TUTOR_DASHBOARD_ROUTE && pathname.startsWith(`${item.href}/`))
                  }
                />
              ))}
            </nav>

            <div className="mt-8 border-t border-[#eceef2] px-2 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-bold text-[#d61c3f]">
                  MT
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#374151]">Marcus Thompson</p>
                  <p className="truncate text-[11px] text-[#6b7280]">marcus@email.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 xl:min-h-screen">
          <header className="border-b border-[#eceef2] bg-white xl:sticky xl:top-0 xl:z-20">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
              <div className="relative w-full max-w-[560px]">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search students, sessions..."
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#9ca3af] focus:border-[#d1d5db]"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f4f4f5]"
                  aria-label="Notifications"
                >
                  <FiBell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d61c3f]" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-semibold text-[#d61c3f]">
                  MT
                </div>
              </div>
            </div>
          </header>

          <div className="py-5 xl:max-w-[calc(100vw-182px)]">{children}</div>
        </section>
      </div>
    </main>
  );
}
