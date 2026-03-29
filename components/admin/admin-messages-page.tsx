"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiPaperclip } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { adminConversations } from "@/lib/admin/messages-data";
import { ADMIN_MESSAGES_ROUTE } from "@/lib/routes";

type MessageTab = "All" | "Unread" | "Flagged";

export function AdminMessagesPage({ selectedConversationId }: { selectedConversationId?: string }) {
  const [tab, setTab] = useState<MessageTab>("All");
  const [draft, setDraft] = useState("");
  const [outgoingByConversation, setOutgoingByConversation] = useState<
    Record<
      string,
      Array<{
        id: string;
        senderRole: "admin";
        senderName: string;
        senderInitials: string;
        text: string;
        time: string;
      }>
    >
  >({});

  const filteredConversations = useMemo(() => {
    if (tab === "Unread") {
      return adminConversations.filter((item) => item.unreadCount > 0);
    }

    if (tab === "Flagged") {
      return adminConversations.filter((item) => item.flagged);
    }

    return adminConversations;
  }, [tab]);

  const selectedConversation =
    filteredConversations.find((item) => item.id === selectedConversationId) ??
    adminConversations.find((item) => item.id === selectedConversationId) ??
    filteredConversations[0] ??
    adminConversations[0];

  const unreadCount = adminConversations.reduce((sum, item) => sum + item.unreadCount, 0);

  const mergedMessages = selectedConversation
    ? [
        ...selectedConversation.messages,
        ...(outgoingByConversation[selectedConversation.id] ?? []),
      ]
    : [];

  const handleSend = () => {
    const text = draft.trim();
    if (!selectedConversation || text.length === 0) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    setOutgoingByConversation((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] ?? []),
        {
          id: `out-${Date.now()}`,
          senderRole: "admin",
          senderName: "Admin User",
          senderInitials: "AD",
          text,
          time,
        },
      ],
    }));
    setDraft("");
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
          <div className="grid min-h-[720px] xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="border-r border-[#eceef2]">
              <div className="border-b border-[#eceef2] p-4">
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
                {filteredConversations.map((conversation) => {
                  const active = selectedConversation?.id === conversation.id;
                  return (
                    <Link
                      key={conversation.id}
                      href={`${ADMIN_MESSAGES_ROUTE}/${conversation.id}`}
                      className={`flex gap-3 px-4 py-3 transition ${
                        active
                          ? "border-l-2 border-[#d94a62] bg-[#fff7f9]"
                          : "border-l-2 border-transparent hover:bg-[#fafafb]"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${conversation.initialsClassName}`}
                      >
                        {conversation.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-[15px] font-semibold text-[#20242b]">{conversation.title}</p>
                          <p className="shrink-0 text-[12px] text-[#6b7280]">{conversation.timeLabel}</p>
                        </div>
                        <p className="truncate text-[13px] text-[#6b7280]">{conversation.preview}</p>
                      </div>
                      {conversation.unreadCount > 0 ? (
                        <span className="mt-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d61c3f] px-1 text-[10px] text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </aside>

            <section className="flex min-h-[720px] flex-col bg-[#fbfbfc]">
              {selectedConversation ? (
                <>
                  <header className="border-b border-[#eceef2] bg-white px-4 py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[16px] font-bold text-[#20242b]">{selectedConversation.title}</p>
                        <p className="text-[13px] text-[#6b7280]">{selectedConversation.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 items-center rounded-lg border border-[#f0d58a] bg-[#fff6de] px-3 text-[12px] font-semibold text-[#8f6b10]"
                        >
                          Flag
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 items-center rounded-lg border border-[#e5e7eb] bg-white px-3 text-[12px] font-semibold text-[#4b5563]"
                        >
                          View Session
                        </button>
                      </div>
                    </div>
                  </header>

                  <div className="flex-1 px-4 py-4">
                    <p className="text-center text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">
                      Today, March 20, 2026
                    </p>

                    <div className="mt-4 space-y-5">
                      {mergedMessages.map((message) => {
                        const isOutgoing = message.senderRole === "student" || message.senderRole === "admin";
                        return (
                          <div key={message.id} className={isOutgoing ? "flex justify-end" : "flex justify-start"}>
                            {!isOutgoing ? (
                              <div className="flex max-w-[760px] gap-2.5">
                                <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                                  {message.senderInitials}
                                </span>
                                <div>
                                  <p className="text-[13px] font-semibold text-[#20242b]">
                                    {message.senderName}
                                    <span className="ml-1 text-[12px] font-normal text-[#6b7280]">{message.time}</span>
                                  </p>
                                  <p className="mt-1 text-[16px] leading-7 text-[#374151]">{message.text}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="max-w-[760px]">
                                <p className="mb-1 text-right text-[12px] text-[#6b7280]">
                                  {message.time} <span className="font-semibold text-[#374151]">{message.senderName}</span>{" "}
                                  <span className="font-semibold text-[#374151]">{message.senderInitials}</span>
                                </p>
                                <div className="rounded-2xl bg-[#d61c3f] px-4 py-2.5 text-[16px] font-medium text-white">
                                  {message.text}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <footer className="mt-auto border-t border-[#eceef2] bg-white px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f7f7f8]"
                        aria-label="Attach file"
                      >
                        <FiPaperclip className="h-4 w-4" />
                      </button>
                      <input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSend();
                          }
                        }}
                        type="text"
                        placeholder="Type a message..."
                        className="h-9 flex-1 rounded-full border border-[#e5e7eb] bg-[#f7f7f8] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                      />
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={draft.trim().length === 0}
                        className="inline-flex h-8 items-center rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
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
      </div>
    </AdminShell>
  );
}
