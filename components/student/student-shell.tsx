"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiCalendar,
  FiGrid,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";

import {
  STUDENT_DASHBOARD_ROUTE,
  STUDENT_FIND_TUTORS_ROUTE,
  STUDENT_MESSAGES_ROUTE,
  STUDENT_PROFILE_ROUTE,
  STUDENT_SCHEDULE_ROUTE,
  STUDENT_SETTINGS_ROUTE,
} from "@/lib/routes";
import { studentMessagesUnreadCount } from "@/lib/student/messages-data";

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
  { label: "Dashboard", href: STUDENT_DASHBOARD_ROUTE, icon: FiGrid },
  { label: "Find Tutors", href: STUDENT_FIND_TUTORS_ROUTE, icon: FiSearch },
  { label: "My Schedule", href: STUDENT_SCHEDULE_ROUTE, icon: FiCalendar },
  {
    label: "Messages",
    href: STUDENT_MESSAGES_ROUTE,
    icon: FiMessageSquare,
    badge: studentMessagesUnreadCount > 0 ? String(studentMessagesUnreadCount) : undefined,
  },
  { label: "Profile", href: STUDENT_PROFILE_ROUTE, icon: FiUser },
  { label: "Settings", href: STUDENT_SETTINGS_ROUTE, icon: FiSettings },
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
      aria-label={item.label}
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

export function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideTopHeader =
    pathname.startsWith("/student-dashboard/find-tutors/") ||
    pathname.startsWith("/student-dashboard/schedule") ||
    pathname === STUDENT_MESSAGES_ROUTE ||
    pathname === STUDENT_PROFILE_ROUTE ||
    pathname === STUDENT_SETTINGS_ROUTE;

  return (
    <main className="min-h-screen bg-[#fbfbfc] text-[#1f2937]">
      <div className="min-h-screen xl:pl-[172px]">
        <aside className="w-full border-b border-[#eceef2] bg-white xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:w-[172px] xl:border-r xl:border-b-0">
          <div className="border-b border-[#eceef2] px-4 py-5">
            <Link href="/" className="block">
              <p className="text-[14px] font-bold leading-none text-[#d61c3f]">Arch City Tutors</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                Student Portal
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
                    (item.href !== STUDENT_DASHBOARD_ROUTE && pathname.startsWith(`${item.href}/`))
                  }
                />
              ))}
            </nav>

            <div className="mt-8 border-t border-[#eceef2] px-2 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-bold text-[#d61c3f]">
                  JD
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#374151]">Jordan Davis</p>
                  <p className="truncate text-[11px] text-[#6b7280]">jordan@email.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 xl:min-h-screen">
          {!hideTopHeader ? (
            <header className="border-b border-[#eceef2] bg-white xl:sticky xl:top-0 xl:z-20">
              <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                <div className="relative w-full max-w-[560px]">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder="Search tutors, subjects, sessions..."
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#9ca3af] focus:border-[#d1d5db]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f4f4f5]"
                    aria-label="Notifications"
                  >
                    <FiBell className="h-4 w-4" />
                  </button>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-semibold text-[#d61c3f]">
                    JD
                  </div>
                </div>
              </div>
            </header>
          ) : null}

          <div className="py-5 xl:max-w-[calc(100vw-172px)]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
