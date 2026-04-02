"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { browserApiRequest } from "@/lib/api/browser-api-client";
import { ADMIN_TUTOR_APPLICATIONS_ROUTE } from "@/lib/routes";
import type { ApplicationStatus, TutorApplication } from "@/lib/admin/tutor-applications-data";

type ActionState = {
  action: "confirm" | "cancel";
} | null;

function statusBadgeClassName(status: ApplicationStatus) {
  if (status === "Approved") {
    return "bg-[#ebf7ef] text-[#239157]";
  }

  if (status === "Rejected") {
    return "bg-[#ffecef] text-[#d94a62]";
  }

  return "bg-[#fff6de] text-[#b58112]";
}

export function AdminTutorApplicationReviewPage({
  applicationId,
  application,
}: {
  applicationId: string;
  application: TutorApplication | null;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(application?.status ?? "Pending");
  const [actionState, setActionState] = useState<ActionState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleActionApprove = async () => {
    if (!actionState || !application || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const nextStatus = actionState.action === "confirm" ? "approved" : "rejected";

    try {
      await browserApiRequest({
        url: `/api/admin/tutor-applications/${application.id}/status`,
        method: "PATCH",
        data: { status: nextStatus },
      });

      setCurrentStatus(actionState.action === "confirm" ? "Approved" : "Rejected");
      router.push(ADMIN_TUTOR_APPLICATIONS_ROUTE);
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to update application status.");
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <div className="w-full">
        {application ? (
          <section className="rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-[#20242b]">Application Review</h2>
                <p className="text-[13px] text-[#6b7280]">
                  Reviewing {application.fullName} ({application.id})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClassName(currentStatus)}`}
                >
                  {currentStatus}
                </span>
                <Link
                  href={ADMIN_TUTOR_APPLICATIONS_ROUTE}
                  className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-3 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  Back to Applications
                </Link>
              </div>
            </div>

            {submitError ? (
              <p className="mt-3 rounded-md border border-[#ffecef] bg-[#fff5f7] px-3 py-2 text-[12px] text-[#d61c3f]">{submitError}</p>
            ) : null}

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Contact Information</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">Name: {application.fullName}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Email: {application.email}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Phone: {application.phone}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Location: {application.location}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Submitted: {application.submittedOn}</p>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Professional Details</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">Experience: {application.experience}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Education: {application.education}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Availability: {application.availability}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Requested Rate: {application.hourlyRate}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#f8fafb] p-4">
              <h3 className="text-[14px] font-bold text-[#20242b]">Subjects</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {application.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex rounded-full bg-[#ebf7ef] px-2.5 py-1 text-[11px] font-semibold text-[#239157]"
                  >
                    {subject}
                  </span>
                ))}
                {application.subjects.length === 0 ? <span className="text-[13px] text-[#6b7280]">Not provided</span> : null}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#f8fafb] p-4">
              <h3 className="text-[14px] font-bold text-[#20242b]">Tutor Bio</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#4b5563]">{application.bio}</p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Certifications</h3>
                <ul className="mt-2 space-y-1">
                  {application.certifications.map((item) => (
                    <li key={item} className="text-[13px] text-[#4b5563]">
                      - {item}
                    </li>
                  ))}
                  {application.certifications.length === 0 ? <li className="text-[13px] text-[#6b7280]">- Not provided</li> : null}
                </ul>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Uploaded Documents</h3>
                <ul className="mt-2 space-y-1">
                  {application.documents.map((item) => (
                    <li key={item} className="text-[13px] text-[#4b5563]">
                      - {item}
                    </li>
                  ))}
                  {application.documents.length === 0 ? <li className="text-[13px] text-[#6b7280]">- No documents found</li> : null}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActionState({ action: "confirm" })}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#239157] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1d7b49] disabled:opacity-60"
              >
                <FiCheckCircle className="h-4 w-4" />
                Approve
              </button>
              <button
                type="button"
                onClick={() => setActionState({ action: "cancel" })}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d94a62] px-5 text-[13px] font-semibold text-white transition hover:bg-[#bf3d53] disabled:opacity-60"
              >
                <FiXCircle className="h-4 w-4" />
                Reject
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

      {actionState && application ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#20242b]">
              {actionState.action === "confirm" ? "Approve This Application?" : "Reject This Application?"}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
              {actionState.action === "confirm"
                ? "This will approve the application and remove it from pending list."
                : "This will reject the application and remove it from pending list."}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActionState(null)}
                disabled={isSubmitting}
                className="inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-60"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleActionApprove}
                disabled={isSubmitting}
                className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-white transition disabled:opacity-60 ${
                  actionState.action === "confirm"
                    ? "bg-[#239157] hover:bg-[#1d7b49]"
                    : "bg-[#d94a62] hover:bg-[#bf3d53]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : actionState.action === "confirm" ? (
                  "Yes, Approve"
                ) : (
                  "Yes, Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
