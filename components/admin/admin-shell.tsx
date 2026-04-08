"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiCalendar,
  FiDollarSign,
  FiGrid,
  FiLogOut,
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
import { browserApiRequest } from "@/lib/api/browser-api-client";
import { getAdminMessageCount } from "@/lib/api/admin-messages-api";
import { getNotificationCount } from "@/lib/api/notifications-api";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notifications-store";
import { useNotificationsSocket } from "@/lib/realtime/notifications-socket";
import { useDashboardAuth } from "@/components/auth/dashboard-auth-context";

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
  { label: "Messages", href: ADMIN_MESSAGES_ROUTE, icon: FiMessageSquare },
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

function clearAuthCookies() {
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `arch_access_token=; Path=/; Expires=${expired}; Max-Age=0; SameSite=Lax`;
  document.cookie = `arch_refresh_token=; Path=/; Expires=${expired}; Max-Age=0; SameSite=Lax`;
  document.cookie = `arch_user_role=; Path=/; Expires=${expired}; Max-Age=0; SameSite=Lax`;
}

function redirectToLogin() {
  clearAuthCookies();
  window.dispatchEvent(new Event("arch-session-updated"));
  window.location.replace("/login");
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { tokenPresent, isAuthenticated } = useDashboardAuth();
  const [messageBadge, setMessageBadge] = useState("0");
  const [notificationsBadge, setNotificationsBadge] = useState("0");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [topUserMenuOpen, setTopUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const topUserMenuRef = useRef<HTMLDivElement | null>(null);
  useNotificationsSocket(tokenPresent && isAuthenticated);

  useEffect(() => {
    if (!tokenPresent || !isAuthenticated) {
      setMessageBadge("0");
      setNotificationsBadge("0");
      return;
    }

    let cancelled = false;

    async function loadBadge() {
      try {
        const payload = await getAdminMessageCount();
        if (cancelled) return;

        setMessageBadge(String(payload.unread_count || 0));
      } catch {
        if (!cancelled) {
          setMessageBadge("0");
        }
      }
    }

    async function loadNotificationsBadge() {
      try {
        const payload = await getNotificationCount("admin");
        setNotificationsBadge(String(payload.unread_count || 0));
      } catch {
        setNotificationsBadge("0");
      }
    }

    void loadBadge();
    void loadNotificationsBadge();

    const refresh = () => {
      void loadBadge();
    };
    const refreshNotifications = () => {
      void loadNotificationsBadge();
    };

    window.addEventListener("arch-messages-updated", refresh);
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshNotifications);
    window.addEventListener("focus", refresh);

    const intervalId = window.setInterval(loadBadge, 30000);

    return () => {
      cancelled = true;
      window.removeEventListener("arch-messages-updated", refresh);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshNotifications);
      window.removeEventListener("focus", refresh);
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, tokenPresent]);

  const sidebarItems = menuItems.map((item) =>
    item.href === ADMIN_MESSAGES_ROUTE ? { ...item, badge: messageBadge !== "0" ? messageBadge : undefined } : item,
  ).map((item) =>
    item.href === ADMIN_NOTIFICATIONS_ROUTE
      ? { ...item, badge: notificationsBadge !== "0" ? notificationsBadge : undefined }
      : item,
  );

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      const target = event.target as Node;
      const inSidebarMenu = userMenuRef.current?.contains(target) ?? false;
      const inTopMenu = topUserMenuRef.current?.contains(target) ?? false;

      if (!inSidebarMenu) {
        setUserMenuOpen(false);
      }

      if (!inTopMenu) {
        setTopUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    if (tokenPresent && isAuthenticated) return;
    redirectToLogin();
  }, [isAuthenticated, tokenPresent]);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, "");
    if (baseUrl && tokenPresent) {
      try {
        await browserApiRequest({
          url: `${baseUrl}/auth/logout`,
          method: "POST",
        });
      } catch {
        // Ignore network errors on logout and clear local session anyway.
      }
    }

    setUserMenuOpen(false);
    redirectToLogin();
  }

  const searchPlaceholder = pathname.startsWith(ADMIN_MESSAGES_ROUTE)
    ? "Search conversations..."
    : pathname.startsWith(ADMIN_NOTIFICATIONS_ROUTE)
      ? "Search notifications..."
      : pathname.startsWith(ADMIN_SETTINGS_ROUTE)
        ? ""
        : "Search students, tutors, sessions...";

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
              {sidebarItems.map((item) => (
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

            <div className="relative mt-8 border-t border-[#e8eaef] px-2 pt-4" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setTopUserMenuOpen(false);
                  setUserMenuOpen((open) => !open);
                }}
                className="w-full rounded-xl p-1 text-left transition hover:bg-[#f7f7f8]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-bold text-[#d61c3f]">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#374151]">Admin User</p>
                    <p className="truncate text-[11px] text-[#6b7280]">admin@archcity.com</p>
                  </div>
                </div>
              </button>

              {userMenuOpen ? (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-[#e8eaef] bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
                  <Link
                    href={ADMIN_SETTINGS_ROUTE}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[#374151] transition hover:bg-[#f7f7f8]"
                  >
                    <FiUser className="h-4 w-4 text-[#6b7280]" />
                    <span>Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] font-medium text-[#d61c3f] transition hover:bg-[#fff1f3] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              ) : null}
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
                  placeholder={searchPlaceholder}
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
                <div className="relative" ref={topUserMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setTopUserMenuOpen((open) => !open);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-semibold text-[#d61c3f] transition hover:opacity-90"
                    aria-label="Open profile menu"
                  >
                    AD
                  </button>

                  {topUserMenuOpen ? (
                    <div className="absolute right-0 top-full z-30 mt-2 w-40 rounded-xl border border-[#e8eaef] bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
                      <Link
                        href={ADMIN_SETTINGS_ROUTE}
                        onClick={() => setTopUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[#374151] transition hover:bg-[#f7f7f8]"
                      >
                        <FiUser className="h-4 w-4 text-[#6b7280]" />
                        <span>Profile</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] font-medium text-[#d61c3f] transition hover:bg-[#fff1f3] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiLogOut className="h-4 w-4" />
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                      </button>
                    </div>
                  ) : null}
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


