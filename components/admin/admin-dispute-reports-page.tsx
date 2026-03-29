"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";

type DisputeStatus = "Open" | "Resolved";

type DisputeReport = {
  id: string;
  studentName: string;
  tutorName: string;
  issueType: string;
  openedOn: string;
  sessionRef: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  studentStatement: string;
  tutorStatement: string;
  requestedResolution: string;
  status: DisputeStatus;
};

const initialDisputes: DisputeReport[] = [
  {
    id: "DR-901",
    studentName: "Maya Wilson",
    tutorName: "Lisa Davis",
    issueType: "No-show / Attendance",
    openedOn: "March 20, 2026",
    sessionRef: "SES-2031",
    priority: "High",
    description: "Student reported tutor did not join within 20 minutes of start time.",
    studentStatement: "I waited in the meeting room and sent two messages with no response.",
    tutorStatement: "I had internet outage and informed support later the same day.",
    requestedResolution: "Session credit + no late cancellation fee.",
    status: "Open",
  },
  {
    id: "DR-902",
    studentName: "Alex Thompson",
    tutorName: "David Kim",
    issueType: "Billing Amount",
    openedOn: "March 21, 2026",
    sessionRef: "SES-2038",
    priority: "Medium",
    description: "Parent reported billed duration is 90 min but session ended in 60 min.",
    studentStatement: "Session ended early and we should be charged for one hour only.",
    tutorStatement: "I ended at 60 min. Duration mismatch may be from auto timer.",
    requestedResolution: "Partial refund of extra 30 minutes.",
    status: "Open",
  },
  {
    id: "DR-903",
    studentName: "Sophie Lee",
    tutorName: "Priya Patel",
    issueType: "Session Quality",
    openedOn: "March 22, 2026",
    sessionRef: "SES-2042",
    priority: "Low",
    description: "Student requested reassignment due to teaching style mismatch.",
    studentStatement: "Tutor is knowledgeable but not matching my learning pace.",
    tutorStatement: "I can adjust plan, but I understand if reassignment is needed.",
    requestedResolution: "Tutor reassignment for future sessions.",
    status: "Open",
  },
];

function priorityClassName(priority: DisputeReport["priority"]) {
  if (priority === "High") return "bg-[#ffecef] text-[#d94a62]";
  if (priority === "Medium") return "bg-[#fff6de] text-[#b58112]";
  return "bg-[#ebf7ef] text-[#239157]";
}

function statusClassName(status: DisputeStatus) {
  if (status === "Resolved") return "bg-[#ebf7ef] text-[#239157]";
  return "bg-[#fff6de] text-[#b58112]";
}

export function AdminDisputeReportsPage() {
  const [disputes, setDisputes] = useState<DisputeReport[]>(initialDisputes);
  const [selectedId, setSelectedId] = useState<string>(initialDisputes[0]?.id ?? "");
  const [resolveTarget, setResolveTarget] = useState<string | null>(null);

  const selectedDispute = useMemo(
    () => disputes.find((item) => item.id === selectedId) ?? null,
    [disputes, selectedId],
  );

  const handleResolve = () => {
    if (!resolveTarget) return;

    setDisputes((prev) =>
      prev.map((item) => (item.id === resolveTarget ? { ...item, status: "Resolved" } : item)),
    );
    setResolveTarget(null);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#20242b]">Dispute Reports</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">
              Review reports from students and tutors, then apply a final resolution.
            </p>
          </div>
          <p className="text-[13px] font-semibold text-[#6b7280]">
            Open Cases: {disputes.filter((item) => item.status === "Open").length}
          </p>
        </div>

        <section className="mt-5 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[0.8fr_1.2fr_1.2fr_1fr_0.8fr_0.9fr_1fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                <span>ID</span>
                <span>Student</span>
                <span>Tutor</span>
                <span>Issue</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {disputes.map((report) => (
                  <div
                    key={report.id}
                    className="grid grid-cols-[0.8fr_1.2fr_1.2fr_1fr_0.8fr_0.9fr_1fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
                  >
                    <span className="font-semibold text-[#374151]">{report.id}</span>
                    <span>{report.studentName}</span>
                    <span>{report.tutorName}</span>
                    <span>{report.issueType}</span>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${priorityClassName(report.priority)}`}>
                        {report.priority}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClassName(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(report.id)}
                        className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-3 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolveTarget(report.id)}
                        disabled={report.status === "Resolved"}
                        className="inline-flex h-8 items-center rounded-full bg-[#239157] px-3 text-[12px] font-semibold text-white transition hover:bg-[#1d7b49] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {selectedDispute ? (
          <section className="mt-5 rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-[#20242b]">Case Review</h2>
                <p className="text-[13px] text-[#6b7280]">
                  {selectedDispute.id} | Session {selectedDispute.sessionRef} | Opened {selectedDispute.openedOn}
                </p>
              </div>
              <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClassName(selectedDispute.status)}`}>
                {selectedDispute.status}
              </span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Issue Summary</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">Type: {selectedDispute.issueType}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Student: {selectedDispute.studentName}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Tutor: {selectedDispute.tutorName}</p>
                <p className="mt-1 text-[13px] text-[#4b5563]">Description: {selectedDispute.description}</p>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Requested Resolution</h3>
                <p className="mt-2 text-[13px] text-[#4b5563]">{selectedDispute.requestedResolution}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Student Statement</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#4b5563]">{selectedDispute.studentStatement}</p>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Tutor Statement</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#4b5563]">{selectedDispute.tutorStatement}</p>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setResolveTarget(selectedDispute.id)}
                disabled={selectedDispute.status === "Resolved"}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#239157] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1d7b49] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                <FiCheckCircle className="h-4 w-4" />
                Mark As Resolved
              </button>
            </div>
          </section>
        ) : null}
      </div>

      {resolveTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4">
          <div className="w-full max-w-md rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#20242b]">Resolve This Dispute?</h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
              This action will mark the case as resolved and close the dispute workflow.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResolveTarget(null)}
                className="inline-flex h-9 items-center rounded-full border border-[#d1d5db] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleResolve}
                className="inline-flex h-9 items-center rounded-full bg-[#239157] px-4 text-[13px] font-semibold text-white transition hover:bg-[#1d7b49]"
              >
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
