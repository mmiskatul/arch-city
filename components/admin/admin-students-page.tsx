"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { ADMIN_STUDENTS_ROUTE } from "@/lib/routes";

type AdminStudentStatus = "Active" | "Inactive";

type AdminStudentRow = {
  id: string;
  initials: string;
  initialsClassName: string;
  name: string;
  email: string;
  grade: string;
  guardian: string;
  sessions: number;
  lastSession: string;
  subjects: string[];
  status: AdminStudentStatus;
};

type StudentsApiItem = {
  student_id: string;
  name: string;
  email: string;
  grade: string;
  guardian: string;
  sessions: number;
  last_session: string;
  subjects: string[];
  status: "active" | "inactive";
};

type StudentsApiResponse = {
  total: number;
  items: StudentsApiItem[];
};

type StudentsStatsResponse = {
  total: number;
  active: number;
  inactive: number;
  grades: string[];
};

const pageSize = 7;

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function initialsClassFromIndex(index: number) {
  const classes = [
    "bg-[#ffe7eb] text-[#d94a62]",
    "bg-[#f1f1f1] text-[#6b7280]",
    "bg-[#ebf7ef] text-[#239157]",
    "bg-[#fff6de] text-[#b58112]",
  ];
  return classes[index % classes.length];
}

function toUiStatus(status: "active" | "inactive"): AdminStudentStatus {
  return status === "active" ? "Active" : "Inactive";
}

function statusClassName(status: AdminStudentStatus) {
  if (status === "Active") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#fff6de] text-[#9c7a1e]";
}

function toUiStudent(item: StudentsApiItem, index: number): AdminStudentRow {
  return {
    id: item.student_id,
    initials: initialsFromName(item.name),
    initialsClassName: initialsClassFromIndex(index),
    name: item.name,
    email: item.email,
    grade: item.grade,
    guardian: item.guardian || "Not assigned",
    sessions: item.sessions,
    lastSession: item.last_session || "-",
    subjects: Array.isArray(item.subjects) ? item.subjects : [],
    status: toUiStatus(item.status),
  };
}

function StudentsTableSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[1.8fr_0.9fr_1.35fr_0.75fr_0.95fr_1fr_0.75fr_0.65fr] gap-3 px-4 py-3">
          <div className="space-y-1">
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#eceef2]" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-[#f1f3f6]" />
          </div>
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-6 animate-pulse rounded bg-[#f1f3f6]" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-[#f1f3f6]" />
          <div className="h-7 w-12 animate-pulse rounded bg-[#f1f3f6]" />
        </div>
      ))}
    </div>
  );
}

export function AdminStudentsPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | AdminStudentStatus>("All");
  const [gradeFilter, setGradeFilter] = useState<string>("All Grades");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [students, setStudents] = useState<AdminStudentRow[]>([]);
  const [stats, setStats] = useState<StudentsStatsResponse>({ total: 0, active: 0, inactive: 0, grades: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const response = await fetch("/api/admin/students/stats", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as StudentsStatsResponse;
        if (!cancelled) {
          setStats(payload);
        }
      } catch {
        // keep fallback stats
      }
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadStudents = async () => {
      setIsLoading(true);
      setLoadError(null);

      const params = new URLSearchParams();
      if (statusFilter !== "All") {
        params.set("status_filter", statusFilter.toLowerCase());
      }
      if (gradeFilter !== "All Grades") {
        params.set("grade_filter", gradeFilter);
      }

      try {
        const response = await fetch(`/api/admin/students?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load students.");
        }

        const payload = (await response.json()) as StudentsApiResponse;
        if (cancelled) return;

        setStudents(payload.items.map((item, index) => toUiStudent(item, index)));
      } catch (error) {
        if (cancelled) return;
        setStudents([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load students.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadStudents();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, gradeFilter]);

  const gradeFilters = useMemo(() => ["All Grades", ...stats.grades], [stats.grades]);

  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedStudents = students.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIndex = students.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, students.length);

  const handleStatusFilter = (value: "All" | AdminStudentStatus) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleGradeFilter = (value: string) => {
    setGradeFilter(value);
    setCurrentPage(1);
  };

  const totalText = `${stats.total} total students across all families`;

  return (
    <AdminShell>
      <div className="w-full">
        <div>
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Students</h1>
          <p className="mt-2 text-[14px] text-[#6b7280]">{totalText}</p>
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

        {loadError ? (
          <p className="mt-3 rounded-md border border-[#ffecef] bg-[#fff5f7] px-3 py-2 text-[12px] text-[#d61c3f]">{loadError}</p>
        ) : null}

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

              {isLoading ? (
                <StudentsTableSkeleton />
              ) : (
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
                        {student.subjects.length === 0 ? <span className="text-[12px] text-[#6b7280]">-</span> : null}
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClassName(student.status)}`}>
                          {student.status}
                        </span>
                      </div>
                      <div>
                        <Link
                          href={`${ADMIN_STUDENTS_ROUTE}/${encodeURIComponent(student.id)}`}
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
              )}
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startIndex}-{endIndex} of {students.length} students
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1 || isLoading}
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
              disabled={safePage === totalPages || isLoading}
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
