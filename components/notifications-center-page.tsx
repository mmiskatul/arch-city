"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMessageSquare,
  FiUserPlus,
} from "react-icons/fi";

import { NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notifications-store";
import {
  getNotifications,
  markNotificationsRead,
  type NotificationActionType,
  type NotificationItem,
  type NotificationRole,
} from "@/lib/api/notifications-api";

type ShellComponent = ComponentType<{ children: ReactNode }>;
type Tab = "All" | string;

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

function ActionButton({ action, href }: { action: NotificationActionType; href?: string }) {
  if (action === "none") return null;

  const label = action === "review" ? "Review" : action === "investigate" ? "Investigate" : "View";
  const className =
    action === "review"
      ? "bg-[#d61c3f] text-white"
      : action === "investigate"
        ? "bg-[#9c7a1e] text-white"
        : "text-[#d61c3f]";

  if (action === "view") {
    return (
      <Link href={href ?? "#"} className={`inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-semibold ${className}`}>
        {label}
      </Link>
    );
  }

  return (
    <Link href={href ?? "#"} className={`inline-flex h-8 items-center rounded-lg px-3 text-[12px] font-semibold ${className}`}>
      {label}
    </Link>
  );
}

function formatTimeLabel(value: string) {
  return String(value || "").trim();
}

export function NotificationsCenterPage({
  role,
  Shell,
}: {
  role: NotificationRole;
  Shell: ShellComponent;
}) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, [role]);

  const tabs = useMemo(() => {
    const categories = Array.from(new Set(items.map((item) => item.category)));
    return ["All", ...categories];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items;
    return items.filter((item) => item.category === activeTab);
  }, [activeTab, items]);

  const newItems = filteredItems.filter((item) => item.section === "new" && item.unread);
  const earlierItems = filteredItems.filter((item) => item.section !== "new" || !item.unread);
  const unreadCount = items.filter((item) => item.unread).length;

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead(role, { mark_all: true });
      setItems((current) => current.map((item) => ({ ...item, unread: false, section: "earlier" })));
      window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
    } catch {
      setError("Unable to update notification status.");
    }
  };

  return (
    <Shell>
      <div className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Notifications</h1>
          <button
            type="button"
            onClick={() => void handleMarkAllRead()}
            className="inline-flex h-10 items-center rounded-xl border border-[#e5e7eb] bg-white px-4 text-[13px] font-semibold text-[#6b7280]"
          >
            Mark all as read
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-[#eceef2] bg-white px-2">
          {tabs.map((tab) => {
            const active = tab === activeTab;
            const count = tab === "All" ? unreadCount : items.filter((item) => item.category === tab && item.unread).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`inline-flex h-10 items-center gap-1.5 border-b-2 px-2 text-[14px] font-semibold transition ${
                  active
                    ? "border-[#d94a62] text-[#d61c3f]"
                    : "border-transparent text-[#6b7280] hover:text-[#374151]"
                }`}
              >
                {tab}
                {count > 0 ? (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d61c3f] px-1 text-[10px] font-semibold text-white">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <section className="mt-4 space-y-4">
          {error ? (
            <div className="rounded-xl border border-[#f1c2c7] bg-[#fff4f6] px-4 py-3 text-[13px] text-[#b91c1c]">
              {error}
            </div>
          ) : null}
          {loading ? (
            <div className="rounded-xl border border-[#e7e7eb] bg-white px-4 py-5 text-[13px] text-[#6b7280]">
              Loading notifications...
            </div>
          ) : null}

          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
              New - {newItems.length} unread
            </p>
            <div className="mt-2 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
              {newItems.length > 0 ? (
                newItems.map((item) => {
                  const { icon: Icon, className } = getIconConfig(item);
                  return (
                    <article
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b border-[#eceef2] px-4 py-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] text-[#374151]">
                            <span className="font-semibold text-[#20242b]">{item.title}</span> - {item.message}
                          </p>
                          <p className="mt-1 text-[12px] text-[#6b7280]">{formatTimeLabel(item.time_label)}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <ActionButton action={item.action} href={item.href} />
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="px-4 py-5 text-[13px] text-[#6b7280]">No new notifications.</div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">Earlier</p>
            <div className="mt-2 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
              {earlierItems.length > 0 ? (
                earlierItems.map((item) => {
                  const { icon: Icon, className } = getIconConfig(item);
                  return (
                    <article
                      key={item.id}
                      className="flex items-center justify-between gap-3 border-b border-[#eceef2] px-4 py-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] text-[#374151]">
                            <span className="font-semibold text-[#20242b]">{item.title}</span> - {item.message}
                          </p>
                          <p className="mt-1 text-[12px] text-[#6b7280]">{formatTimeLabel(item.time_label)}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <ActionButton action={item.action} href={item.href} />
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="px-4 py-5 text-[13px] text-[#6b7280]">No earlier notifications.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
