"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import { type AdminScheduleRow, type AdminScheduleStatus, type AdminScheduleType } from "@/lib/admin/schedules-data";
import { ADMIN_SCHEDULES_ROUTE } from "@/lib/routes";

type RangeFilter = "All" | "Today" | "Week" | "Month";
type StatusFilter = "All" | AdminScheduleStatus;

type AdminSchedulesListResponse = {
  items: Array<{
    session_id?: string;
    booking_id?: string;
    schedule_id?: string;
    checkout_id?: string;
    student_name: string;
    tutor_name: string;
    subject: string;
    session_date: string;
    session_time: string;
    meeting_location?: string;
    meetingLocation?: string;
    duration_minutes: number;
    session_type: string;
    status: string;
    amount: string;
    student_initials?: string;
    student_initials_class_name?: string;
  }>;
};

const pageSize = 6;
const typeFilters = ["All Types", "In-Person", "Virtual"] as const;

function mapAdminScheduleRows(data: AdminSchedulesListResponse): AdminScheduleRow[] {
  return (data.items || []).map((row) => ({
    sessionId: row.session_id || row.booking_id || row.schedule_id || row.checkout_id || "",
    studentInitials: row.student_initials || "",
    studentInitialsClassName: row.student_initials_class_name || "bg-[#f1f1f1] text-[#6b7280]",
    student: row.student_name,
    tutor: row.tutor_name,
    subject: row.subject,
    sessionDate: row.session_date || "",
    sessionTime: row.session_time || "",
    dateTime: [row.session_date, row.session_time].filter(Boolean).join(" "),
    meetingLocation: row.meeting_location || row.meetingLocation || "",
    duration: row.duration_minutes ? `${row.duration_minutes} min` : "",
    type: row.session_type === "In-Person" ? "In-Person" : "Virtual",
    status:
      String(row.status).toLowerCase() === "completion requested"
        ? "Completion Requested"
        : String(row.status).toLowerCase() === "completed"
          ? "Completed"
          : String(row.status).toLowerCase() === "cancelled"
            ? "Cancelled"
            : String(row.status).toLowerCase() === "expired"
              ? "Expired"
            : "Upcoming",
    fee: row.amount,
  }));
}

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
  if (status === "Expired") return "bg-[#fff1f2] text-[#b42318]";
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

function ScheduleTableSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div
          key={`schedule-table-skeleton-${rowIndex}`}
          className="grid grid-cols-[0.95fr_1.5fr_1.2fr_1fr_1.2fr_0.9fr_0.8fr_0.9fr_0.7fr_0.6fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563] animate-pulse"
        >
          <div className="flex items-center">
            <div className="h-4 w-24 rounded bg-[#eceef2]" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#eef1f4]" />
            <div className="h-4 w-36 rounded bg-[#eef1f4]" />
          </div>
          <div className="h-4 w-28 rounded bg-[#eceef2]" />
          <div className="h-4 w-24 rounded bg-[#eceef2]" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded bg-[#eceef2]" />
            <div className="h-3 w-24 rounded bg-[#f1f3f6]" />
          </div>
          <div className="h-4 w-16 rounded bg-[#eceef2]" />
          <div className="inline-flex h-6 w-16 rounded-full bg-[#eef1f4]" />
          <div className="inline-flex h-6 w-20 rounded-full bg-[#eef1f4]" />
          <div className="h-4 w-14 rounded bg-[#eceef2]" />
          <div className="inline-flex h-7 w-14 rounded-lg bg-[#eef1f4]" />
        </div>
      ))}
    </div>
  );
}

function SchedulePageSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-11 w-44 rounded bg-[#eef1f4] animate-pulse" />
        <div className="inline-flex rounded-xl border border-[#e5e7eb] bg-white p-0.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`schedule-range-skeleton-${index}`}
              className={`h-9 rounded-lg px-4 ${
                index === 0 ? "w-16 bg-[#ffecef]" : "w-14 bg-[#f7f7f8]"
              } animate-pulse`}
            />
          ))}
        </div>
      </div>

      <section className="mt-4 grid gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={`schedule-summary-skeleton-${index}`} className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
            <div className="h-4 w-24 rounded bg-[#eef1f4] animate-pulse" />
            <div className="mt-3 h-12 w-16 rounded bg-[#eef1f4] animate-pulse" />
            <div className="mt-2 h-4 w-28 rounded bg-[#f1f3f6] animate-pulse" />
          </article>
        ))}
      </section>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`schedule-status-skeleton-${index}`}
              className={`h-9 rounded-full px-4 ${index === 0 ? "w-20 bg-[#ffecef]" : "w-24 bg-[#f7f7f8]"} animate-pulse`}
            />
          ))}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white sm:w-[160px] animate-pulse" />
          <div className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white sm:w-[130px] animate-pulse" />
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

            <ScheduleTableSkeleton />
          </div>
        </div>
      </section>

      <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 w-72 rounded bg-[#eef1f4] animate-pulse" />
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`schedule-page-skeleton-${index}`} className="h-7 w-7 rounded-md bg-[#eef1f4] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminSchedulesPage({
  initialRows,
  lazyLoadRows = false,
}: {
  initialRows?: AdminScheduleRow[];
  lazyLoadRows?: boolean;
}) {
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [tutorFilter, setTutorFilter] = useState<string>("All Tutors");
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<AdminScheduleRow[]>(initialRows ?? []);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(lazyLoadRows);
  const transitionTimeoutRef = useRef<number | null>(null);
  const tutorFilters = ["All Tutors", ...Array.from(new Set(rows.map((item) => item.tutor)))];

  useEffect(() => {
    setRows(initialRows ?? []);
  }, [initialRows]);

  useEffect(() => {
    if (!lazyLoadRows) {
      setIsInitialLoading(false);
      return;
    }

    let cancelled = false;

    const loadRows = async () => {
      setIsInitialLoading(true);
      setIsTableLoading(true);

      try {
        const payload = await browserApiRequest<AdminSchedulesListResponse>({
          url: "/api/admin/schedules",
          method: "GET",
        });

        if (!cancelled) {
          setRows(mapAdminScheduleRows(payload));
        }
      } catch {
        if (!cancelled) {
          setRows([]);
        }
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false);
          setIsTableLoading(false);
        }
      }
    };

    void loadRows();

    return () => {
      cancelled = true;
    };
  }, [lazyLoadRows]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const triggerTableLoading = () => {
    setIsTableLoading(true);
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTableLoading(false);
      transitionTimeoutRef.current = null;
    }, 180);
  };

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
    triggerTableLoading();
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <AdminShell>
      {isInitialLoading ? (
        <SchedulePageSkeleton />
      ) : (
        <div className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Schedules</h1>

            <div className="inline-flex rounded-xl border border-[#e5e7eb] bg-white p-0.5">
              {(["All", "Today", "Week", "Month"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={rangeFilter === item}
                  onClick={() => {
                    triggerTableLoading();
                    setRangeFilter(item);
                    setCurrentPage(1);
                  }}
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
              {(["All", "Upcoming", "Expired", "Completion Requested", "Completed", "Cancelled"] as const).map((value) => (
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
                  triggerTableLoading();
                  setTutorFilter(value);
                  setCurrentPage(1);
                }}
                widthClassName="sm:w-[160px]"
              />

              <FilterDropdown
                value={typeFilter}
                options={[...typeFilters]}
                onChange={(value) => {
                  triggerTableLoading();
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

                {isTableLoading ? (
                  <ScheduleTableSkeleton />
                ) : (
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
                )}
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
                onClick={() => {
                  triggerTableLoading();
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
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
                    onClick={() => {
                      triggerTableLoading();
                      setCurrentPage(pageNumber);
                    }}
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
                onClick={() => {
                  triggerTableLoading();
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                }}
                disabled={safePage === totalPages}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
              >
                &#8250;
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
