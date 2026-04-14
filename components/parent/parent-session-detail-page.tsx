import Link from "next/link";
import { FiCalendar, FiChevronLeft, FiClock, FiDollarSign, FiMessageSquare, FiMonitor } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import type { ParentSessionHistoryItem } from "@/lib/api/parent-schedule-api";
import { PARENT_MESSAGES_ROUTE, PARENT_SCHEDULE_ROUTE } from "@/lib/routes";

export function ParentSessionDetailPage({
  session,
}: {
  session: ParentSessionHistoryItem;
}) {
  return (
    <ParentShell>
      <div className="w-full">
        <div className="flex items-center gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <Link
            href={PARENT_SCHEDULE_ROUTE}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6b7280]"
          >
            <FiChevronLeft className="h-4 w-4" />
            Back to Schedule
          </Link>
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Session Detail</h1>
        </div>

        <div className="grid bg-white lg:grid-cols-[336px_minmax(0,1fr)]">
          <aside className="border-r border-[#eceef2] px-4 py-4 sm:px-5 lg:px-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe7eb] text-[22px] font-bold text-[#d94a62]">
                {session.studentInitials}
              </span>
              <div>
                <h2 className="text-[18px] font-bold text-[#20242b]">{session.studentName}</h2>
                <p className="text-[14px] text-[#6b7280]">{session.studentGrade} - Your Student</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClassName(session.status)}`}>
                  {session.status}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-[#eceef2] pt-4">
              <div className="flex items-center justify-between rounded-[12px] bg-[#f9fafb] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe7eb] text-[15px] font-bold text-[#d94a62]">
                    {session.tutorInitials}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-[#20242b]">{session.tutorName}</p>
                    <p className="text-[13px] text-[#6b7280]">{session.subject} tutor</p>
                  </div>
                </div>
                <Link href={PARENT_MESSAGES_ROUTE} className="text-[13px] font-semibold text-[#d61c3f]">
                  Messages
                </Link>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-[14px] text-[#4b5563]">
              <div className="flex items-start gap-3">
                <FiCalendar className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[13px] text-[#6b7280]">Date</p>
                  <p className="font-medium text-[#20242b]">{session.fullDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[13px] text-[#6b7280]">Time</p>
                  <p className="font-medium text-[#20242b]">
                    {session.time} - {session.endTime} ({session.duration})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMonitor className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[13px] text-[#6b7280]">Type</p>
                  <p className="font-medium text-[#20242b]">{session.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiDollarSign className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[13px] text-[#6b7280]">Rate</p>
                  <p className="font-medium text-[#20242b]">{session.rate} - paid after session</p>
                </div>
              </div>
            </div>

            <Link
              href={PARENT_MESSAGES_ROUTE}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d61c3f] px-4 text-[15px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
            >
              <FiMessageSquare className="h-4 w-4" />
              Message Tutor
            </Link>

            <div className="mt-3 rounded-[14px] border border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[13px] leading-6 text-[#6b7280]">
              This page is read-only for parents. Any schedule changes should be handled through the student or tutor conversation.
            </div>
          </aside>

          <section className="flex min-h-[680px] flex-col">
            <div className="flex items-center justify-between border-b border-[#eceef2] px-4 py-3 sm:px-5 lg:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[18px] font-bold text-[#d94a62]">
                  {session.tutorInitials}
                </span>
                <div>
                  <p className="text-[16px] font-semibold text-[#20242b]">{session.tutorName}</p>
                  <p className="text-[13px] text-[#6b7280]">
                    {session.subject} - {session.date} - {session.time}
                  </p>
                </div>
              </div>
              <span className="inline-flex rounded-full bg-[#fff6de] px-3 py-1 text-[12px] font-medium text-[#b58112]">
                Viewing as parent
              </span>
            </div>

            <div className="flex-1 bg-[#fbfbfc] px-4 py-4 sm:px-5 lg:px-6">
              <div className="mx-auto w-fit rounded-full bg-[#eef0f2] px-4 py-1 text-[12px] text-[#6b7280]">
                Session created - {session.fullDate}
              </div>

              <div className="mt-6 space-y-6">
                {session.messages.map((message, index) => (
                  <div key={`${message.id}-${index}`}>
                    <div className={message.sender === "tutor" ? "flex justify-end" : "flex justify-start"}>
                      <div
                        className={`max-w-[720px] rounded-[16px] px-5 py-4 text-[15px] leading-6 ${
                          message.sender === "tutor"
                            ? "bg-[#d61c3f] text-white"
                            : "bg-transparent text-[#20242b]"
                        }`}
                      >
                        {message.message}
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-[12px] text-[#6b7280] ${
                        message.sender === "tutor" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timeLabel} - {message.senderLabel}
                    </p>
                  </div>
                ))}
                {session.messages.length === 0 ? (
                  <div className="rounded-[16px] border border-dashed border-[#d7dce3] bg-white px-5 py-8 text-center text-[14px] text-[#6b7280]">
                    No session messages yet.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-[#eceef2] px-4 py-3 text-center text-[13px] text-[#6b7280] sm:px-5 lg:px-6">
              This is a read-only view. Messages are between {session.studentName} and {session.tutorName.split(" ")[0]}.
            </div>
          </section>
        </div>
      </div>
    </ParentShell>
  );
}

function statusClassName(status: ParentSessionHistoryItem["status"]) {
  if (status === "Completed") {
    return "bg-[#daf2e8] text-[#33976d]";
  }
  if (status === "Cancelled" || status === "Expired") {
    return "bg-[#f3f4f6] text-[#6b7280]";
  }
  if (status === "Completion Requested") {
    return "bg-[#eef2ff] text-[#4f46e5]";
  }
  return "bg-[#fff6de] text-[#b58112]";
}
