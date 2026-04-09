"use client";

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMessageSquare,
  FiStar,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

import { fetchTutorScheduleItemByIdClient } from "@/lib/api/tutor-schedule-browser-api";
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

function ActionButton({
  action,
  onClick,
}: {
  action: NotificationActionType;
  onClick?: () => void;
}) {
  if (action === "none") return null;

  const label = action === "review" ? "Review" : action === "investigate" ? "Investigate" : "View";
  const className =
    action === "review"
      ? "bg-[#d61c3f] text-white"
      : action === "investigate"
        ? "bg-[#9c7a1e] text-white"
        : "text-[#d61c3f]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-semibold ${className}`}
    >
      {label}
    </button>
  );
}

function formatTimeLabel(value: string) {
  return String(value || "").trim();
}

function RatingPreviewModal({
  open,
  loading,
  error,
  session,
  onClose,
}: {
  open: boolean;
  loading: boolean;
  error: string;
  session: Awaited<ReturnType<typeof fetchTutorScheduleItemByIdClient>>;
  onClose: () => void;
}) {
  if (!open) return null;

  const rating = session?.studentRatingScore ?? 0;
  const comment = String(session?.studentRatingComment || "").trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="relative w-full max-w-[640px] overflow-hidden rounded-[20px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        <div className="border-b border-[#eceef2] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#b4233b]">Session Rating</p>
              <h2 className="mt-1 text-[22px] font-bold text-[#20242b]">Student feedback</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] transition hover:text-[#20242b]"
              aria-label="Close rating preview"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5">
          {loading ? (
            <div className="rounded-[14px] border border-[#e7e7eb] bg-[#fafafb] px-4 py-6 text-[14px] text-[#6b7280]">
              Loading rating details...
            </div>
          ) : error ? (
            <div className="rounded-[14px] border border-[#f1c2c7] bg-[#fff4f6] px-4 py-3 text-[14px] text-[#b91c1c]">
              {error}
            </div>
          ) : session ? (
            <div className="space-y-4">
              <div className="rounded-[16px] border border-[#f1d7db] bg-[#fff8f9] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Student</p>
                    <h3 className="mt-1 text-[18px] font-bold text-[#20242b]">{session.studentName}</h3>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      {session.subject} - {session.type} - {session.fullDate}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#fff1f4] px-3 py-1 text-[13px] font-semibold text-[#d61c3f]">
                    <FiStar className="h-4 w-4 fill-current" />
                    <span>{rating.toFixed(1).replace(/\.0$/, "")}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] border border-[#e7e7eb] bg-white p-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Comment</p>
                {comment ? (
                  <p className="mt-3 whitespace-pre-wrap text-[14px] leading-6 text-[#374151]">{comment}</p>
                ) : (
                  <p className="mt-3 text-[14px] text-[#6b7280]">No comment was left with this rating.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function NotificationsCenterPage({
  role,
  Shell,
}: {
  role: NotificationRole;
  Shell: ShellComponent;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ratingBookingId = role === "tutor" ? String(searchParams.get("rating") || "").trim() : "";
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingSession, setRatingSession] = useState<Awaited<ReturnType<typeof fetchTutorScheduleItemByIdClient>>>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState("");

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

  useEffect(() => {
    let cancelled = false;
    const ratingNotificationId = ratingBookingId ? `tutor-rating-${ratingBookingId}` : "";

    async function loadRatingSession() {
      if (!ratingBookingId) {
        setRatingSession(null);
        setRatingLoading(false);
        setRatingError("");
        return;
      }

      setRatingLoading(true);
      setRatingError("");

      try {
        const session = await fetchTutorScheduleItemByIdClient(ratingBookingId);
        if (cancelled) return;
        if (!session || typeof session.studentRatingScore !== "number" || session.studentRatingScore <= 0) {
          setRatingSession(null);
          setRatingError("Rating details could not be loaded.");
          return;
        }
        setRatingSession(session);
        if (ratingNotificationId) {
          try {
            await markNotificationsRead(role, { notification_ids: [ratingNotificationId] });
            window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
          } catch {
            // Ignore read-state failures; the modal still opened successfully.
          }
        }
      } catch {
        if (!cancelled) {
          setRatingSession(null);
          setRatingError("Rating details could not be loaded.");
        }
      } finally {
        if (!cancelled) {
          setRatingLoading(false);
        }
      }
    }

    void loadRatingSession();

    return () => {
      cancelled = true;
    };
  }, [role, ratingBookingId]);

  const tabs = useMemo(() => {
    const categories = Array.from(new Set(items.map((item) => item.category)));
    return ["All", ...categories];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items;
    return items.filter((item) => item.category === activeTab);
  }, [activeTab, items]);

  const displayItems = filteredItems;
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

  const closeRatingModal = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("rating");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const openNotification = async (item: NotificationItem) => {
    if (item.unread) {
      try {
        await markNotificationsRead(role, { notification_ids: [item.id] });
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, unread: false, section: "earlier" } : entry,
          ),
        );
        window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
      } catch {
        // Continue navigating even if read state could not be persisted.
      }
    }

    if (item.href) {
      router.push(item.href);
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

          <div className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
            {displayItems.length > 0 ? (
              displayItems.map((item) => {
                const { icon: Icon, className } = getIconConfig(item);
                const unread = Boolean(item.unread);
                return (
                  <article
                    key={item.id}
                    role={item.href ? "button" : undefined}
                    tabIndex={item.href ? 0 : undefined}
                    onClick={() => {
                      if (item.href) {
                        void openNotification(item);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (!item.href) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        void openNotification(item);
                      }
                    }}
                    className={`relative flex items-center justify-between gap-3 border-b border-[#eceef2] px-4 py-3 last:border-b-0 ${
                      unread ? "bg-[#f3f4f6]" : "bg-white"
                    } ${item.href ? "cursor-pointer" : ""}`}
                  >
                    {unread ? <div className="absolute left-0 top-0 h-full w-1 bg-[#c8cdd5]" /> : null}
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
                      <ActionButton
                        action={item.action}
                        onClick={() => {
                          if (item.href) {
                            void openNotification(item);
                          }
                        }}
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="px-4 py-5 text-[13px] text-[#6b7280]">No notifications.</div>
            )}
          </div>
        </section>

        <RatingPreviewModal
          open={Boolean(ratingBookingId)}
          loading={ratingLoading}
          error={ratingError}
          session={ratingSession}
          onClose={closeRatingModal}
        />
      </div>
    </Shell>
  );
}
