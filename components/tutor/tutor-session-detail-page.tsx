"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiDollarSign,
  FiMessageSquare,
  FiPhone,
  FiVideo,
  FiStar,
} from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";
import { TUTOR_SCHEDULE_ROUTE } from "@/lib/routes";
import { useSessionChat } from "@/lib/realtime/session-chat";
import type { TutorScheduleItem } from "@/lib/tutor/schedule-data";

function MessageBubble({
  sender,
  avatarUrl,
  initials,
  message,
  timestamp,
  attachmentName,
  attachmentType,
  attachmentSize,
}: {
  sender: "tutor" | "student" | "admin";
  avatarUrl?: string;
  initials: string;
  message: string;
  timestamp: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: number;
}) {
  const isTutor = sender === "tutor";
  const isAdmin = sender === "admin";
  const hasAttachment = Boolean(attachmentName);

  return (
    <div className={`flex ${isTutor ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[78%] gap-3 ${isTutor ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
            isTutor
              ? "bg-[#ffe7eb] text-[#d61c3f]"
              : isAdmin
                ? "bg-[#fff1f4] text-[#d61c3f]"
                : "bg-[#eef0f3] text-[#6b7280]"
          }`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className={`flex flex-col ${isTutor ? "items-end" : "items-start"}`}>
          <div
              className={`rounded-[18px] px-4 py-3 text-[14px] leading-6 ${
              isTutor
                ? "bg-[#d61c3f] text-white"
                : isAdmin
                  ? "border border-[#f2cad3] bg-[#fff1f4] text-[#b91c1c]"
                  : "bg-white text-[#4b5563]"
            }`}
          >
            <div className="whitespace-pre-wrap">{message}</div>
            {hasAttachment ? (
              <div
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${
                  isTutor
                    ? "bg-white/15 text-white"
                    : isAdmin
                      ? "bg-[#ffe2e8] text-[#b91c1c]"
                      : "bg-[#eef0f3] text-[#4b5563]"
                }`}
              >
                <span>{attachmentType?.startsWith("image/") ? "Image" : "Attachment"}</span>
                <span className="max-w-[180px] truncate">{attachmentName}</span>
                {typeof attachmentSize === "number" && attachmentSize > 0 ? (
                  <span>({Math.max(1, Math.round(attachmentSize / 1024))} KB)</span>
                ) : null}
              </div>
            ) : null}
          </div>
          <span className="mt-2 text-[12px] text-[#9ca3af]">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}

function initialsFromName(name: string, fallback: string) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return fallback;
}

function profileInitialsFromName(firstName: string, lastName: string, fallback: string) {
  const first = String(firstName || "").trim();
  const last = String(lastName || "").trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  return fallback;
}

function resolveProfileAvatarUrl(profile: {
  avatar_url?: string;
  avatarUrl?: string;
  profile_image_url?: string;
  profileImageUrl?: string;
  image_url?: string;
  imageUrl?: string;
  photo_url?: string;
  photoUrl?: string;
}) {
  return (
    profile.avatarUrl ||
    profile.avatar_url ||
    profile.profileImageUrl ||
    profile.profile_image_url ||
    profile.imageUrl ||
    profile.image_url ||
    profile.photoUrl ||
    profile.photo_url ||
    ""
  ).trim();
}

export function TutorSessionDetailPage({ session }: { session: TutorScheduleItem }) {
  const [currentSession, setCurrentSession] = useState(session);
  const [tutorInitials, setTutorInitials] = useState("TU");
  const [tutorAvatarUrl, setTutorAvatarUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingCompletion, setIsUpdatingCompletion] = useState(false);
  const [completionRequestError, setCompletionRequestError] = useState("");
  const messagesPaneRef = useRef<HTMLDivElement | null>(null);
  const studentInitials = currentSession.studentInitials || initialsFromName(currentSession.studentName, "ST");
  const { messages, draft, setDraft, sendMessage, connected, loading, error, clearError } =
    useSessionChat({
      bookingId: currentSession.id,
      initialMessages: currentSession.chat,
      senderRole: "tutor",
      senderInitials: tutorInitials,
      senderAvatarUrl: tutorAvatarUrl || undefined,
      counterpartInitials: studentInitials,
      counterpartAvatarUrl: undefined,
    });

  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  useEffect(() => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    pane.scrollTop = pane.scrollHeight;
  }, [messages]);

  useEffect(() => {
    async function loadProfileInitials() {
      const baseUrl = resolveBrowserApiBaseUrl();
      if (!baseUrl) return;

      try {
        const profile = await browserApiRequest<{
          first_name: string;
          last_name: string;
          initials: string;
          avatar_url?: string;
          avatarUrl?: string;
          profile_image_url?: string;
          profileImageUrl?: string;
          image_url?: string;
          imageUrl?: string;
          photo_url?: string;
          photoUrl?: string;
        }>({
          url: `${baseUrl}/tutor/profile`,
          method: "GET",
        });

        setTutorInitials(profile.initials || profileInitialsFromName(profile.first_name, profile.last_name, "TU"));
        setTutorAvatarUrl(resolveProfileAvatarUrl(profile));
      } catch {
        setTutorInitials("TU");
        setTutorAvatarUrl("");
      }
    }

    loadProfileInitials();
  }, []);

  function handleSendMessage() {
    const text = draft.trim();
    if (!text) return;

    setIsSending(true);
    const sent = sendMessage(text);
    if (sent) {
      setDraft("");
      clearError();
    }
    setIsSending(false);
  }

  async function handleRequestCompletion() {
    if (currentSession.status !== "Upcoming") {
      return;
    }

    const baseUrl = resolveBrowserApiBaseUrl();
    if (!baseUrl) {
      setCompletionRequestError("API base URL is not configured.");
      return;
    }

    setCompletionRequestError("");
    setIsUpdatingCompletion(true);

    try {
      const updated = await browserApiRequest<TutorScheduleItem>({
        url: `${baseUrl}/tutor/schedule/${encodeURIComponent(currentSession.id)}/completion-request`,
        method: "PATCH",
      });
      setCurrentSession(updated);
    } catch (err) {
      setCompletionRequestError(err instanceof Error ? err.message : "Failed to request session completion.");
    } finally {
      setIsUpdatingCompletion(false);
    }
  }

  const canRequestCompletion = currentSession.status === "Upcoming";
  const completionRequested = currentSession.status === "Completion Requested";
  const completed = currentSession.status === "Completed";
  const hasRating = typeof currentSession.studentRatingScore === "number" && currentSession.studentRatingScore > 0;
  const ratingDisplay = hasRating ? currentSession.studentRatingScore!.toFixed(1).replace(/\.0$/, "") : "";

  return (
    <TutorShell>
      <div className="w-full">
        <div className="grid gap-0 rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="border-b border-[#eceef2] p-4 xl:border-r xl:border-b-0">
            <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
              <Link href={TUTOR_SCHEDULE_ROUTE} className="hover:text-[#20242b]">
                &#8592; Back to schedule
              </Link>
              <span className="font-semibold text-[#20242b]">Session Detail</span>
            </div>

            <div className="mt-8 flex items-start gap-4 border-b border-[#eceef2] pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe7eb] text-[16px] font-bold text-[#d61c3f]">
                {currentSession.studentInitials}
              </div>
              <div>
                <h1 className="text-[18px] font-bold text-[#20242b]">{currentSession.studentName}</h1>
                <p className="text-[14px] text-[#6b7280]">
                  {currentSession.grade} Grade - {currentSession.subject}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-[#fff6de] px-2.5 py-1 text-[11px] font-medium text-[#b58112]">
                  {currentSession.status}
                </span>
              </div>
            </div>

            <div className="space-y-5 py-5 text-[14px] text-[#4b5563]">
              <div className="flex items-start gap-3">
                <FiCalendar className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Date</p>
                  <p className="font-semibold text-[#20242b]">{currentSession.fullDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Time</p>
                  <p className="font-semibold text-[#20242b]">
                    {currentSession.time} - {currentSession.endTime} ({currentSession.duration})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiVideo className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Session Type</p>
                  <p className="font-semibold text-[#20242b]">{currentSession.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiDollarSign className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Rate</p>
                  <p className="font-semibold text-[#20242b]">{currentSession.rate} - paid by student after session</p>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] bg-[#fafafb] p-4">
              <p className="text-[14px] font-semibold text-[#20242b]">Virtual Session Link</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 rounded-full border border-[#e5e7eb] bg-white px-4 py-2.5 text-[13px] text-[#6b7280]">
                  {currentSession.sessionLink || "Google Meet is not configured yet."}
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!currentSession.sessionLink}
                >
                  <FiCopy className="mr-2 h-4 w-4" />
                  Copy
                </button>
              </div>
            </div>

            {hasRating ? (
              <div className="mt-4 rounded-[14px] border border-[#f1d7db] bg-[#fff8f9] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#b4233b]">Student Rating</p>
                    <h3 className="mt-1 text-[16px] font-bold text-[#20242b]">{currentSession.studentName}</h3>
                    <p className="mt-1 text-[13px] text-[#6b7280]">{currentSession.subject} - {currentSession.type}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#fff1f4] px-3 py-1 text-[13px] font-semibold text-[#d61c3f]">
                    <FiStar className="h-4 w-4 fill-current" />
                    <span>{ratingDisplay}</span>
                  </div>
                </div>

                {currentSession.studentRatingComment ? (
                  <div className="mt-4 rounded-[12px] border border-[#f5d9df] bg-white p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#6b7280]">Comment</p>
                    <p className="mt-2 whitespace-pre-wrap text-[14px] leading-6 text-[#374151]">
                      {currentSession.studentRatingComment}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-[13px] text-[#6b7280]">No comment was left with this rating.</p>
                )}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleRequestCompletion}
              disabled={!canRequestCompletion || isUpdatingCompletion || completed}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d61c3f] px-4 text-[14px] font-semibold text-[#d61c3f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiCheckCircle className="h-4 w-4" />
              <span>
                {completed ? "Session Completed" : completionRequested ? "Completion Requested" : "Request Session Completion"}
              </span>
            </button>

            <button
              type="button"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#e5e7eb] px-4 text-[14px] font-semibold text-[#6b7280]"
            >
              <FiMessageSquare className="h-4 w-4" />
              <span>Chat with Student</span>
            </button>

            <button
              type="button"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#e5e7eb] px-4 text-[14px] font-semibold text-[#6b7280]"
            >
              <FiPhone className="h-4 w-4" />
              <span>Notify Admin</span>
            </button>

            {!completed ? (
              <button
                type="button"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white"
                disabled
              >
                Cancel Session
              </button>
            ) : null}
            {completionRequestError ? (
              <p className="mt-2 text-[12px] text-[#d61c3f]">{completionRequestError}</p>
            ) : null}
          </aside>

          <section className="min-w-0">
            <div className="flex items-center gap-3 border-b border-[#eceef2] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d61c3f]">
                {currentSession.studentInitials}
              </div>
              <div>
                <p className="font-semibold text-[#20242b]">{currentSession.studentName}</p>
                <div className="flex items-center gap-1.5 text-[12px] text-[#1b8a5a]">
                  <span className="h-2 w-2 rounded-full bg-[#1b8a5a]" />
                  <span>{connected ? "Online" : "Connecting..."}</span>
                </div>
              </div>
            </div>

            <div ref={messagesPaneRef} className="max-h-[calc(100vh-340px)] overflow-y-auto bg-[#fcfcfd]">
              <div className="px-4 py-3 text-center">
                <span className="inline-flex rounded-full bg-[#eef0f3] px-3 py-1 text-[12px] text-[#6b7280]">
                  Session created - {currentSession.fullDate}
                </span>
              </div>

              <div className="space-y-5 px-4 py-4">
                {loading ? (
                  <div className="rounded-[18px] bg-white px-4 py-3 text-[14px] text-[#6b7280]">
                    Loading chat...
                  </div>
                ) : null}
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    sender={message.sender}
                    avatarUrl={message.avatarUrl}
                    initials={
                      message.senderInitials ||
                      (message.sender === "tutor"
                        ? tutorInitials
                        : message.sender === "admin"
                          ? "AD"
                          : studentInitials)
                    }
                    message={message.message}
                    timestamp={message.timestamp}
                    attachmentName={message.attachmentName}
                    attachmentType={message.attachmentType}
                    attachmentSize={message.attachmentSize}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-[#eceef2] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f4f4f5]"
                  aria-label="Attach"
                >
                  +
                </button>
                <input
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (error) clearError();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] text-[#374151] outline-none placeholder:text-[#9ca3af]"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!draft.trim() || !connected || isSending}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
              {error ? <p className="mt-2 text-[12px] text-[#d61c3f]">{error}</p> : null}
            </div>
          </section>
        </div>
      </div>
    </TutorShell>
  );
}
