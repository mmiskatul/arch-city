import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminTutorApplicationStatus = "pending" | "approved" | "rejected";

export type AdminTutorApplicationApiItem = {
  application_id: string;
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

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

async function request<T>(path: string): Promise<T> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = (await cookies()).get("arch_access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`API failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

export async function fetchAdminTutorApplications(view: "pending" | "all" = "pending") {
  const path =
    view === "all"
      ? "/admin-dashboard/tutor-applications/all"
      : "/admin-dashboard/tutor-applications/pending";

  return request<AdminTutorApplicationsListResponse>(path);
}

export async function fetchAdminTutorApplicationById(applicationId: string) {
  return request<AdminTutorApplicationDetailResponse>(`/admin-dashboard/tutor-applications/${applicationId}`);
}

export async function fetchAdminTutorApplicationStats() {
  return request<AdminTutorApplicationStatsResponse>("/admin-dashboard/tutor-applications/stats");
}
