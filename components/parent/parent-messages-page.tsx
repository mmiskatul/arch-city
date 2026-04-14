"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import { PARENT_SCHEDULE_ROUTE } from "@/lib/routes";
import {
  getParentMessageThread,
  getParentMessageThreads,
  markParentMessageThreadRead,
  type SessionMessage,
  type SessionMessageThreadSummary,
} from "@/lib/api/session-messages-api";

function parseTimestamp(value: string) {
  const parsed = new Date(String(value || "").trim());
  return Number.isNaN(parsed.getTime()) ? Number.NEGATIVE_INFINITY : parsed.getTime();
}

function formatTimestamp(value: string) {
  const parsed = new Date(String(value || "").trim());
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function sortThreads(threads: SessionMessageThreadSummary[]) {
  return [...threads].sort(
    (left, right) =>
      parseTimestamp(right.last_message_at || right.updated_at) - parseTimestamp(left.last_message_at || left.updated_at),
  );
}

function sortMessages(messages: SessionMessage[]) {
  return [...messages].sort((left, right) => parseTimestamp(left.timestamp) - parseTimestamp(right.timestamp));
}

export function ParentMessagesPage() {
  const [threads, setThreads] = useState<SessionMessageThreadSummary[]>([]);
  const [activeThreadId, setActiveThreadId] = useState("");
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [search, setSearch] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const messagesPaneRef = useRef<HTMLDivElement | null>(null);

  const filteredThreads = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sortThreads(threads);
    return sortThreads(
      threads.filter((thread) =>
        [
          thread.tutor_name,
          thread.student_name,
          thread.subject,
          thread.last_message,
          thread.session_date,
          thread.session_time,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [search, threads]);

  const activeThread = useMemo(() => {
    if (!filteredThreads.length && !threads.length) return undefined;
    const source = filteredThreads.length ? filteredThreads : sortThreads(threads);
    return source.find((thread) => thread.booking_id === activeThreadId) ?? source[0];
  }, [activeThreadId, filteredThreads, threads]);

  const unreadCount = useMemo(
    () => threads.reduce((total, thread) => total + Number(thread.unread_count_parent || 0), 0),
    [threads],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadThreads() {
      try {
        setLoadingThreads(true);
        setError("");
        const data = await getParentMessageThreads();
        if (cancelled) return;
        const nextThreads = sortThreads(data.items || []);
        setThreads(nextThreads);
        setActiveThreadId((current) => {
          if (current && nextThreads.some((thread) => thread.booking_id === current)) {
            return current;
          }
          return nextThreads[0]?.booking_id || "";
        });
      } catch (loadError) {
        if (!cancelled) {
          setThreads([]);
          setActiveThreadId("");
          setError(loadError instanceof Error ? loadError.message : "Unable to load parent messages.");
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

  useEffect(() => {
    if (!activeThread?.booking_id) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function loadThreadDetail() {
      try {
        setLoadingMessages(true);
        const [detail] = await Promise.all([
          getParentMessageThread(activeThread.booking_id),
          markParentMessageThreadRead(activeThread.booking_id).catch(() => null),
        ]);
        if (cancelled) return;
        setMessages(sortMessages(detail.messages || []));
        setThreads((current) =>
          current.map((thread) =>
            thread.booking_id === activeThread.booking_id
              ? { ...thread, unread_count_parent: 0 }
              : thread,
          ),
        );
      } catch (loadError) {
        if (!cancelled) {
          setMessages([]);
          setError(loadError instanceof Error ? loadError.message : "Unable to load message thread.");
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    }

    void loadThreadDetail();

    return () => {
      cancelled = true;
    };
  }, [activeThread?.booking_id]);

  useEffect(() => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    pane.scrollTop = pane.scrollHeight;
  }, [messages, activeThread?.booking_id]);

  function openThread(threadId: string) {
    setActiveThreadId(threadId);
  }

  return (
    <ParentShell messagesUnreadCountOverride={unreadCount}>
      <div className="w-full">
        <div className="border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Messages</h1>
        </div>

        <div className="grid bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="border-r border-[#eceef2]">
            <div className="border-b border-[#eceef2] px-3 py-2">
              <div className="h-8 rounded-lg border border-[#e5e7eb] bg-[#fafafa]" />
              <div className="relative mt-3">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search messages..."
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>

            <div>
              {loadingThreads ? (
                <div className="space-y-3 px-3 py-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={`parent-thread-skeleton-${index}`} className="animate-pulse rounded-xl border border-[#eef1f4] px-3 py-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#eef1f4]" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-4 w-32 rounded bg-[#eef1f4]" />
                          <div className="h-3 w-40 rounded bg-[#eef1f4]" />
                          <div className="h-3 w-24 rounded bg-[#eef1f4]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {!loadingThreads && filteredThreads.map((thread) => {
                const active = thread.booking_id === activeThread?.booking_id;
                return (
                  <button
                    key={thread.booking_id}
                    type="button"
                    onClick={() => openThread(thread.booking_id)}
                    className={`grid w-full grid-cols-[44px_minmax(0,1fr)_auto] gap-3 border-b border-[#eceef2] px-3 py-4 text-left transition ${
                      active ? "border-l-[3px] border-l-[#d61c3f] bg-[#fff0f3]" : "hover:bg-[#fafafb]"
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[15px] font-bold text-[#d94a62]">
                      {thread.tutor_initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16px] font-semibold text-[#20242b]">{thread.tutor_name}</span>
                      <span className="block text-[13px] font-medium text-[#d94a62]">
                        {thread.student_name} - {thread.subject}
                      </span>
                      <span className="mt-1 block text-[13px] text-[#4b5563]">{thread.last_message}</span>
                    </span>
                    <span className="justify-self-end text-right">
                      <span className="block text-[12px] font-medium text-[#6b7280]">
                        {formatTimestamp(thread.last_message_at || thread.updated_at)}
                      </span>
                      {thread.unread_count_parent > 0 ? (
                        <span className="mt-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d61c3f] px-1.5 text-[10px] font-semibold text-white">
                          {thread.unread_count_parent}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}

              {!loadingThreads && !error && filteredThreads.length === 0 ? (
                <div className="px-4 py-6 text-[14px] text-[#6b7280]">
                  No parent-booked session messages found.
                </div>
              ) : null}
            </div>
          </aside>

          <section className="flex min-h-[680px] flex-col">
            {activeThread ? (
              <>
                <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] px-4 py-3 sm:px-5 lg:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[18px] font-bold text-[#d94a62]">
                      {activeThread.tutor_initials}
                    </span>
                    <div>
                      <p className="text-[16px] font-semibold text-[#20242b]">{activeThread.tutor_name}</p>
                      <p className="text-[13px] text-[#6b7280]">
                        {activeThread.student_name} - {activeThread.subject} - {activeThread.session_date} - {activeThread.session_time}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`${PARENT_SCHEDULE_ROUTE}/${activeThread.booking_id}`}
                    className="inline-flex h-9 items-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                  >
                    View Session
                  </Link>
                </div>

                <div ref={messagesPaneRef} className="flex-1 overflow-y-auto bg-[#fbfbfc] px-4 py-4 sm:px-5 lg:px-6">
                  <div className="mx-auto w-fit rounded-full bg-[#eef0f2] px-4 py-1 text-[12px] text-[#6b7280]">
                    Parent-booked session thread
                  </div>

                  {loadingMessages ? (
                    <div className="mt-6 space-y-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={`parent-message-skeleton-${index}`} className="h-16 rounded-[18px] bg-[#eef1f4] animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 space-y-8">
                      {messages.map((message, index) => (
                        <div key={`${message.id}-${index}`}>
                          <div className={message.sender === "student" ? "flex justify-end" : "flex justify-start"}>
                            <div
                              className={`max-w-[78%] rounded-[20px] px-5 py-3 text-[14px] leading-7 ${
                                message.sender === "student"
                                  ? "bg-[#d61c3f] text-white shadow-[0_8px_24px_rgba(214,28,63,0.18)]"
                                  : "max-w-[620px] bg-transparent px-0 py-0 text-[#20242b]"
                              }`}
                            >
                              {message.message}
                            </div>
                          </div>
                          <p
                            className={`mt-2 text-[12px] text-[#6b7280] ${
                              message.sender === "student" ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTimestamp(message.timestamp)} - {message.sender_name || message.sender}
                          </p>
                        </div>
                      ))}
                      {!loadingMessages && messages.length === 0 ? (
                        <div className="rounded-[14px] border border-dashed border-[#d7dce3] bg-white px-5 py-8 text-center text-[14px] text-[#6b7280]">
                          No messages have been sent in this parent-booked session yet.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="border-t border-[#eceef2] px-4 py-3 text-center text-[13px] text-[#6b7280] sm:px-5 lg:px-6">
                  This is a read-only parent view. Only messages from sessions booked through the parent dashboard are shown here.
                </div>
              </>
            ) : (
              <div className="flex min-h-[680px] items-center justify-center px-6 text-center text-[14px] text-[#6b7280]">
                {error || "Select a parent-booked session to view its messages."}
              </div>
            )}
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
