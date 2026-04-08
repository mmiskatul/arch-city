"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiStar } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import type { AdminTutorStatus, AdminTutorRow } from "@/lib/admin/tutors-data";
import { ADMIN_TUTOR_APPLICATIONS_ROUTE, ADMIN_TUTORS_ROUTE } from "@/lib/routes";

type TutorFilter = "All Tutors" | "Approved" | "Unverified" | "Suspended";

type TutorApiStatus = "approved" | "unverified" | "suspended";

type TutorsApiItem = {
  tutor_id: string;
  name: string;
  email: string;
  subjects: string[];
  sessions: number;
  rating: string;
  hourly_rate: string;
  earned_mtd: string;
  status: TutorApiStatus;
  application_status?: "not_submitted" | "pending" | "approved" | "rejected";
  application_id?: string | null;
};

type TutorsApiResponse = {
  total: number;
  items: TutorsApiItem[];
};

type TutorStatsResponse = {
  total: number;
  approved: number;
  pending: number;
  suspended: number;
};

const pageSize = 6;

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "TU";
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

function statusClassName(status: AdminTutorStatus) {
  if (status === "Approved") return "bg-[#ebf7ef] text-[#239157]";
  if (status === "Unverified") return "bg-[#fff6de] text-[#9c7a1e]";
  return "bg-[#ffecef] text-[#d94a62]";
}

function toStatus(filter: TutorFilter): TutorApiStatus | null {
  if (filter === "Approved") return "approved";
  if (filter === "Unverified") return "unverified";
  if (filter === "Suspended") return "suspended";
  return null;
}

function toUiStatus(status: TutorApiStatus): AdminTutorStatus {
  if (status === "approved") return "Approved";
  if (status === "unverified") return "Unverified";
  return "Suspended";
}

function toUiTutor(item: TutorsApiItem, index: number): AdminTutorRow {
  const applicationStatus = item.application_status ?? (item.application_id ? "pending" : "not_submitted");

  return {
    id: item.tutor_id,
    initials: initialsFromName(item.name),
    initialsClassName: initialsClassFromIndex(index),
    name: item.name,
    email: item.email,
    subjects: Array.isArray(item.subjects) ? item.subjects : [],
    sessions: Number.isFinite(item.sessions) ? item.sessions : 0,
    rating: item.rating || "New",
    hourlyRate: item.hourly_rate || "-",
    earnedMtd: item.earned_mtd || "$0",
    status: toUiStatus(item.status),
    applicationStatus,
    applicationId: item.application_id || undefined,
  };
}

function TutorsTableSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.7fr_1.45fr_0.75fr_0.7fr_0.9fr_0.95fr_0.85fr_0.95fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563] animate-pulse"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#eef1f4]" />
            <div className="space-y-1">
              <div className="h-4 w-32 rounded bg-[#eceef2]" />
              <div className="h-3 w-28 rounded bg-[#f1f3f6]" />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <div className="h-6 w-16 rounded-full bg-[#f1f3f6]" />
            <div className="h-6 w-20 rounded-full bg-[#f1f3f6]" />
          </div>

          <div className="flex items-center">
            <div className="h-4 w-10 rounded bg-[#eceef2]" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-16 rounded bg-[#eceef2]" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-14 rounded bg-[#eceef2]" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-20 rounded bg-[#eceef2]" />
          </div>
          <div className="flex items-center">
            <div className="h-6 w-16 rounded-full bg-[#f1f3f6]" />
          </div>
          <div className="flex items-center justify-end">
            <div className="h-7 w-12 rounded bg-[#f1f3f6]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminTutorsPage() {
  const [tutors, setTutors] = useState<AdminTutorRow[]>([]);
  const [stats, setStats] = useState<TutorStatsResponse>({ total: 0, approved: 0, pending: 0, suspended: 0 });
  const [filter, setFilter] = useState<TutorFilter>("All Tutors");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      try {
        const payload = await browserApiRequest<TutorStatsResponse>({
          url: "/api/admin/tutors/stats",
          method: "GET",
        });
        if (!cancelled) setStats(payload);
      } catch {
        // no-op
      }
    };

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadTutors = async () => {
      setIsLoading(true);
      setLoadError(null);

      const params = new URLSearchParams();
      const status = toStatus(filter);
      if (status) params.set("status_filter", status);

      try {
        const payload = await browserApiRequest<TutorsApiResponse>({
          url: `/api/admin/tutors?${params.toString()}`,
          method: "GET",
        });
        if (cancelled) return;

        setTutors((payload.items || []).map((item, index) => toUiTutor(item, index)));
      } catch (error) {
        if (cancelled) return;
        setTutors([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load tutors.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadTutors();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(tutors.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = useMemo(() => tutors.slice((safePage - 1) * pageSize, safePage * pageSize), [tutors, safePage]);

  const startIndex = tutors.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, tutors.length);

  const handleFilter = (next: TutorFilter) => {
    setFilter(next);
    setCurrentPage(1);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Tutors</h1>
            <p className="mt-2 text-[14px] text-[#6b7280]">
              {stats.approved} approved - {stats.pending} unverified
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-[13px] font-semibold text-[#4b5563]"
          >
            <FiDownload className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4 border-b border-[#eceef2] bg-white px-2">
          {(["All Tutors", "Approved", "Unverified", "Suspended"] as const).map((item) => {
            const active = filter === item;
            const showApprovedBadge = item === "Approved";
            const showPendingBadge = item === "Unverified";

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleFilter(item)}
                className={`inline-flex h-10 items-center gap-1.5 border-b-2 px-2 text-[14px] font-semibold transition ${
                  active
                    ? "border-[#d94a62] text-[#d61c3f]"
                    : "border-transparent text-[#6b7280] hover:text-[#374151]"
                }`}
              >
                {item}
                {showApprovedBadge ? (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d61c3f] px-1 text-[10px] font-semibold text-white">
                    {stats.approved}
                  </span>
                ) : null}
                {showPendingBadge ? (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8f6b10] px-1 text-[10px] font-semibold text-white">
                    {stats.pending}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {loadError ? (
          <p className="mt-3 rounded-md border border-[#ffecef] bg-[#fff5f7] px-3 py-2 text-[12px] text-[#d61c3f]">{loadError}</p>
        ) : null}

        <section className="mt-4 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              <div className="grid grid-cols-[1.7fr_1.45fr_0.75fr_0.7fr_0.9fr_0.95fr_0.85fr_0.95fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Tutor</span>
                <span>Subjects</span>
                <span>Sessions</span>
                <span>Rating</span>
                <span>Hourly Rate</span>
                <span>Earned (MTD)</span>
                <span>Status</span>
                <span> </span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {isLoading ? (
                  <TutorsTableSkeleton />
                ) : pageRows.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[14px] text-[#6b7280]">No tutors found.</div>
                ) : (
                  pageRows.map((tutor) => (
                    <div
                      key={tutor.id}
                      className={`grid grid-cols-[1.7fr_1.45fr_0.75fr_0.7fr_0.9fr_0.95fr_0.85fr_0.95fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563] ${
                        tutor.status === "Unverified" ? "bg-[#fffdf3]" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${tutor.initialsClassName}`}
                        >
                          {tutor.initials}
                        </span>
                        <div>
                          <p className="font-semibold text-[#20242b]">{tutor.name}</p>
                          <p className="text-[12px] text-[#6b7280]">{tutor.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex rounded-full border border-[#e5e7eb] bg-[#f7f7f8] px-2.5 py-1 text-[11px] font-medium text-[#6b7280]"
                          >
                            {subject}
                          </span>
                        ))}
                        {tutor.subjects.length === 0 ? <span className="text-[12px] text-[#6b7280]">-</span> : null}
                      </div>

                      <span>{tutor.sessions}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#8f6b10]">
                        <FiStar className="h-3.5 w-3.5 fill-[#c58b1a] text-[#c58b1a]" />
                        {tutor.rating}
                      </span>
                      <span>{tutor.hourlyRate}</span>
                      <span className="font-semibold text-[#239157]">{tutor.earnedMtd ?? "-"}</span>
                      <div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassName(tutor.status)}`}
                        >
                          {tutor.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-end">
                        {tutor.status === "Approved" ? (
                          <Link
                            href={`${ADMIN_TUTORS_ROUTE}/${encodeURIComponent(tutor.id)}`}
                            className="inline-flex h-7 items-center rounded-lg border border-[#e5e7eb] bg-[#f7f7f8] px-3 text-[12px] font-semibold text-[#4b5563]"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="text-[12px] text-[#9ca3af]">-</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-3 flex flex-col gap-3 text-[13px] text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startIndex}-{endIndex} of {tutors.length} tutors
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
