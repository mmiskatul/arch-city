import { browserApiRequestRaw } from "@/lib/api/browser-api-client";

export type TutorOnboardingFormData = {
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
  ssn: string;
  has_offenses: boolean;
  is_certified: boolean;
  is_employed_teacher: boolean;
  is_working_toward_extra_certs: boolean;
  approved: boolean;
};

export type TutorOnboardingResponse = {
  submitted: boolean;
  status: "not_submitted" | "pending" | "approved" | "rejected";
  message: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  } | null;
  recommendations?: {
    subjects?: { value: string; count: number }[] | null;
    grades?: { value: string; count: number }[] | null;
  } | null;
  application?: TutorOnboardingFormData | null;
};

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? url.replace(/\/$/, "") : null;
}

export async function requestTutorOnboarding({
  method,
  payload,
}: {
  method: "GET" | "PUT";
  payload?: TutorOnboardingFormData;
}) {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return browserApiRequestRaw<TutorOnboardingResponse, TutorOnboardingFormData>({
    url: `${baseUrl}/tutor/onboarding`,
    method,
    data: payload,
    includeAuth: true,
  });
}
