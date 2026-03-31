export type TutorApplicationStatus = "not_submitted" | "pending" | "approved" | "rejected";

export type TutorApplicationPayload = {
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
  approved: true;
};

type TutorApplicationResponse = {
  submitted: boolean;
  status: TutorApplicationStatus;
  message: string;
  application?: Record<string, unknown> | null;
};

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

function uniqueUrls(urls: string[]) {
  return Array.from(new Set(urls.filter(Boolean)));
}

function buildTutorApplicationUrls(method: "GET" | "POST") {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_APPLICATION_GET_URL?.trim()
      : process.env.NEXT_PUBLIC_API_TUTOR_APPLICATION_SUBMIT_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPath = "/tutor/application";
  const baseUrls = baseUrl ? [`${baseUrl}${normalizePath(fallbackPath)}`] : [];

  return uniqueUrls([directUrl ?? "", ...baseUrls]);
}

async function requestWithFallback({
  urls,
  method,
  token,
  body,
}: {
  urls: string[];
  method: "GET" | "POST";
  token: string;
  body?: string;
}) {
  if (urls.length === 0) return null;

  let lastResponse: Response | null = null;
  for (const url of urls) {
    const response = await fetch(url, {
      method,
      headers: {
        ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
      },
      ...(body ? { body } : {}),
    });

    if (response.ok) return response;
    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) return response;
  }

  return lastResponse;
}

export async function fetchTutorApplicationStatus(token: string): Promise<TutorApplicationStatus> {
  const response = await requestWithFallback({
    urls: buildTutorApplicationUrls("GET"),
    method: "GET",
    token,
  });

  if (!response || !response.ok) return "not_submitted";

  const data = (await response.json()) as TutorApplicationResponse;
  return data.status;
}

export async function submitTutorApplication({
  token,
  payload,
}: {
  token: string;
  payload: TutorApplicationPayload;
}) {
  return requestWithFallback({
    urls: buildTutorApplicationUrls("POST"),
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}
