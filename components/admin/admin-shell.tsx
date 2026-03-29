"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiCalendar,
  FiDollarSign,
  FiGrid,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import {
  ADMIN_DASHBOARD_ROUTE,
  ADMIN_FINANCES_ROUTE,
  ADMIN_MESSAGES_ROUTE,
  ADMIN_NOTIFICATIONS_ROUTE,
  ADMIN_SCHEDULES_ROUTE,
  ADMIN_SETTINGS_ROUTE,
  ADMIN_STUDENTS_ROUTE,
  ADMIN_TUTORS_ROUTE,
} from "@/lib/routes";

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
  { label: "Dashboard", href: ADMIN_DASHBOARD_ROUTE, icon: FiGrid },
  { label: "Students", href: ADMIN_STUDENTS_ROUTE, icon: FiUsers },
  { label: "Tutors", href: ADMIN_TUTORS_ROUTE, icon: FiUser },
  { label: "Schedules", href: ADMIN_SCHEDULES_ROUTE, icon: FiCalendar },
  { label: "Finances", href: ADMIN_FINANCES_ROUTE, icon: FiDollarSign },
  { label: "Messages", href: ADMIN_MESSAGES_ROUTE, icon: FiMessageSquare, badge: "5" },
  { label: "Notifications", href: ADMIN_NOTIFICATIONS_ROUTE, icon: FiBell, badge: "3" },
  { label: "Settings", href: ADMIN_SETTINGS_ROUTE, icon: FiSettings },
];

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium transition ${
        active ? "bg-[#ffe9ec] text-[#d61c3f]" : "text-[#4b5563] hover:bg-[#f7f7f8]"
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

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#1f2937]">
      <div className="min-h-screen xl:pl-[206px]">
        <aside className="w-full border-b border-[#e8eaef] bg-white xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:w-[206px] xl:border-r xl:border-b-0">
          <div className="border-b border-[#e8eaef] px-4 py-5">
            <Link href="/" className="block">
              <p className="text-[24px] font-bold leading-none text-[#d61c3f]">Arch City Tutors</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                Admin Portal
              </p>
            </Link>
          </div>

          <div
            className="flex flex-col justify-between px-3 py-4 xl:h-[calc(100vh-84px)]"
            style={hiddenScrollbarStyle}
          >
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  active={
                    item.href === ADMIN_DASHBOARD_ROUTE
                      ? pathname === ADMIN_DASHBOARD_ROUTE
                      : pathname === item.href || pathname.startsWith(`${item.href}/`)
                  }
                />
              ))}
            </nav>

            <div className="mt-8 border-t border-[#e8eaef] px-2 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-bold text-[#d61c3f]">
                  AD
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#374151]">Admin User</p>
                  <p className="truncate text-[11px] text-[#6b7280]">admin@archcity.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 xl:min-h-screen">
          <header className="border-b border-[#e8eaef] bg-white xl:sticky xl:top-0 xl:z-20">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
              <div className="relative w-full max-w-[520px]">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search students, tutors, sessions..."
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
                  AD
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-5 lg:px-6 xl:max-w-[calc(100vw-206px)]">{children}</div>
        </section>
      </div>
    </main>
  );
}
