"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiPaperclip, FiSend } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { ADMIN_SCHEDULES_ROUTE } from "@/lib/routes";
import {
  getAdminMessageThread,
  getAdminMessageThreads,
  sendAdminMessage,
  type AdminMessage,
  type AdminMessageThreadSummary,
} from "@/lib/api/admin-messages-api";

type MessageTab = "All" | "Unread" | "Flagged";

function parseTimestamp(value: string) {
  const raw = String(value || "").trim();
  if (!raw) return Number.NEGATIVE_INFINITY;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return Number.NEGATIVE_INFINITY;

  return parsed.getTime();
}

function sortMessages(messages: AdminMessage[]) {
  return [...messages].sort((left, right) => parseTimestamp(left.timestamp) - parseTimestamp(right.timestamp));
}

function formatSessionMeta(thread: AdminMessageThreadSummary) {
  const parts = [thread.subject, thread.session_date, thread.session_time].filter(Boolean);
  return parts.join(" · ");
}

function formatThreadTime(thread: AdminMessageThreadSummary) {
  const value = thread.last_message_at;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return thread.session_time || thread.session_date || "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function formatMessageTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function MessageBubble({ message }: { message: AdminMessage }) {
  const sender = message.sender || "student";
  const isAdmin = sender === "admin";
  const isTutor = sender === "tutor";
  const isOutgoing = isAdmin;

  const bubbleClassName = isOutgoing
    ? "bg-[#d61c3f] text-white shadow-[0_8px_24px_rgba(214,28,63,0.18)]"
    : isTutor
      ? "border border-[#dce8ff] bg-[#eef4ff] text-[#1d4ed8]"
      : "border border-[#eceef2] bg-white text-[#20242b]";

  const badgeLabel = isAdmin ? "Admin" : isTutor ? "Tutor" : "Student";

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[78%] flex-col ${isOutgoing ? "items-end" : "items-start"}`}>
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
          {badgeLabel}
        </span>
        <div className={`rounded-[20px] px-5 py-3 text-[14px] leading-7 ${bubbleClassName}`}>
          <div className="whitespace-pre-wrap">{message.message}</div>
          {message.attachmentName ? (
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${
                isOutgoing ? "bg-white/15 text-white" : "bg-[#f3f4f6] text-[#4b5563]"
              }`}
            >
              <span>{message.attachmentType?.startsWith("image/") ? "Image" : "Attachment"}</span>
              <span className="max-w-[180px] truncate">{message.attachmentName}</span>
            </div>
          ) : null}
        </div>
        <span className="mt-2 text-[12px] text-[#6b7280]">{formatMessageTimestamp(message.timestamp)}</span>
      </div>
    </div>
  );
}

export function AdminMessagesPage({ selectedConversationId }: { selectedConversationId?: string }) {
  const [tab, setTab] = useState<MessageTab>("All");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState<AdminMessageThreadSummary[]>([]);
  const [activeThreadId, setActiveThreadId] = useState(selectedConversationId ?? "");
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesPaneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveThreadId(selectedConversationId ?? "");
  }, [selectedConversationId]);

  useEffect(() => {
    let cancelled = false;

    async function loadThreads() {
      setLoadingThreads(true);
      try {
        const payload = await getAdminMessageThreads();
        if (cancelled) return;

        const nextThreads = [...payload.items].sort(
          (left, right) =>
            parseTimestamp(right.last_message_at || right.updated_at) -
            parseTimestamp(left.last_message_at || left.updated_at),
        );
        setThreads(nextThreads);
        setActiveThreadId((current) => {
          if (current && nextThreads.some((thread) => thread.booking_id === current)) {
            return current;
          }
          return nextThreads[0]?.booking_id || "";
        });
      } catch {
        if (!cancelled) {
          setThreads([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingThreads(false);
        }
      }
    }

    void loadThreads();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredThreads = useMemo(() => {
    if (tab === "Unread") {
      return threads.filter((thread) => (thread.unread_count_admin || 0) > 0);
    }

    if (tab === "Flagged") {
      return threads.filter((thread) => thread.status === "Cancelled" || thread.status === "Completion Requested");
    }

    return threads;
  }, [tab, threads]);

  const activeThread =
    filteredThreads.find((thread) => thread.booking_id === activeThreadId) ??
    threads.find((thread) => thread.booking_id === activeThreadId) ??
    filteredThreads[0] ??
    threads[0];

  useEffect(() => {
    if (!activeThread?.booking_id) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function loadThread() {
      setLoadingMessages(true);
      try {
        const payload = await getAdminMessageThread(activeThread.booking_id);
        if (cancelled) return;

        setMessages(sortMessages(payload.messages));
        setThreads((current) =>
          current.map((thread) =>
            thread.booking_id === activeThread.booking_id ? { ...thread, unread_count_admin: 0 } : thread,
          ),
        );
        window.dispatchEvent(new Event("arch-messages-updated"));
      } catch {
        if (!cancelled) {
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    }

    void loadThread();

    return () => {
      cancelled = true;
    };
  }, [activeThread?.booking_id]);

  useEffect(() => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    pane.scrollTop = pane.scrollHeight;
  }, [activeThreadId, messages]);

  const unreadCount = threads.reduce((sum, thread) => sum + ((thread.unread_count_admin || 0) > 0 ? 1 : 0), 0);

  const handleSend = async () => {
    const text = draft.trim();
    if (!activeThread?.booking_id || !text || sending) return;

    setSending(true);
    setError("");
    const previousMessages = messages;
    const previousThreads = threads;

    const optimisticMessage: AdminMessage = {
      id: `draft-${crypto.randomUUID()}`,
      sender: "admin",
      message: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticMessage]);
    setThreads((current) =>
      current.map((thread) =>
        thread.booking_id === activeThread.booking_id
          ? {
              ...thread,
              last_message: text,
              last_message_at: optimisticMessage.timestamp,
              last_sender_role: "admin",
              unread_count_admin: 0,
            }
          : thread,
      ),
    );
    setDraft("");

    try {
      const sent = await sendAdminMessage(activeThread.booking_id, { message: text });
      setMessages((current) =>
        current.map((message) =>
          message.id === optimisticMessage.id ? { ...sent, id: sent.id || optimisticMessage.id } : message,
        ),
      );
      setThreads((current) =>
        current.map((thread) =>
          thread.booking_id === activeThread.booking_id
            ? {
                ...thread,
                last_message: sent.message,
                last_message_at: sent.timestamp,
                last_sender_role: "admin",
                unread_count_admin: 0,
              }
            : thread,
        ),
      );
      try {
        const refreshed = await getAdminMessageThread(activeThread.booking_id);
        setMessages(sortMessages(refreshed.messages));
        window.dispatchEvent(new Event("arch-messages-updated"));
      } catch {
        // Keep the sent message in the UI if the post-send refresh fails.
      }
    } catch {
      setError("Unable to send message.");
      setMessages(previousMessages);
      setThreads(previousThreads);
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="grid xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="border-r border-[#eceef2] bg-white px-4 py-4">
            <div className="border-b border-[#eceef2] pb-4">
              <h1 className="text-[36px] font-bold leading-none text-[#20242b]">Messages</h1>

              <div className="mt-3 flex items-center gap-3 border-b border-[#eceef2]">
                {(["All", "Unread", "Flagged"] as const).map((item) => {
                  const active = tab === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTab(item)}
                      className={`inline-flex h-9 items-center gap-1 border-b-2 px-1 text-[14px] font-semibold transition ${
                        active
                          ? "border-[#d94a62] text-[#d61c3f]"
                          : "border-transparent text-[#6b7280] hover:text-[#374151]"
                      }`}
                    >
                      {item}
                      {item === "Unread" && unreadCount > 0 ? (
                        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d61c3f] px-1 text-[10px] text-white">
                          {unreadCount}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {loadingThreads ? (
                <div className="px-4 py-4 text-[14px] text-[#6b7280]">Loading conversations...</div>
              ) : null}

              {!loadingThreads && filteredThreads.length === 0 ? (
                <div className="px-4 py-8 text-[14px] text-[#6b7280]">No message threads found.</div>
              ) : null}

              {filteredThreads.map((thread) => {
                const active = activeThread?.booking_id === thread.booking_id;
                const unreadTotal = thread.unread_count_admin || 0;

                return (
                  <button
                    key={thread.booking_id}
                    type="button"
                    onClick={() => setActiveThreadId(thread.booking_id)}
                    className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition ${
                      active ? "border-[#d94a62] bg-[#fff7f9]" : "border-transparent hover:bg-[#fafafb]"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d61c3f]">
                      {thread.student_initials || thread.tutor_initials || "AD"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-[#20242b]">
                            {thread.student_name || "Student"} <span className="text-[#9ca3af]">↔</span>{" "}
                            {thread.tutor_name || "Tutor"}
                          </p>
                          <p className="truncate text-[13px] text-[#6b7280]">
                            {thread.subject || "Session conversation"}
                          </p>
                        </div>
                        <span className="shrink-0 text-[12px] font-medium text-[#d94a62]">
                          {formatThreadTime(thread)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[13px] text-[#4b5563]">{thread.last_message || "Session booked"}</p>
                    </div>
                    {unreadTotal > 0 ? (
                      <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d61c3f] px-1.5 text-[10px] font-semibold text-white">
                        {unreadTotal}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex flex-col bg-[#fbfbfc] px-4 py-4">
            {activeThread ? (
              <>
                <header className="border-b border-[#eceef2] bg-white px-4 py-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[16px] font-bold text-[#20242b]">
                        {activeThread.student_name || "Student"} <span className="text-[#9ca3af]">↔</span>{" "}
                        {activeThread.tutor_name || "Tutor"}
                      </p>
                      <p className="text-[13px] text-[#6b7280]">{formatSessionMeta(activeThread)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 items-center rounded-lg border border-[#f0d58a] bg-[#fff6de] px-3 text-[12px] font-semibold text-[#8f6b10]"
                      >
                        Flag
                      </button>
                      <Link
                        href={`${ADMIN_SCHEDULES_ROUTE}/${activeThread.booking_id}`}
                        className="inline-flex h-8 items-center rounded-lg border border-[#e5e7eb] bg-white px-3 text-[12px] font-semibold text-[#4b5563]"
                      >
                        View Session
                      </Link>
                    </div>
                  </div>
                </header>

                <div className="flex-1">
                  <p className="px-4 pt-4 text-center text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                    Today
                  </p>

                  <div
                    ref={messagesPaneRef}
                    className="mt-4 max-h-[calc(100vh-340px)] space-y-8 overflow-y-auto px-4 pr-1"
                  >
                    {loadingMessages && messages.length === 0 ? (
                      <p className="text-[13px] text-[#6b7280]">Loading chat...</p>
                    ) : null}

                    {error ? <p className="text-[13px] text-[#b91c1c]">{error}</p> : null}

                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                  </div>
                </div>

                <footer className="mt-auto border-t border-[#eceef2] bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f7f7f8]"
                      aria-label="Attach file"
                      title="Attachments are not enabled for admin replies yet"
                    >
                      <FiPaperclip className="h-4 w-4" />
                    </button>
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          void handleSend();
                        }
                      }}
                      type="text"
                      placeholder="Type a message..."
                      className="h-9 flex-1 rounded-full border border-[#e5e7eb] bg-[#f7f7f8] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                    />
                    <button
                      type="button"
                      onClick={() => void handleSend()}
                      disabled={sending || draft.trim().length === 0}
                      className="inline-flex h-8 items-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiSend className="h-3.5 w-3.5" />
                      Send
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-[14px] text-[#6b7280]">
                No conversations found.
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
