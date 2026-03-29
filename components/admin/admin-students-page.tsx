"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { adminStudents, type AdminStudentStatus } from "@/lib/admin/students-data";
import { ADMIN_STUDENTS_ROUTE } from "@/lib/routes";

const pageSize = 7;
const gradeFilters = ["All Grades", ...Array.from(new Set(adminStudents.map((item) => item.grade)))];

function statusClassName(status: AdminStudentStatus) {
  if (status === "Active") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#fff6de] text-[#9c7a1e]";
}

export function AdminStudentsPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | AdminStudentStatus>("All");
  const [gradeFilter, setGradeFilter] = useState<string>("All Grades");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredStudents = useMemo(() => {
    return adminStudents.filter((item) => {
      const statusMatch = statusFilter === "All" ? true : item.status === statusFilter;
      const gradeMatch = gradeFilter === "All Grades" ? true : item.grade === gradeFilter;
      return statusMatch && gradeMatch;
    });
  }, [statusFilter, gradeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedStudents = filteredStudents.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIndex = filteredStudents.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, filteredStudents.length);

  const handleStatusFilter = (value: "All" | AdminStudentStatus) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleGradeFilter = (value: string) => {
    setGradeFilter(value);
    setCurrentPage(1);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div>
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Students</h1>
          <p className="mt-2 text-[14px] text-[#6b7280]">248 total students across all families</p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {(["All", "Active", "Inactive"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleStatusFilter(value)}
                className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold transition ${
                  statusFilter === value
                    ? "border border-[#e24961] bg-[#ffecef] text-[#d61c3f]"
                    : "border border-[#e5e7eb] bg-[#f7f7f8] text-[#6b7280] hover:bg-[#f1f2f4]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <select
            value={gradeFilter}
            onChange={(event) => handleGradeFilter(event.target.value)}
            className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-[13px] font-semibold text-[#4b5563] outline-none sm:w-[170px]"
          >
            {gradeFilters.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <section className="mt-4 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              <div className="grid grid-cols-[1.8fr_0.9fr_1.35fr_0.75fr_0.95fr_1fr_0.75fr_0.65fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Student</span>
                <span>Grade</span>
                <span>Parent / Guardian</span>
                <span>Sessions</span>
                <span>Last Session</span>
                <span>Subjects</span>
                <span>Status</span>
                <span> </span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {pagedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-[1.8fr_0.9fr_1.35fr_0.75fr_0.95fr_1fr_0.75fr_0.65fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${student.initialsClassName}`}
                      >
                        {student.initials}
                      </span>
                      <div>
                        <p className="font-semibold text-[#20242b]">{student.name}</p>
                        <p className="text-[12px] text-[#6b7280]">{student.email}</p>
                      </div>
                    </div>

                    <span>{student.grade}</span>
                    <span>{student.guardian}</span>
                    <span>{student.sessions}</span>
                    <span>{student.lastSession}</span>
                    <div className="flex flex-wrap gap-1">
                      {student.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex w-fit rounded-full border border-[#e5e7eb] bg-[#f7f7f8] px-2.5 py-1 text-[11px] font-medium text-[#6b7280]"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClassName(student.status)}`}>
                        {student.status}
                      </span>
                    </div>
                    <div>
                      <Link
                        href={`${ADMIN_STUDENTS_ROUTE}/${student.id}`}
                        className="inline-flex h-7 items-center rounded-lg border border-[#e5e7eb] bg-[#f7f7f8] px-3 text-[12px] font-semibold text-[#4b5563]"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}

                {pagedStudents.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">
                    No students found for the selected filters.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startIndex}-{endIndex} of {filteredStudents.length} students
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
            >
              &#8249;
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const active = safePage === pageNumber;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-[12px] font-semibold ${
                    active
                      ? "border-[#e24961] bg-[#ffecef] text-[#d61c3f]"
                      : "border-[#e5e7eb] bg-white text-[#6b7280]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
