"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import { parentMessageThreads } from "@/lib/parent/messages-data";
import { PARENT_SCHEDULE_ROUTE } from "@/lib/routes";

export function ParentMessagesPage() {
  const [threads, setThreads] = useState(parentMessageThreads);
  const [activeThreadId, setActiveThreadId] = useState(parentMessageThreads[0]?.id ?? "");

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [activeThreadId, threads],
  );

  const unreadCount = useMemo(
    () => threads.reduce((total, thread) => total + thread.unreadCount, 0),
    [threads],
  );

  function openThread(threadId: string) {
    setActiveThreadId(threadId);
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread,
      ),
    );
  }

  if (!activeThread) {
    return null;
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
                  placeholder="Search messages..."
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>

            <div>
              {threads.map((thread) => {
                const active = thread.id === activeThread.id;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => openThread(thread.id)}
                    className={`grid w-full grid-cols-[44px_minmax(0,1fr)_auto] gap-3 border-b border-[#eceef2] px-3 py-4 text-left transition ${
                      active ? "border-l-[3px] border-l-[#d61c3f] bg-[#fff0f3]" : "hover:bg-[#fafafb]"
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[15px] font-bold text-[#d94a62]">
                      {thread.tutorInitials}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16px] font-semibold text-[#20242b]">{thread.tutorName}</span>
                      <span className="block text-[13px] font-medium text-[#d94a62]">
                        {thread.studentName} - {thread.subject}
                      </span>
                      <span className="mt-1 block text-[13px] text-[#4b5563]">{thread.preview}</span>
                    </span>
                    <span className="justify-self-end text-right">
                      <span className="block text-[12px] font-medium text-[#6b7280]">{thread.timestampLabel}</span>
                      {thread.unreadCount > 0 ? (
                        <span className="mt-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d61c3f] px-1.5 text-[10px] font-semibold text-white">
                          {thread.unreadCount}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-[680px] flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] px-4 py-3 sm:px-5 lg:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[18px] font-bold text-[#d94a62]">
                  {activeThread.tutorInitials}
                </span>
                <div>
                  <p className="text-[16px] font-semibold text-[#20242b]">{activeThread.tutorName}</p>
                  <p className="text-[13px] text-[#6b7280]">
                    {activeThread.studentName} - {activeThread.subject} - {activeThread.dateLabel}
                  </p>
                </div>
              </div>

              <Link
                href={`${PARENT_SCHEDULE_ROUTE}/${activeThread.sessionId}`}
                className="inline-flex h-9 items-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
              >
                View Session
              </Link>
            </div>

            <div className="flex-1 bg-[#fbfbfc] px-4 py-4 sm:px-5 lg:px-6">
              <div className="mx-auto w-fit rounded-full bg-[#eef0f2] px-4 py-1 text-[12px] text-[#6b7280]">
                Session created - Monday, March 30
              </div>

              <div className="mt-6 space-y-6">
                {activeThread.messages.map((message, index) => (
                  <div key={`${message.time}-${index}`}>
                    <div className={message.sender === "tutor" ? "flex justify-end" : "flex justify-start"}>
                      <div
                        className={`max-w-[720px] rounded-[16px] px-5 py-4 text-[15px] leading-6 ${
                          message.sender === "tutor"
                            ? "bg-[#d61c3f] text-white"
                            : "bg-transparent text-[#20242b]"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-[12px] text-[#6b7280] ${
                        message.sender === "tutor" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.time} - {message.senderLabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#eceef2] px-4 py-3 text-center text-[13px] text-[#6b7280] sm:px-5 lg:px-6">
              You are viewing this conversation as a parent. Replies are sent by Jordan.
            </div>
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
