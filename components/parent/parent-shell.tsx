"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiCalendar,
  FiGrid,
  FiLogOut,
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
  PARENT_NOTIFICATIONS_ROUTE,
  PARENT_PROFILE_ROUTE,
  PARENT_SCHEDULE_ROUTE,
  PARENT_SETTINGS_ROUTE,
  PARENT_STUDENTS_ROUTE,
} from "@/lib/routes";
import { useDashboardAuth } from "@/components/auth/dashboard-auth-context";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import { parentMessagesUnreadCount } from "@/lib/parent/messages-data";
import { getNotificationCount } from "@/lib/api/notifications-api";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notifications-store";
import { useNotificationsSocket } from "@/lib/realtime/notifications-socket";
import { NotificationBellMenu } from "@/components/shared/notification-bell-menu";

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
  { label: "Notifications", href: PARENT_NOTIFICATIONS_ROUTE, icon: FiBell },
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

type ShellUserProfile = {
  initials: string;
  name: string;
  email: string;
  phone: string;
};

export function ParentShell({
  children,
  messagesUnreadCountOverride,
}: {
  children: ReactNode;
  messagesUnreadCountOverride?: number;
}) {
  const pathname = usePathname();
  const { tokenPresent, isAuthenticated } = useDashboardAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsUnreadCount, setNotificationsUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState<ShellUserProfile>({
    initials: "PA",
    name: "Parent",
    email: "",
    phone: "",
  });
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  useNotificationsSocket(tokenPresent && isAuthenticated);

  useEffect(() => {
    async function loadProfile() {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, "");
      if (!baseUrl || !tokenPresent) return;

      try {
        const data = await browserApiRequest<{
          first_name: string;
          last_name: string;
          email: string;
          phone_number: string;
          initials: string;
        }>({
          url: `${baseUrl}/parent/profile`,
          method: "GET",
        });

        setUserProfile({
          initials: data.initials || "PA",
          name: `${data.first_name} ${data.last_name}`.trim() || "Parent",
          email: data.email,
          phone: data.phone_number || "",
        });
      } catch {
        // Keep fallback values.
      }
    }

    async function loadNotificationsCount() {
      try {
        const payload = await getNotificationCount("parent");
        setNotificationsUnreadCount(payload.unread_count || 0);
      } catch {
        setNotificationsUnreadCount(0);
      }
    }

    function onProfileUpdated(event: Event) {
      const customEvent = event as CustomEvent<{
        role?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        initials?: string;
      }>;
      const detail = customEvent.detail;
      if (!detail || detail.role !== "parent") return;

      setUserProfile({
        initials: detail.initials || "PA",
        name: `${detail.firstName ?? ""} ${detail.lastName ?? ""}`.trim() || "Parent",
        email: detail.email || "",
        phone: detail.phone || "",
      });
    }

    loadProfile();
    void loadNotificationsCount();
    window.addEventListener("arch-profile-updated", onProfileUpdated as EventListener);
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, loadNotificationsCount);

    return () => {
      window.removeEventListener("arch-profile-updated", onProfileUpdated as EventListener);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, loadNotificationsCount);
    };
  }, [tokenPresent]);
  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      const target = event.target as Node;
      const inSidebarMenu = userMenuRef.current?.contains(target) ?? false;
      if (!inSidebarMenu) {
        setUserMenuOpen(false);
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
    if (baseUrl) {
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
      : item.href === PARENT_NOTIFICATIONS_ROUTE
        ? {
            ...item,
            badge:
              notificationsUnreadCount > 0
                ? String(notificationsUnreadCount)
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

            <div className="relative mt-8 border-t border-[#eceef2] px-2 pt-4" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="w-full rounded-xl p-1 text-left transition hover:bg-[#f7f7f8]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd9df] text-[11px] font-bold text-[#d61c3f]">
                    {userProfile.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#374151]">{userProfile.name}</p>
                    <p className="truncate text-[11px] text-[#6b7280]">{userProfile.email}</p>
                  </div>
                </div>
              </button>

              {userMenuOpen ? (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-[#e8eaef] bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
                  <Link
                    href={PARENT_PROFILE_ROUTE}
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
          <div className="flex items-center justify-end px-4 py-4 sm:px-5 lg:px-6 xl:sticky xl:top-0 xl:z-20 xl:bg-white">
            <NotificationBellMenu
              role="parent"
              viewAllHref={PARENT_NOTIFICATIONS_ROUTE}
              badgeCount={notificationsUnreadCount}
              onBeforeOpen={() => setUserMenuOpen(false)}
            />
          </div>
          <div className="py-5 xl:max-w-[calc(100vw-172px)]">{children}</div>
        </section>
      </div>
    </main>
  );
}

