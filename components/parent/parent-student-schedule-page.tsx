import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import { parentSessionHistoryItems } from "@/lib/parent/schedule-data";
import type { ParentStudentRecord } from "@/lib/parent/students-data";
import { PARENT_SCHEDULE_ROUTE, PARENT_STUDENTS_ROUTE } from "@/lib/routes";

export function ParentStudentSchedulePage({
  student,
}: {
  student: ParentStudentRecord;
}) {
  const sessions = parentSessionHistoryItems.filter((session) =>
    session.studentFullName === student.name,
  );

  return (
    <ParentShell>
      <div className="w-full">
        <div className="flex items-center gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <Link
            href={PARENT_STUDENTS_ROUTE}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6b7280]"
          >
            <FiChevronLeft className="h-4 w-4" />
            Back to Students
          </Link>
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">{student.name}&apos;s Schedule</h1>
        </div>

        <div className="bg-white px-4 py-5 sm:px-5 lg:px-6">
          <div className="mb-4 rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Student</p>
            <p className="mt-2 text-[18px] font-bold text-[#20242b]">{student.name}</p>
            <p className="mt-1 text-[14px] text-[#6b7280]">
              {student.grade} · {student.school}
            </p>
          </div>

          <section className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="hidden grid-cols-[1fr_0.95fr_0.8fr_1fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
              <span>Tutor</span>
              <span>Date</span>
              <span>Time</span>
              <span>Subject</span>
              <span>Duration</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-4 px-4 py-4 md:grid-cols-[1fr_0.95fr_0.8fr_1fr_0.8fr_0.8fr_0.7fr] md:items-center"
                >
                  <div className="text-[14px] font-medium text-[#374151]">{session.tutorFullName}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.date}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.time}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.subject}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.duration}</div>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        session.status === "Upcoming"
                          ? "bg-[#fff6de] text-[#b58112]"
                          : "bg-[#daf2e8] text-[#33976d]"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`${PARENT_SCHEDULE_ROUTE}/${session.id}`}
                      className="text-[14px] font-semibold text-[#d61c3f]"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
