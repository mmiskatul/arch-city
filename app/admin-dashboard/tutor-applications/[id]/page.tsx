import { AdminTutorApplicationReviewPage } from "@/components/admin/admin-tutor-application-review-page";
import type { ApplicationStatus, TutorApplication } from "@/lib/admin/tutor-applications-data";
import {
  fetchAdminTutorApplicationById,
  type AdminTutorApplicationApiItem,
} from "@/lib/api/admin-tutor-applications-api";

function toDisplayStatus(status: string): ApplicationStatus {
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

function toUiApplication(item: AdminTutorApplicationApiItem): TutorApplication {
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

export default async function AdminTutorApplicationReviewRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetchAdminTutorApplicationById(id).catch(() => null);
  const application = response ? toUiApplication(response.item) : null;

  return <AdminTutorApplicationReviewPage applicationId={id} application={application} />;
}
