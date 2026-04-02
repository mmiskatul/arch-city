import { browserApiRequest } from "@/lib/api/browser-api-client";

export type AdminTutorApplicationStatus = "pending" | "approved" | "rejected";

export type AdminTutorApplicationApiItem = {
  id: string;
  application_id?: string | null;
  status: AdminTutorApplicationStatus;
  submitted_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  degree: string;
  certification: string;
  tutoring_mode: string;
  in_person_location: string;
  remote_tools: string;
  tutoring_days_per_month: string;
  grade_levels: string;
  subjects: string;
  teaching_approach: string;
  engagement_methods: string;
  session_structure: string;
  customization_approach: string;
  has_offenses: boolean;
  is_certified: boolean;
  is_employed_teacher: boolean;
  is_working_toward_extra_certs: boolean;
};

export type AdminTutorApplicationsListResponse = {
  total: number;
  items: AdminTutorApplicationApiItem[];
};

export type AdminTutorApplicationDetailResponse = {
  item: AdminTutorApplicationApiItem;
};

export type AdminTutorApplicationStatsResponse = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export async function fetchAdminTutorApplications(view: "pending" | "all" = "pending") {
  const path =
    view === "all"
      ? "/admin-dashboard/tutor-applications/all"
      : "/admin-dashboard/tutor-applications/pending";

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return browserApiRequest<AdminTutorApplicationsListResponse>({
    url: `${baseUrl}${path}`,
    method: "GET",
  });
}

export async function fetchAdminTutorApplicationById(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return browserApiRequest<AdminTutorApplicationDetailResponse>({
    url: `${baseUrl}/admin-dashboard/tutor-applications/${id}`,
    method: "GET",
  });
}

export async function fetchAdminTutorApplicationStats() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return browserApiRequest<AdminTutorApplicationStatsResponse>({
    url: `${baseUrl}/admin-dashboard/tutor-applications/stats`,
    method: "GET",
  });
}
