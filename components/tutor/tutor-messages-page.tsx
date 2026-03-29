"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiPaperclip, FiSearch } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { TUTOR_SCHEDULE_ROUTE } from "@/lib/routes";
import { tutorMessageThreads } from "@/lib/tutor/messages-data";

function MessageBubble({
  sender,
  message,
  timestamp,
}: {
  sender: "tutor" | "student";
  message: string;
  timestamp: string;
}) {
  const isTutor = sender === "tutor";

  return (
    <div className={`flex ${isTutor ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[72%] ${isTutor ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-[18px] px-4 py-3 text-[14px] leading-6 ${
            isTutor ? "bg-[#d61c3f] text-white" : "bg-white text-[#4b5563]"
          }`}
        >
          {message}
        </div>
        <span className="mt-2 text-[12px] text-[#9ca3af]">{timestamp}</span>
      </div>
    </div>
  );
}

export function TutorMessagesPage() {
  const [threads, setThreads] = useState(tutorMessageThreads);
  const [activeThreadId, setActiveThreadId] = useState(tutorMessageThreads[0]?.id ?? "");
  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [activeThreadId, threads],
  );
  const unreadTotal = useMemo(
    () => threads.reduce((total, thread) => total + thread.unreadCount, 0),
    [threads],
  );

  function handleOpenThread(threadId: string) {
    setActiveThreadId(threadId);
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread,
      ),
    );
  }

  return (
    <TutorShell messagesUnreadCountOverride={unreadTotal}>
      <div className="w-full">
        <h1 className="pb-5 text-[18px] font-bold text-[#20242b] sm:text-[22px]">Messages</h1>

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
                const active = thread.id === activeThread?.id;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => handleOpenThread(thread.id)}
                    className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left ${
                      active ? "border-[#d61c3f] bg-[#fff1f4]" : "border-transparent bg-white"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d61c3f]">
                      {thread.studentInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-[#20242b]">{thread.studentName}</p>
                          <p className="truncate text-[13px] text-[#6b7280]">
                            {thread.subject} · {thread.dateLabel}
                          </p>
                        </div>
                        <span className="shrink-0 text-[12px] font-medium text-[#d94a62]">
                          {thread.timestampLabel}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[13px] text-[#4b5563]">{thread.preview}</p>
                    </div>
                    {thread.unreadCount > 0 ? (
                      <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d61c3f] px-1.5 text-[10px] font-semibold text-white">
                        {thread.unreadCount}
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
                    {activeThread.studentInitials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#20242b]">{activeThread.studentName}</p>
                    <p className="text-[13px] text-[#6b7280]">
                      {activeThread.subject} · {activeThread.dateLabel} · 4:00 PM
                    </p>
                  </div>
                </div>

                <Link
                  href={`${TUTOR_SCHEDULE_ROUTE}/${activeThread.sessionId}`}
                  className="inline-flex rounded-full border border-[#d61c3f] px-4 py-2 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                >
                  View Session
                </Link>
              </div>

              <div className="bg-[#fcfcfd] px-4 py-3 text-center">
                <span className="inline-flex rounded-full bg-[#eef1f4] px-3 py-1 text-[12px] text-[#6b7280]">
                  Session created — Monday, March 30
                </span>
              </div>

              <div className="min-h-[520px] space-y-5 bg-[#fcfcfd] px-4 py-5">
                {activeThread.messages.map((message) => (
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
      </div>
    </TutorShell>
  );
}
