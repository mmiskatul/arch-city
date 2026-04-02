"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiBell, FiPaperclip, FiSearch } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { useDashboardAuth } from "@/components/auth/dashboard-auth-context";
import { STUDENT_SCHEDULE_ROUTE } from "@/lib/routes";
import {
  getStudentMessageThread,
  getStudentMessageThreads,
  markStudentMessageThreadRead,
  type SessionMessage,
  type SessionMessageThreadSummary,
} from "@/lib/api/session-messages-api";
import { studentMessageThreads as studentMessageFallbackThreads } from "@/lib/student/messages-data";

function MessageBubble({
  sender,
  message,
  timestamp,
}: {
  sender: "tutor" | "student";
  message: string;
  timestamp: string;
}) {
  const isStudent = sender === "student";

  return (
    <div className={`flex ${isStudent ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] ${isStudent ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-[20px] px-5 py-3 text-[14px] leading-7 ${
            isStudent
              ? "bg-[#d61c3f] text-white shadow-[0_8px_24px_rgba(214,28,63,0.18)]"
              : "max-w-[620px] bg-transparent px-0 py-0 text-[#20242b]"
          }`}
        >
          {message}
        </div>
        <span className={`mt-2 text-[12px] text-[#6b7280] ${isStudent ? "text-right" : "text-left"}`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}

function formatSessionMeta(thread: SessionMessageThreadSummary) {
  const parts = [thread.subject, thread.session_date, thread.session_time].filter(Boolean);
  return parts.join(" · ");
}

export function StudentMessagesPage() {
  const { tokenPresent } = useDashboardAuth();
  const [threads, setThreads] = useState<SessionMessageThreadSummary[]>(
    studentMessageFallbackThreads.map((thread) => ({
      thread_id: thread.id,
      booking_id: thread.sessionId,
      student_email: "",
      student_name: "",
      student_initials: "",
      tutor_email: "",
      tutor_name: thread.tutorName,
      tutor_initials: thread.tutorInitials,
      subject: thread.subject,
      session_date: thread.sessionMeta.split(" · ")[1] ?? "",
      session_time: thread.sessionMeta.split(" · ")[2] ?? "",
      session_type: "",
      duration_minutes: 0,
      status: thread.statusLabel || "Upcoming",
      last_message: thread.preview,
      last_sender_role: "",
      last_message_at: "",
      updated_at: "",
      unread_count_student: thread.unreadCount,
      unread_count_tutor: 0,
    })),
  );
  const [activeThreadId, setActiveThreadId] = useState(studentMessageFallbackThreads[0]?.sessionId ?? "");
  const [activeMessages, setActiveMessages] = useState<SessionMessage[]>(
    studentMessageFallbackThreads[0]?.messages ?? [],
  );
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!tokenPresent) return;

    let cancelled = false;

    async function loadThreads() {
      try {
        const data = await getStudentMessageThreads();
        if (cancelled) return;

        const nextThreads = data.items;
        setThreads(nextThreads);
        setActiveThreadId((current) => current || nextThreads[0]?.booking_id || "");
      } catch {
        if (!cancelled) {
          setThreads(studentMessageFallbackThreads.map((thread) => ({
            thread_id: thread.id,
            booking_id: thread.sessionId,
            student_email: "",
            student_name: "",
            student_initials: "",
            tutor_email: "",
            tutor_name: thread.tutorName,
            tutor_initials: thread.tutorInitials,
            subject: thread.subject,
            session_date: thread.sessionMeta.split(" · ")[1] ?? "",
            session_time: thread.sessionMeta.split(" · ")[2] ?? "",
            session_type: "",
            duration_minutes: 0,
            status: thread.statusLabel || "Upcoming",
            last_message: thread.preview,
            last_sender_role: "",
            last_message_at: "",
            updated_at: "",
            unread_count_student: thread.unreadCount,
            unread_count_tutor: 0,
          })));
        }
      }
    }

    loadThreads();

    return () => {
      cancelled = true;
    };
  }, [tokenPresent]);

  useEffect(() => {
    if (!tokenPresent || !activeThreadId) return;

    let cancelled = false;

    async function loadThread() {
      setLoadingMessages(true);
      try {
        const detail = await getStudentMessageThread(activeThreadId);
        if (cancelled) return;

        setActiveMessages(detail.messages);
        await markStudentMessageThreadRead(activeThreadId);
        window.dispatchEvent(new Event("arch-messages-updated"));
        setThreads((current) =>
          current.map((thread) =>
            thread.booking_id === activeThreadId ? { ...thread, unread_count_student: 0 } : thread,
          ),
        );
      } catch {
        if (!cancelled) {
          setActiveMessages([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    }

    loadThread();

    return () => {
      cancelled = true;
    };
  }, [tokenPresent, activeThreadId]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.booking_id === activeThreadId) ?? threads[0],
    [activeThreadId, threads],
  );

  const unreadCount = useMemo(
    () => threads.reduce((total, thread) => total + thread.unread_count_student, 0),
    [threads],
  );

  const activeThreadLabel = activeThread
    ? formatSessionMeta(activeThread)
    : "No active thread";

  return (
    <StudentShell>
      <div className="w-full">
        <div className="flex items-center justify-between pb-5">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Messages</h1>
          <div className="flex items-center gap-3">
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

        <div className="grid min-h-[720px] border-y border-[#e7e7eb] bg-white xl:grid-cols-[360px_minmax(0,1fr)] xl:border">
          <aside className="border-b border-[#eceef2] xl:border-r xl:border-b-0">
            <div className="p-4">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {threads.map((thread) => {
                const active = thread.booking_id === activeThread?.booking_id;

                return (
                  <button
                    key={thread.booking_id}
                    type="button"
                    onClick={() => setActiveThreadId(thread.booking_id)}
                    className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left ${
                      active ? "border-[#d61c3f] bg-[#fff1f4]" : "border-transparent bg-white"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d61c3f]">
                      {thread.tutor_initials || "TU"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-[#20242b]">
                            {thread.tutor_name || "Tutor"}
                          </p>
                          <p className="truncate text-[13px] text-[#6b7280]">
                            {thread.subject}
                            {thread.status ? ` (${thread.status})` : ""}
                          </p>
                        </div>
                        <span className="shrink-0 text-[12px] font-medium text-[#d94a62]">
                          {thread.session_time || thread.session_date}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[13px] text-[#4b5563]">
                        {thread.last_message || "Session booked"}
                      </p>
                    </div>
                    {thread.unread_count_student > 0 ? (
                      <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d61c3f] px-1.5 text-[10px] font-semibold text-white">
                        {thread.unread_count_student}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </aside>

          {activeThread ? (
            <section className="min-w-0">
              <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d61c3f]">
                    {activeThread.tutor_initials || "TU"}
                  </div>
                  <div>
                    <p className="font-semibold text-[#20242b]">{activeThread.tutor_name || "Tutor"}</p>
                    <p className="text-[13px] text-[#6b7280]">{activeThreadLabel}</p>
                  </div>
                </div>

                <Link
                  href={`${STUDENT_SCHEDULE_ROUTE}/${activeThread.booking_id}`}
                  className="inline-flex rounded-full border border-[#d61c3f] px-4 py-2 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                >
                  View Session
                </Link>
              </div>

              <div className="bg-[#fcfcfd] px-4 py-3 text-center">
                <span className="inline-flex rounded-full bg-[#eef1f4] px-3 py-1 text-[12px] text-[#6b7280]">
                  Session created - Monday, March 30, 2026
                </span>
              </div>

              <div className="min-h-[520px] space-y-8 bg-[#fcfcfd] px-4 py-6">
                {loadingMessages ? (
                  <p className="text-[13px] text-[#6b7280]">Loading messages...</p>
                ) : null}
                {activeMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    sender={message.sender}
                    message={message.message}
                    timestamp={message.timestamp}
                  />
                ))}
              </div>

              <div className="border-t border-[#eceef2] bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f4f4f5]"
                    aria-label="Attach"
                  >
                    <FiPaperclip className="h-4 w-4" />
                  </button>
                  <div className="flex-1 rounded-full border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] text-[#9ca3af]">
                    Type a message...
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white"
                  >
                    Send
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <div className="sr-only">Unread message count: {unreadCount}</div>
      </div>
    </StudentShell>
  );
}
