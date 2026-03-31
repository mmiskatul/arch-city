"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import type { ApplicationStatus, TutorApplication } from "@/lib/admin/tutor-applications-data";
import { ADMIN_TUTOR_APPLICATIONS_ROUTE } from "@/lib/routes";

type ApiStatus = "pending" | "approved" | "rejected";

type ApiItem = {
  application_id: string;
  status: ApiStatus;
  submitted_at: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  city: string;
  state: string;
  subjects: string;
  degree: string;
  certification: string;
  tutoring_days_per_month: string;
  tutoring_mode: string;
  teaching_approach: string;
};

type ListResponse = {
  total: number;
  items: ApiItem[];
};

type StatsResponse = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

function statusBadgeClassName(status: ApplicationStatus) {
  if (status === "Approved") {
    return "bg-[#ebf7ef] text-[#239157]";
  }

  if (status === "Rejected") {
    return "bg-[#ffecef] text-[#d94a62]";
  }

  return "bg-[#fff6de] text-[#b58112]";
}

function toDisplayStatus(status: ApiStatus): ApplicationStatus {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function formatDate(dateIso: string) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function toUiApplication(item: ApiItem): TutorApplication {
  return {
    id: item.application_id,
    fullName: `${item.first_name} ${item.last_name}`.trim(),
    email: item.email,
    phone: item.mobile_phone || "Not provided",
    submittedOn: formatDate(item.submitted_at),
    subjects: item.subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean),
    experience: item.tutoring_mode || "Not provided",
    education: [item.degree, item.certification].filter(Boolean).join(" | ") || "Not provided",
    availability: item.tutoring_days_per_month || "Not provided",
    hourlyRate: "N/A",
    location: [item.city, item.state].filter(Boolean).join(", ") || "Not provided",
    bio: item.teaching_approach || "Not provided",
    certifications: item.certification
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    documents: [],
    status: toDisplayStatus(item.status),
  };
}

function LoadingRows() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[1fr_1.4fr_1fr_0.8fr_1fr] gap-3 px-4 py-3">
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="space-y-1">
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#eceef2]" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-[#f1f3f6]" />
          </div>
          <div className="h-4 animate-pulse rounded bg-[#eceef2]" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-[#f1f3f6]" />
          <div className="h-8 w-16 animate-pulse rounded-full bg-[#f1f3f6]" />
        </div>
      ))}
    </div>
  );
}

export function AdminTutorApplicationsPage({
  activeView,
}: {
  activeView: "pending" | "all";
}) {
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError(undefined);

      try {
        const [listRes, statsRes] = await Promise.all([
          fetch(`/api/admin/tutor-applications?view=${activeView}`, { cache: "no-store" }),
          fetch("/api/admin/tutor-applications/stats", { cache: "no-store" }),
        ]);

        if (!listRes.ok || !statsRes.ok) {
          throw new Error("Failed to load tutor applications.");
        }

        const listData = (await listRes.json()) as ListResponse;
        const statsData = (await statsRes.json()) as StatsResponse;

        if (cancelled) return;

        setApplications(listData.items.map(toUiApplication));
        setStats(statsData);
      } catch (error) {
        if (cancelled) return;
        setApplications([]);
        setStats(null);
        setLoadError(error instanceof Error ? error.message : "Failed to load tutor applications.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeView]);

  const total = useMemo(() => {
    if (!stats) return 0;
    return activeView === "all" ? stats.total : stats.pending;
  }, [activeView, stats]);

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#20242b]">Tutor Applications</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">Review applications by opening each application detail page.</p>
          </div>
          <p className="text-[13px] font-semibold text-[#6b7280]">Total Applications: {total}</p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={ADMIN_TUTOR_APPLICATIONS_ROUTE}
            className={`inline-flex h-8 items-center rounded-full border px-4 text-[12px] font-semibold transition ${
              activeView === "pending"
                ? "border-[#d61c3f] bg-[#d61c3f] text-white"
                : "border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb]"
            }`}
          >
            Pending
          </Link>
          <Link
            href={`${ADMIN_TUTOR_APPLICATIONS_ROUTE}?view=all`}
            className={`inline-flex h-8 items-center rounded-full border px-4 text-[12px] font-semibold transition ${
              activeView === "all"
                ? "border-[#d61c3f] bg-[#d61c3f] text-white"
                : "border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb]"
            }`}
          >
            All
          </Link>
        </div>

        {loadError ? (
          <p className="mt-3 rounded-md border border-[#ffecef] bg-[#fff5f7] px-3 py-2 text-[12px] text-[#d61c3f]">{loadError}</p>
        ) : null}

        <section className="mt-5 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-[1fr_1.4fr_1fr_0.8fr_1fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                <span>ID</span>
                <span>Tutor</span>
                <span>Submitted</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {isLoading ? (
                <LoadingRows />
              ) : (
                <div className="divide-y divide-[#eceef2]">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="grid grid-cols-[1fr_1.4fr_1fr_0.8fr_1fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                    >
                      <span className="font-semibold text-[#374151]">{application.id}</span>

                      <div>
                        <p className="font-semibold text-[#20242b]">{application.fullName}</p>
                        <p className="text-[12px] text-[#6b7280]">{application.email}</p>
                      </div>

                      <span>{application.submittedOn}</span>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClassName(application.status)}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`${ADMIN_TUTOR_APPLICATIONS_ROUTE}/${application.id}`}
                          className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-3 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}

                  {applications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-[13px] text-[#6b7280]">No tutor applications found for this view.</div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
