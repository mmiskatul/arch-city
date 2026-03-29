import Link from "next/link";

import { ParentShell } from "@/components/parent/parent-shell";
import { parentStudentsData } from "@/lib/parent/students-data";
import { PARENT_SCHEDULE_ROUTE } from "@/lib/routes";

export function ParentStudentsPage() {
  return (
    <ParentShell>
      <div className="w-full">
        <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Students</h1>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
          >
            + Add Student
          </button>
        </div>

        <div className="bg-white px-4 py-5 sm:px-5 lg:px-6">
          <section className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="hidden grid-cols-[1.65fr_0.9fr_1.35fr_1.65fr_1fr_0.7fr_1fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
              <span>Name</span>
              <span>Grade</span>
              <span>School</span>
              <span>Focus Areas</span>
              <span>Active Tutor</span>
              <span>Sessions</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {parentStudentsData.map((student) => (
                <div
                  key={student.id}
                  className="grid gap-4 px-4 py-3.5 md:grid-cols-[1.65fr_0.9fr_1.35fr_1.65fr_1fr_0.7fr_1fr] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d94a62]">
                      {student.initials}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold leading-5 text-[#20242b]">{student.name}</p>
                      <p className="text-[12px] leading-5 text-[#6b7280]">{student.addedLabel}</p>
                    </div>
                  </div>

                  <div className="text-[15px] text-[#4b5563]">{student.grade}</div>
                  <div className="text-[15px] text-[#4b5563]">{student.school}</div>

                  <div className="flex flex-wrap gap-2">
                    {student.focusAreas.map((focus, index) => (
                      <span
                        key={focus}
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          index === 0
                            ? "bg-[#ffecef] text-[#d94a62]"
                            : "bg-[#f0f1f3] text-[#6b7280]"
                        }`}
                      >
                        {focus}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[15px] text-[#4b5563]">
                    <span className="text-[10px] font-bold text-[#d94a62]">{student.activeTutorInitials}</span>
                    <span>{student.activeTutorName}</span>
                  </div>

                  <div className="text-[15px] font-semibold text-[#4b5563]">
                    {student.sessionsTotal} <span className="text-[12px] font-medium text-[#6b7280]">total</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      href={PARENT_SCHEDULE_ROUTE}
                      className="inline-flex h-8 items-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                    >
                      Schedule
                    </Link>
                    <button
                      type="button"
                      className="inline-flex h-8 items-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                    >
                      Edit
                    </button>
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
