"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  type AdminScheduleRow,
  type AdminScheduleStatus,
  type AdminScheduleType,
} from "@/lib/admin/schedules-data";
import { ADMIN_SCHEDULES_ROUTE } from "@/lib/routes";

type RangeFilter = "All" | "Today" | "Week" | "Month";
type StatusFilter = "All" | AdminScheduleStatus;

const pageSize = 6;
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

function typeClassName(type: AdminScheduleType) {
  if (type === "Virtual") return "bg-[#ffecef] text-[#d94a62]";
  return "bg-[#f1f1f1] text-[#6b7280]";
}

function statusClassName(status: AdminScheduleStatus) {
  if (status === "Completion Requested") return "bg-[#fff6de] text-[#9c7a1e]";
  if (status === "Upcoming") return "bg-[#fff6de] text-[#9c7a1e]";
  if (status === "Completed") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#ffecef] text-[#d94a62]";
}

function rangeSummaryCopy(rangeFilter: RangeFilter) {
  if (rangeFilter === "Today") {
    return { title: "Sessions Today", subtitle: "Sessions booked today" };
  }
  if (rangeFilter === "Week") {
    return { title: "Sessions This Week", subtitle: "Sessions booked this week" };
  }
  if (rangeFilter === "Month") {
    return { title: "Sessions This Month", subtitle: "Sessions booked this month" };
  }
  return { title: "Sessions", subtitle: "All booking records" };
}

function formatDateTimeLabel(row: AdminScheduleRow) {
  const dateLabel = row.sessionDate || row.dateTime.split(" ")[0] || "";
  const timeLabel = row.sessionTime || row.dateTime.split(" ").slice(1).join(" ") || "";
  const normalizedTime = timeLabel.replace(/\s+([AP]M)\b/gi, " $1").trim();
  return [dateLabel, normalizedTime].filter(Boolean).join(" · ");
}

function parseDateLike(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const daysSinceMonday = (day + 6) % 7;
  next.setDate(next.getDate() - daysSinceMonday);
  return next;
}

function startOfMonth(date: Date) {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
}

function matchesRangeFilter(row: AdminScheduleRow, filter: RangeFilter) {
  if (filter === "All") {
    return true;
  }

  const rawDate = row.sessionDate || row.dateTime.split(" ")[0] || "";
  const parsed = parseDateLike(rawDate);
  if (!parsed) {
    return true;
  }

  const now = new Date();
  if (filter === "Today") {
    const today = startOfDay(now);
    return parsed >= today && parsed < new Date(today.getTime() + 24 * 60 * 60 * 1000);
  }

  if (filter === "Week") {
    const weekStart = startOfWeek(now);
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    return parsed >= weekStart && parsed < nextWeekStart;
  }

  const monthStart = startOfMonth(now);
  const nextMonthStart = new Date(monthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
  return parsed >= monthStart && parsed < nextMonthStart;
}

export function AdminSchedulesPage({ initialRows }: { initialRows?: AdminScheduleRow[] }) {
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [tutorFilter, setTutorFilter] = useState<string>("All Tutors");
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const rows = initialRows ?? [];
  const tutorFilters = ["All Tutors", ...Array.from(new Set(rows.map((item) => item.tutor)))];
  const rangeRows = useMemo(
    () => rows.filter((item) => matchesRangeFilter(item, rangeFilter)),
    [rangeFilter, rows],
  );
  const rangeSummary = rangeSummaryCopy(rangeFilter);
  const sessionsToday = rangeRows.length;
  const upcomingCount = rangeRows.filter((item) => item.status === "Upcoming").length;
  const completedCount = rangeRows.filter((item) => item.status === "Completed").length;
  const cancelledCount = rangeRows.filter((item) => item.status === "Cancelled").length;

  const filteredRows = useMemo(() => {
    return rangeRows.filter((item) => {
      const statusMatch = statusFilter === "All" ? true : item.status === statusFilter;
      const tutorMatch = tutorFilter === "All Tutors" ? true : item.tutor === tutorFilter;
      const typeMatch = typeFilter === "All Types" ? true : item.type === typeFilter;
      return statusMatch && tutorMatch && typeMatch;
    });
  }, [rangeRows, statusFilter, tutorFilter, typeFilter]);

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
                {(["All", "Today", "Week", "Month"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={rangeFilter === item}
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
            <p className="text-[44px] font-bold leading-none text-[#20242b]">{sessionsToday}</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">{rangeSummary.title}</p>
            <p className="mt-1 text-[13px] text-[#9ca3af]">{rangeSummary.subtitle}</p>
          </article>
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[44px] font-bold leading-none text-[#239157]">{upcomingCount}</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">Upcoming</p>
          </article>
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[44px] font-bold leading-none text-[#20242b]">{completedCount}</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">Completed</p>
          </article>
          <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <p className="text-[44px] font-bold leading-none text-[#d94a62]">{cancelledCount}</p>
            <p className="mt-1 text-[24px] font-semibold text-[#6b7280]">Cancelled</p>
          </article>
        </section>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Upcoming", "Completion Requested", "Completed", "Cancelled"] as const).map((value) => (
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
                {value === "Completion Requested" ? "Requested" : value}
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
                <span>FEE</span>
                <span> </span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {pagedRows.map((row, index) => (
                  <div
                    key={`${row.sessionId || "session"}-${safePage}-${index}`}
                    className="grid grid-cols-[0.95fr_1.5fr_1.2fr_1fr_1.2fr_0.9fr_0.8fr_0.9fr_0.7fr_0.6fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                  >
                    <span className="font-semibold text-[#9ca3af]">#{row.sessionId || "N/A"}</span>

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
                    <div>
                      <span>{formatDateTimeLabel(row)}</span>
                      {row.meetingLocation ? (
                        <p className="mt-0.5 text-[11px] text-[#9ca3af]">{row.meetingLocation}</p>
                      ) : null}
                    </div>
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
                      {row.sessionId ? (
                        <Link
                          href={`${ADMIN_SCHEDULES_ROUTE}/${encodeURIComponent(row.sessionId)}`}
                          className="inline-flex h-7 items-center rounded-lg border border-[#e5e7eb] bg-[#f7f7f8] px-3 text-[12px] font-semibold text-[#4b5563]"
                        >
                          View
                        </Link>
                      ) : (
                        <span className="inline-flex h-7 items-center rounded-lg border border-dashed border-[#e5e7eb] bg-white px-3 text-[12px] font-semibold text-[#9ca3af]">
                          View
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {pagedRows.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">
                    No schedule records found in the database for the selected filters.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startIndex}-{endIndex} of {filteredRows.length} sessions{" "}
            {rangeFilter === "All" ? "across all time" : rangeFilter.toLowerCase()}
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
