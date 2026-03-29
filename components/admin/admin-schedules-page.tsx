"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";

type SessionStatus = "Upcoming" | "Completed" | "Cancelled";
type SessionType = "In-Person" | "Virtual";
type RangeFilter = "Today" | "Week" | "Month";
type StatusFilter = "All" | SessionStatus;

type ScheduleRow = {
  id: string;
  studentInitials: string;
  studentInitialsClassName: string;
  student: string;
  tutor: string;
  subject: string;
  dateTime: string;
  duration: string;
  type: SessionType;
  status: SessionStatus;
  fee: string;
};

const scheduleRows: ScheduleRow[] = [
  {
    id: "#SS-2043",
    studentInitials: "JW",
    studentInitialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    student: "Jordan Wilson",
    tutor: "Marcus Reynolds",
    subject: "Algebra II",
    dateTime: "Mar 20 · 2:00 PM",
    duration: "60 min",
    type: "In-Person",
    status: "Upcoming",
    fee: "$45.00",
  },
  {
    id: "#SS-2042",
    studentInitials: "MW",
    studentInitialsClassName: "bg-[#f1f1f1] text-[#6b7280]",
    student: "Maya Wilson",
    tutor: "Lisa Davis",
    subject: "Reading",
    dateTime: "Mar 20 · 3:30 PM",
    duration: "45 min",
    type: "Virtual",
    status: "Upcoming",
    fee: "$30.00",
  },
  {
    id: "#SS-2041",
    studentInitials: "AT",
    studentInitialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    student: "Alex Thompson",
    tutor: "David Kim",
    subject: "SAT Prep",
    dateTime: "Mar 20 · 10:00 AM",
    duration: "90 min",
    type: "Virtual",
    status: "Completed",
    fee: "$82.50",
  },
  {
    id: "#SS-2040",
    studentInitials: "SL",
    studentInitialsClassName: "bg-[#ebf7ef] text-[#239157]",
    student: "Sophie Lee",
    tutor: "Priya Patel",
    subject: "Chemistry",
    dateTime: "Mar 19 · 5:00 PM",
    duration: "60 min",
    type: "In-Person",
    status: "Completed",
    fee: "$50.00",
  },
  {
    id: "#SS-2039",
    studentInitials: "RJ",
    studentInitialsClassName: "bg-[#ffecef] text-[#d94a62]",
    student: "Ryan Johnson",
    tutor: "Marcus Reynolds",
    subject: "Geometry",
    dateTime: "Mar 19 · 1:00 PM",
    duration: "60 min",
    type: "In-Person",
    status: "Cancelled",
    fee: "—",
  },
  {
    id: "#SS-2038",
    studentInitials: "EC",
    studentInitialsClassName: "bg-[#fff6de] text-[#b58112]",
    student: "Emma Carter",
    tutor: "Lisa Davis",
    subject: "Pre-Algebra",
    dateTime: "Mar 19 · 4:00 PM",
    duration: "45 min",
    type: "Virtual",
    status: "Completed",
    fee: "$30.00",
  },
  {
    id: "#SS-2037",
    studentInitials: "NB",
    studentInitialsClassName: "bg-[#ebf7ef] text-[#239157]",
    student: "Noah Baker",
    tutor: "David Kim",
    subject: "General Math",
    dateTime: "Mar 20 · 5:00 PM",
    duration: "60 min",
    type: "In-Person",
    status: "Upcoming",
    fee: "$55.00",
  },
  {
    id: "#SS-2036",
    studentInitials: "OC",
    studentInitialsClassName: "bg-[#ffecef] text-[#d94a62]",
    student: "Olivia Clark",
    tutor: "Nina Foster",
    subject: "English",
    dateTime: "Mar 20 · 6:00 PM",
    duration: "60 min",
    type: "Virtual",
    status: "Upcoming",
    fee: "$42.00",
  },
];

const pageSize = 6;
const tutorFilters = ["All Tutors", ...Array.from(new Set(scheduleRows.map((item) => item.tutor)))];
const typeFilters = ["All Types", "In-Person", "Virtual"] as const;

function FilterDropdown({
  value,
  options,
  onChange,
  widthClassName,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  widthClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${widthClassName}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-[#e5e7eb] bg-white px-3 text-[13px] font-semibold text-[#4b5563]"
      >
        <span>{value}</span>
        <FiChevronDown className="h-4 w-4 text-[#6b7280]" />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-40 mt-1 w-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-lg">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={`flex h-9 w-full items-center px-3 text-left text-[13px] font-semibold transition ${
                item === value
                  ? "bg-[#ffecef] text-[#d61c3f]"
                  : "text-[#4b5563] hover:bg-[#f7f7f8]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function typeClassName(type: SessionType) {
  if (type === "Virtual") return "bg-[#ffecef] text-[#d94a62]";
  return "bg-[#f1f1f1] text-[#6b7280]";
}

function statusClassName(status: SessionStatus) {
  if (status === "Upcoming") return "bg-[#fff6de] text-[#9c7a1e]";
  if (status === "Completed") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#ffecef] text-[#d94a62]";
}

export function AdminSchedulesPage() {
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("Today");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [tutorFilter, setTutorFilter] = useState<string>("All Tutors");
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("All Types");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    return scheduleRows.filter((item) => {
      const statusMatch = statusFilter === "All" ? true : item.status === statusFilter;
      const tutorMatch = tutorFilter === "All Tutors" ? true : item.tutor === tutorFilter;
      const typeMatch = typeFilter === "All Types" ? true : item.type === typeFilter;
      return statusMatch && tutorMatch && typeMatch;
    });
  }, [statusFilter, tutorFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIndex = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, filteredRows.length);

  const handleStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Schedules</h1>

          <div className="inline-flex rounded-xl border border-[#e5e7eb] bg-white p-0.5">
            {(["Today", "Week", "Month"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRangeFilter(item)}
                className={`h-9 rounded-lg px-4 text-[13px] font-semibold transition ${
                  rangeFilter === item
                    ? "bg-[#ffecef] text-[#d61c3f]"
                    : "text-[#6b7280] hover:bg-[#f7f7f8]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-4 grid gap-3 lg:grid-cols-4">
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[44px] font-bold leading-none text-[#20242b]">31</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">Sessions Today</p>
          </article>
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[44px] font-bold leading-none text-[#239157]">24</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">Upcoming</p>
          </article>
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[44px] font-bold leading-none text-[#20242b]">5</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">Completed</p>
          </article>
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[44px] font-bold leading-none text-[#d94a62]">2</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">Cancelled</p>
          </article>
        </section>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Upcoming", "Completed", "Cancelled"] as const).map((value) => (
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

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <FilterDropdown
              value={tutorFilter}
              options={tutorFilters}
              onChange={(value) => {
                setTutorFilter(value);
                setCurrentPage(1);
              }}
              widthClassName="sm:w-[160px]"
            />

            <FilterDropdown
              value={typeFilter}
              options={[...typeFilters]}
              onChange={(value) => {
                setTypeFilter(value as (typeof typeFilters)[number]);
                setCurrentPage(1);
              }}
              widthClassName="sm:w-[130px]"
            />
          </div>
        </div>

        <section className="mt-3 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1120px]">
              <div className="grid grid-cols-[0.95fr_1.5fr_1.2fr_1fr_1.2fr_0.9fr_0.8fr_0.9fr_0.7fr_0.6fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Session ID</span>
                <span>Student</span>
                <span>Tutor</span>
                <span>Subject</span>
                <span>Date & Time</span>
                <span>Duration</span>
                <span>Type</span>
                <span>Status</span>
                <span>Fee</span>
                <span> </span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {pagedRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[0.95fr_1.5fr_1.2fr_1fr_1.2fr_0.9fr_0.8fr_0.9fr_0.7fr_0.6fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                  >
                    <span className="font-semibold text-[#9ca3af]">{row.id}</span>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${row.studentInitialsClassName}`}
                      >
                        {row.studentInitials}
                      </span>
                      <span className="font-medium text-[#374151]">{row.student}</span>
                    </div>

                    <span>{row.tutor}</span>
                    <span>{row.subject}</span>
                    <span>{row.dateTime}</span>
                    <span>{row.duration}</span>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeClassName(row.type)}`}>
                        {row.type}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassName(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                    <span className="font-semibold text-[#374151]">{row.fee}</span>
                    <div>
                      <button
                        type="button"
                        className="inline-flex h-7 items-center rounded-lg border border-[#e5e7eb] bg-[#f7f7f8] px-3 text-[12px] font-semibold text-[#4b5563]"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}

                {pagedRows.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">
                    No sessions found for the selected filters.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startIndex}-{endIndex} of {filteredRows.length} sessions{" "}
            {rangeFilter === "Today" ? "today" : rangeFilter.toLowerCase()}
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
