"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";

type ApplicationStatus = "Pending" | "Confirmed" | "Cancelled";

type TutorApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  submittedOn: string;
  subjects: string[];
  experience: string;
  education: string;
  availability: string;
  hourlyRate: string;
  location: string;
  bio: string;
  certifications: string[];
  documents: string[];
  status: ApplicationStatus;
};

type ActionState = {
  id: string;
  action: "confirm" | "cancel";
} | null;

const initialApplications: TutorApplication[] = [
  {
    id: "TA-1024",
    fullName: "Marcus Reynolds",
    email: "marcus.reynolds@email.com",
    phone: "+1 (314) 555-0193",
    submittedOn: "March 19, 2026",
    subjects: ["Algebra", "Geometry", "Pre-Calculus"],
    experience: "6 years private tutoring + 2 years classroom support",
    education: "B.S. in Mathematics, University of Missouri",
    availability: "Weekdays 4:00 PM - 9:00 PM, Saturday mornings",
    hourlyRate: "$45/hr",
    location: "St. Louis, MO (Virtual + In-Person)",
    bio: "I help middle and high school students build confidence in math with step-by-step problem solving and exam-focused practice.",
    certifications: ["Background Check Cleared", "State Tutor Eligibility"],
    documents: ["Resume.pdf", "Teaching Certificate.pdf", "ID Verification.pdf"],
    status: "Pending",
  },
  {
    id: "TA-1025",
    fullName: "Lisa Davis",
    email: "lisa.davis@email.com",
    phone: "+1 (314) 555-0147",
    submittedOn: "March 20, 2026",
    subjects: ["Reading", "Writing", "English"],
    experience: "5 years literacy coaching and one-on-one tutoring",
    education: "M.Ed. in Curriculum and Instruction, Saint Louis University",
    availability: "Mon-Fri 3:00 PM - 8:00 PM",
    hourlyRate: "$40/hr",
    location: "St. Louis, MO (Virtual only)",
    bio: "I specialize in reading comprehension, essay writing, and helping students improve academic communication skills.",
    certifications: ["Background Check Cleared", "TESOL Certification"],
    documents: ["Resume.pdf", "Degree Transcript.pdf", "Background Check.pdf"],
    status: "Pending",
  },
  {
    id: "TA-1026",
    fullName: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (314) 555-0129",
    submittedOn: "March 20, 2026",
    subjects: ["SAT Prep", "Math", "Physics"],
    experience: "7 years test-prep tutoring and AP mentoring",
    education: "B.S. in Physics, Washington University in St. Louis",
    availability: "Weekdays after 5:00 PM, Sunday afternoon",
    hourlyRate: "$50/hr",
    location: "Clayton, MO (Virtual + In-Person)",
    bio: "I focus on score improvement strategies, timed practice, and concept clarity for SAT Math and Physics.",
    certifications: ["Background Check Cleared"],
    documents: ["Resume.pdf", "Score Reports.pdf", "ID Verification.pdf"],
    status: "Pending",
  },
  {
    id: "TA-1027",
    fullName: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+1 (314) 555-0181",
    submittedOn: "March 21, 2026",
    subjects: ["Chemistry", "Biology", "Science"],
    experience: "4 years science tutoring for grades 8-12",
    education: "M.S. in Biochemistry, University of Missouri",
    availability: "Tue-Thu 4:30 PM - 9:00 PM, Saturday 10:00 AM - 1:00 PM",
    hourlyRate: "$42/hr",
    location: "St. Louis, MO (In-Person preferred)",
    bio: "I simplify complex science topics through visuals, real-world examples, and structured revision plans.",
    certifications: ["Background Check Cleared", "First Aid Certified"],
    documents: ["Resume.pdf", "Degree Certificate.pdf", "Reference Letters.pdf"],
    status: "Pending",
  },
];

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
  const [applications, setApplications] = useState<TutorApplication[]>(initialApplications);
  const [selectedId, setSelectedId] = useState<string>(initialApplications[0]?.id ?? "");
  const [actionState, setActionState] = useState<ActionState>(null);

  const selectedApplication = useMemo(
    () => applications.find((item) => item.id === selectedId) ?? null,
    [applications, selectedId],
  );

  const handleActionRequest = (id: string, action: "confirm" | "cancel") => {
    setActionState({ id, action });
  };

  const handleActionApprove = () => {
    if (!actionState) return;

    setApplications((prev) =>
      prev.map((item) =>
        item.id === actionState.id
          ? { ...item, status: actionState.action === "confirm" ? "Confirmed" : "Cancelled" }
          : item,
      ),
    );
    setActionState(null);
  };

  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#20242b]">Tutor Applications</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">
              Review pending tutor applications and take approval actions.
            </p>
          </div>
          <p className="text-[13px] font-semibold text-[#6b7280]">
            Total Applications: {applications.length}
          </p>
        </div>

        <section className="mt-5 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-[0.9fr_1.4fr_0.9fr_0.8fr_1.2fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                <span>ID</span>
                <span>Tutor</span>
                <span>Submitted</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="grid grid-cols-[0.9fr_1.4fr_0.9fr_0.8fr_1.2fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563]"
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
                      <button
                        type="button"
                        onClick={() => setSelectedId(application.id)}
                        className="inline-flex h-8 items-center rounded-full border border-[#d1d5db] bg-white px-3 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActionRequest(application.id, "confirm")}
                        className="inline-flex h-8 items-center rounded-full bg-[#239157] px-3 text-[12px] font-semibold text-white transition hover:bg-[#1d7b49]"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActionRequest(application.id, "cancel")}
                        className="inline-flex h-8 items-center rounded-full bg-[#d94a62] px-3 text-[12px] font-semibold text-white transition hover:bg-[#bf3d53]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {selectedApplication ? (
          <section className="mt-5 rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-[#20242b]">Application Review</h2>
                <p className="text-[13px] text-[#6b7280]">
                  Reviewing {selectedApplication.fullName} ({selectedApplication.id})
                </p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClassName(selectedApplication.status)}`}
              >
                {selectedApplication.status}
              </span>
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
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#f8fafb] p-4">
                <h3 className="text-[14px] font-bold text-[#20242b]">Uploaded Documents</h3>
                <ul className="mt-2 space-y-1">
                  {selectedApplication.documents.map((item) => (
                    <li key={item} className="text-[13px] text-[#4b5563]">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleActionRequest(selectedApplication.id, "confirm")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#239157] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1d7b49]"
              >
                <FiCheckCircle className="h-4 w-4" />
                Confirm Application
              </button>
              <button
                type="button"
                onClick={() => handleActionRequest(selectedApplication.id, "cancel")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d94a62] px-5 text-[13px] font-semibold text-white transition hover:bg-[#bf3d53]"
              >
                <FiXCircle className="h-4 w-4" />
                Cancel Application
              </button>
            </div>
          </section>
        ) : null}
      </div>

      {actionState ? (
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
