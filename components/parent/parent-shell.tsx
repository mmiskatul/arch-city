"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiGrid,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import {
  PARENT_DASHBOARD_ROUTE,
  PARENT_FIND_TUTORS_ROUTE,
  PARENT_MESSAGES_ROUTE,
  PARENT_PROFILE_ROUTE,
  PARENT_SCHEDULE_ROUTE,
  PARENT_SETTINGS_ROUTE,
  PARENT_STUDENTS_ROUTE,
} from "@/lib/routes";
import { parentMessagesUnreadCount } from "@/lib/parent/messages-data";

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
  { label: "Dashboard", href: PARENT_DASHBOARD_ROUTE, icon: FiGrid },
  { label: "Find Tutors", href: PARENT_FIND_TUTORS_ROUTE, icon: FiSearch },
  { label: "Schedule", href: PARENT_SCHEDULE_ROUTE, icon: FiCalendar },
  { label: "Students", href: PARENT_STUDENTS_ROUTE, icon: FiUsers },
  {
    label: "Messages",
    href: PARENT_MESSAGES_ROUTE,
    icon: FiMessageSquare,
    badge: parentMessagesUnreadCount > 0 ? String(parentMessagesUnreadCount) : undefined,
  },
  { label: "Profile", href: PARENT_PROFILE_ROUTE, icon: FiUser },
  { label: "Settings", href: PARENT_SETTINGS_ROUTE, icon: FiSettings },
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

export function ParentShell({
  children,
  messagesUnreadCountOverride,
}: {
  children: ReactNode;
  messagesUnreadCountOverride?: number;
}) {
  const pathname = usePathname();
  const resolvedMessagesUnreadCount =
    messagesUnreadCountOverride ?? parentMessagesUnreadCount;
  const resolvedMenuItems: NavItem[] = menuItems.map((item) =>
    item.href === PARENT_MESSAGES_ROUTE
      ? {
          ...item,
          badge:
            resolvedMessagesUnreadCount > 0
              ? String(resolvedMessagesUnreadCount)
              : undefined,
        }
      : item,
  );

  return (
    <main className="min-h-screen bg-[#fbfbfc] text-[#1f2937]">
      <div className="min-h-screen xl:pl-[172px]">
        <aside className="w-full border-b border-[#eceef2] bg-white xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:w-[172px] xl:border-r xl:border-b-0">
          <div className="border-b border-[#eceef2] px-4 py-5">
            <Link href="/" className="block">
              <p className="text-[14px] font-bold leading-none text-[#d61c3f]">Arch City Tutors</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                Parent Portal
              </p>
            </Link>
          </div>

          <div
            className="flex flex-col justify-between px-3 py-4 xl:h-[calc(100vh-73px)]"
            style={hiddenScrollbarStyle}
          >
            <nav className="space-y-1">
              {resolvedMenuItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  active={
                    pathname === item.href ||
                    (item.href !== PARENT_DASHBOARD_ROUTE && pathname.startsWith(`${item.href}/`))
                  }
                />
              ))}
            </nav>

            <div className="mt-8 border-t border-[#eceef2] px-2 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-bold text-[#d61c3f]">
                  SW
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#374151]">Sarah Wilson</p>
                  <p className="truncate text-[11px] text-[#6b7280]">sarah@email.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 xl:min-h-screen">
          <div className="py-5 xl:max-w-[calc(100vw-172px)]">{children}</div>
        </section>
      </div>
    </main>
  );
}
