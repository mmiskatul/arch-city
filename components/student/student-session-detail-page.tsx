import Link from "next/link";
import {
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiMessageSquare,
  FiPhone,
  FiVideo,
} from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_SCHEDULE_ROUTE } from "@/lib/routes";
import type { StudentScheduleItem } from "@/lib/student/schedule-data";

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
          className={`rounded-[18px] px-4 py-3 text-[14px] leading-6 ${
            isStudent ? "bg-[#d61c3f] text-white" : "bg-white text-[#4b5563]"
          }`}
        >
          {message}
        </div>
        <span className="mt-2 text-[12px] text-[#9ca3af]">{timestamp}</span>
      </div>
    </div>
  );
}

export function StudentSessionDetailPage({ session }: { session: StudentScheduleItem }) {
  return (
    <StudentShell>
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="grid gap-0 rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="border-b border-[#eceef2] p-4 xl:border-r xl:border-b-0">
            <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
              <Link href={STUDENT_SCHEDULE_ROUTE} className="hover:text-[#20242b]">
                &#8592; Back to schedule
              </Link>
              <span className="font-semibold text-[#20242b]">Session Detail</span>
            </div>

            <div className="mt-8 flex items-start gap-4 border-b border-[#eceef2] pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe7eb] text-[16px] font-bold text-[#d61c3f]">
                {session.tutorInitials}
              </div>
              <div>
                <h1 className="text-[18px] font-bold text-[#20242b]">{session.tutorName}</h1>
                <p className="text-[14px] text-[#6b7280]">{session.subject}</p>
                <span className="mt-2 inline-flex rounded-full bg-[#fff6de] px-2.5 py-1 text-[11px] font-medium text-[#b58112]">
                  {session.status}
                </span>
              </div>
            </div>

            <div className="space-y-5 py-5 text-[14px] text-[#4b5563]">
              <div className="flex items-start gap-3">
                <FiCalendar className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Date</p>
                  <p className="font-semibold text-[#20242b]">{session.fullDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Time</p>
                  <p className="font-semibold text-[#20242b]">
                    {session.time} - {session.duration === "60 min" ? "5:00 PM" : "4:45 PM"} ({session.duration})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiVideo className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Session Type</p>
                  <p className="font-semibold text-[#20242b]">{session.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiDollarSign className="mt-0.5 h-4 w-4 text-[#6b7280]" />
                <div>
                  <p className="text-[12px] text-[#6b7280]">Session Rate</p>
                  <p className="font-semibold text-[#20242b]">${session.sessionRate} (paid to tutor after session)</p>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] bg-[#fafafb] p-4">
              <p className="text-[14px] font-semibold text-[#20242b]">Virtual Session Link</p>
              <Link
                href="#"
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white"
              >
                <FiVideo className="h-4 w-4" />
                <span>Join Session</span>
              </Link>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d61c3f] px-4 text-[14px] font-semibold text-[#d61c3f]"
            >
              <FiMessageSquare className="h-4 w-4" />
              <span>Chat with Tutor</span>
            </button>

            <button
              type="button"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#e5e7eb] px-4 text-[14px] font-semibold text-[#6b7280]"
            >
              <FiPhone className="h-4 w-4" />
              <span>Get Assistance from Arch City Tutors Management Team</span>
            </button>

            <button
              type="button"
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white"
            >
              Cancel Session
            </button>

            <div className="mt-3 rounded-[12px] border border-[#f2ddb0] bg-[#fff9ed] px-4 py-3 text-[12px] text-[#6b7280]">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#c58b13]" />
                <p>Full session rate required if cancelled within 12 hours.</p>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex items-center gap-3 border-b border-[#eceef2] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d61c3f]">
                {session.tutorInitials}
              </div>
              <div>
                <p className="font-semibold text-[#20242b]">{session.tutorName}</p>
                <div className="flex items-center gap-1.5 text-[12px] text-[#1b8a5a]">
                  <span className="h-2 w-2 rounded-full bg-[#1b8a5a]" />
                  <span>Online</span>
                </div>
              </div>
            </div>

            <div className="min-h-[640px] bg-[#fcfcfd]">
              <div className="space-y-5 px-4 py-5">
                {session.chat.map((message) => (
                  <MessageBubble
                    key={message.id}
                    sender={message.sender}
                    message={message.message}
                    timestamp={message.timestamp}
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
        </div>
      </div>
    </StudentShell>
  );
}
