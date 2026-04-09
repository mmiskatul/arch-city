"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertTriangle, FiBell, FiCalendar, FiCheckCircle, FiClock, FiDollarSign, FiMessageSquare, FiUserPlus } from "react-icons/fi";

import { NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notifications-store";
import {
  getNotifications,
  markNotificationsRead,
  type NotificationItem,
  type NotificationRole,
} from "@/lib/api/notifications-api";

function getIconConfig(item: NotificationItem) {
  const text = `${item.title} ${item.category}`.toLowerCase();

  if (text.includes("application")) {
    return { icon: FiUserPlus, className: "bg-[#ffecef] text-[#d94a62]" };
  }
  if (text.includes("dispute") || text.includes("alert")) {
    return { icon: FiAlertTriangle, className: "bg-[#fff6de] text-[#9c7a1e]" };
  }
  if (text.includes("payment") || text.includes("payout") || text.includes("billing") || text.includes("earnings")) {
    return { icon: FiDollarSign, className: "bg-[#ebf7ef] text-[#239157]" };
  }
  if (text.includes("session") || text.includes("schedule")) {
    return { icon: FiCalendar, className: "bg-[#ebf1ff] text-[#2952cc]" };
  }
  if (text.includes("message")) {
    return { icon: FiMessageSquare, className: "bg-[#fff1f4] text-[#d61c3f]" };
  }
  if (text.includes("system") || text.includes("settings")) {
    return { icon: FiClock, className: "bg-[#f1f1f1] text-[#6b7280]" };
  }

  return { icon: FiCheckCircle, className: "bg-[#ebf7ef] text-[#239157]" };
}

function formatTimeLabel(value: string) {
  return String(value || "").trim();
}

export function NotificationBellMenu({
  role,
  viewAllHref,
  badgeCount,
  onBeforeOpen,
}: {
  role: NotificationRole;
  viewAllHref: string;
  badgeCount: number;
  onBeforeOpen?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadNotifications() {
      setLoading(true);
      setError("");
      try {
        const payload = await getNotifications(role);
        if (cancelled) return;
        setItems(payload.items || []);
      } catch {
        if (!cancelled) {
          setItems([]);
          setError("Unable to load notifications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNotifications();

    const refresh = () => {
      void loadNotifications();
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [open, role]);

  async function openNotification(item: NotificationItem) {
    if (item.unread) {
      try {
        await markNotificationsRead(role, { notification_ids: [item.id] });
        setItems((current) =>
          current.map((entry) => (entry.id === item.id ? { ...entry, unread: false, section: "earlier" } : entry)),
        );
        window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
      } catch {
        // Continue navigation even if the read state could not be saved.
      }
    }

    setOpen(false);

    if (item.href) {
      router.push(item.href);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => {
          if (!open) {
            onBeforeOpen?.();
          }
          setOpen((current) => !current);
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f4f4f5]"
        aria-label="Notifications"
      >
        <FiBell className="h-4 w-4" />
        {badgeCount > 0 ? (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d61c3f] px-1 text-[10px] font-semibold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-[380px] overflow-hidden rounded-2xl border border-[#e8eaef] bg-white shadow-[0_18px_42px_rgba(15,23,42,0.14)]">
          <div className="flex items-center justify-between border-b border-[#eceef2] px-4 py-3">
            <div>
              <p className="text-[14px] font-bold text-[#20242b]">Notifications</p>
              <p className="text-[12px] text-[#6b7280]">
                {badgeCount === 0 ? "No unread notifications" : `${badgeCount} unread`}
              </p>
            </div>
            <Link
              href={viewAllHref}
              onClick={() => setOpen(false)}
              className="text-[12px] font-semibold text-[#d61c3f]"
            >
              View all
            </Link>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-5 text-[13px] text-[#6b7280]">Loading notifications...</div>
            ) : error ? (
              <div className="px-4 py-5 text-[13px] text-[#b91c1c]">{error}</div>
            ) : items.length > 0 ? (
              items.slice(0, 8).map((item) => {
                const { icon: Icon, className } = getIconConfig(item);
                const unread = Boolean(item.unread);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => void openNotification(item)}
                    className={`relative flex w-full items-start gap-3 border-b border-[#eceef2] px-4 py-3 text-left transition last:border-b-0 ${
                      unread ? "bg-[#f3f4f6]" : "bg-white"
                    } hover:bg-[#fafafb]`}
                  >
                    {unread ? <div className="absolute left-0 top-0 h-full w-1 bg-[#c8cdd5]" /> : null}
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[#20242b]">{item.title}</p>
                      <p className="mt-0.5 max-h-10 overflow-hidden text-[12px] leading-5 text-[#4b5563]">
                        {item.message}
                      </p>
                      <p className="mt-1 text-[11px] text-[#6b7280]">{formatTimeLabel(item.time_label)}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-5 text-[13px] text-[#6b7280]">No notifications.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
