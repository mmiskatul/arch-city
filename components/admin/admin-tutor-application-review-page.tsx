"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  adminTutorApplications,
  type ApplicationStatus,
  type TutorApplication,
} from "@/lib/admin/tutor-applications-data";
import { ADMIN_TUTOR_APPLICATIONS_ROUTE } from "@/lib/routes";

type ActionState = {
  action: "confirm" | "cancel";
} | null;

function statusBadgeClassName(status: ApplicationStatus) {
  if (status === "Confirmed") {
    return "bg-[#ebf7ef] text-[#239157]";
  }

  if (status === "Cancelled") {
    return "bg-[#ffecef] text-[#d94a62]";
  }

  return "bg-[#fff6de] text-[#b58112]";
}

export function AdminTutorApplicationReviewPage({ applicationId }: { applicationId: string }) {
  const [applications, setApplications] = useState<TutorApplication[]>(adminTutorApplications);
  const [actionState, setActionState] = useState<ActionState>(null);

  const selectedApplication = useMemo(
    () => applications.find((item) => item.id === applicationId) ?? null,
    [applications, applicationId],
  );

  const handleActionApprove = () => {
    if (!actionState || !selectedApplication) return;

    setApplications((prev) =>
      prev.map((item) =>
        item.id === selectedApplication.id
          ? { ...item, status: actionState.action === "confirm" ? "Confirmed" : "Cancelled" }
          : item,
      ),
    );
    setActionState(null);
  };

  return (
    <AdminShell>
      <div className="w-full">
        {selectedApplication ? (
          <section className="rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-[#20242b]">Application Review</h2>
                <p className="text-[13px] text-[#6b7280]">
                  Reviewing {selectedApplication.fullName} ({selectedApplication.id})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClassName(selectedApplication.status)}`}
                >
                  {selectedApplication.status}
                </span>
                <Link
                  href={ADMIN_TUTOR_APPLICATIONS_ROUTE}
                  className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-3 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  Back to Applications
                </Link>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Contact Information</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">Name: {selectedApplication.fullName}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Email: {selectedApplication.email}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Phone: {selectedApplication.phone}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Location: {selectedApplication.location}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Submitted: {selectedApplication.submittedOn}</p>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Professional Details</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">Experience: {selectedApplication.experience}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Education: {selectedApplication.education}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Availability: {selectedApplication.availability}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Requested Rate: {selectedApplication.hourlyRate}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#f8fafb] p-4">
              <h3 className="text-[14px] font-bold text-[#20242b]">Subjects</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedApplication.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex rounded-full bg-[#ebf7ef] px-2.5 py-1 text-[11px] font-semibold text-[#239157]"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#f8fafb] p-4">
              <h3 className="text-[14px] font-bold text-[#20242b]">Tutor Bio</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#4b5563]">{selectedApplication.bio}</p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Certifications</h3>
                <ul className="mt-2 space-y-1">
                  {selectedApplication.certifications.map((item) => (
                    <li key={item} className="text-[13px] text-[#4b5563]">
                      - {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Uploaded Documents</h3>
                <ul className="mt-2 space-y-1">
                  {selectedApplication.documents.map((item) => (
                    <li key={item} className="text-[13px] text-[#4b5563]">
                      - {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActionState({ action: "confirm" })}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#239157] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1d7b49]"
              >
                <FiCheckCircle className="h-4 w-4" />
                Confirm Application
              </button>
              <button
                type="button"
                onClick={() => setActionState({ action: "cancel" })}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d94a62] px-5 text-[13px] font-semibold text-white transition hover:bg-[#bf3d53]"
              >
                <FiXCircle className="h-4 w-4" />
                Cancel Application
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-[14px] border border-[#e7e7eb] bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[20px] font-bold text-[#20242b]">Application Not Found</h2>
            <p className="mt-2 text-[14px] text-[#6b7280]">No tutor application exists for ID: {applicationId}</p>
            <Link
              href={ADMIN_TUTOR_APPLICATIONS_ROUTE}
              className="mt-4 inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
            >
              Back to Tutor Applications
            </Link>
          </section>
        )}
      </div>

      {actionState && selectedApplication ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#20242b]">
              {actionState.action === "confirm" ? "Confirm This Application?" : "Cancel This Application?"}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
              {actionState.action === "confirm"
                ? "This will mark the tutor as approved and visible as a confirmed tutor."
                : "This will mark the tutor application as cancelled. You can still review it later."}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActionState(null)}
                className="inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleActionApprove}
                className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold text-white transition ${
                  actionState.action === "confirm"
                    ? "bg-[#239157] hover:bg-[#1d7b49]"
                    : "bg-[#d94a62] hover:bg-[#bf3d53]"
                }`}
              >
                {actionState.action === "confirm" ? "Yes, Confirm" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
