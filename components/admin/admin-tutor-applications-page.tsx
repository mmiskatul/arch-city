"use client";

import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { adminTutorApplications, type ApplicationStatus } from "@/lib/admin/tutor-applications-data";
import { ADMIN_TUTOR_APPLICATIONS_ROUTE } from "@/lib/routes";

function statusBadgeClassName(status: ApplicationStatus) {
  if (status === "Confirmed") {
    return "bg-[#ebf7ef] text-[#239157]";
  }

  if (status === "Cancelled") {
    return "bg-[#ffecef] text-[#d94a62]";
  }

  return "bg-[#fff6de] text-[#b58112]";
}

export function AdminTutorApplicationsPage() {
  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#20242b]">Tutor Applications</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">Review applications by opening each application detail page.</p>
          </div>
          <p className="text-[13px] font-semibold text-[#6b7280]">Total Applications: {adminTutorApplications.length}</p>
        </div>

        <section className="mt-5 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-[0.9fr_1.4fr_0.9fr_0.8fr_1fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                <span>ID</span>
                <span>Tutor</span>
                <span>Submitted</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {adminTutorApplications.map((application) => (
                  <div
                    key={application.id}
                    className="grid grid-cols-[0.9fr_1.4fr_0.9fr_0.8fr_1fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
