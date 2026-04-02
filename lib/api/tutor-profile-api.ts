import { browserApiRequestRaw } from "@/lib/api/browser-api-client";

type TutorProfileMethod = "GET" | "PUT";
type TutorBioSchoolDistrictMethod = "GET" | "PUT";
type TutorEducationMethod = "GET" | "POST" | "PUT" | "DELETE";
type TutorWorkExperienceMethod = "GET" | "POST" | "PUT" | "DELETE";
type TutorSubjectsGradesMethod = "GET" | "PUT";
type TutorRatesMethod = "GET" | "PUT";
type TutorPreferencesMethod = "GET" | "PUT";
type TutorLocationMethod = "GET" | "POST" | "PUT" | "DELETE" | "PREFER";

type ResponseLike = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
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

function buildTutorProfileUrls(method: TutorProfileMethod) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_PROFILE_GET_URL?.trim()
      : process.env.NEXT_PUBLIC_API_TUTOR_PROFILE_UPDATE_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPaths = ["/tutor/profile/personal-info", "/tutor/profile"];

  const baseUrls = baseUrl
    ? fallbackPaths.map((path) => `${baseUrl}${normalizePath(path)}`)
    : [];

  return uniqueUrls([directUrl ?? "", ...baseUrls]);
}

function buildTutorBioSchoolDistrictUrls(method: TutorBioSchoolDistrictMethod) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_BIO_SCHOOL_DISTRICT_GET_URL?.trim()
      : process.env.NEXT_PUBLIC_API_TUTOR_BIO_SCHOOL_DISTRICT_UPDATE_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPaths = ["/tutor/profile/bio-school-district"];

  const baseUrls = baseUrl
    ? fallbackPaths.map((path) => `${baseUrl}${normalizePath(path)}`)
    : [];

  return uniqueUrls([directUrl ?? "", ...baseUrls]);
}

function applyEducationIdTemplate(url: string, educationId?: string) {
  if (!educationId) return url;
  return url.replace("{education_id}", educationId).replace(":education_id", educationId);
}

function buildTutorEducationUrls(method: TutorEducationMethod, educationId?: string) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_EDUCATION_GET_URL?.trim()
      : method === "POST"
        ? process.env.NEXT_PUBLIC_API_TUTOR_EDUCATION_ADD_URL?.trim()
        : method === "PUT"
          ? process.env.NEXT_PUBLIC_API_TUTOR_EDUCATION_UPDATE_URL?.trim()
          : process.env.NEXT_PUBLIC_API_TUTOR_EDUCATION_DELETE_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPath =
    method === "PUT" || method === "DELETE"
      ? `/tutor/profile/education/${educationId ?? ""}`
      : "/tutor/profile/education";

  const baseUrls = baseUrl ? [`${baseUrl}${normalizePath(fallbackPath)}`] : [];

  return uniqueUrls([directUrl ? applyEducationIdTemplate(directUrl, educationId) : "", ...baseUrls]);
}

function applyWorkExperienceIdTemplate(url: string, workExperienceId?: string) {
  if (!workExperienceId) return url;
  return url.replace("{work_experience_id}", workExperienceId).replace(":work_experience_id", workExperienceId);
}

function buildTutorWorkExperienceUrls(method: TutorWorkExperienceMethod, workExperienceId?: string) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_WORK_EXPERIENCE_GET_URL?.trim()
      : method === "POST"
        ? process.env.NEXT_PUBLIC_API_TUTOR_WORK_EXPERIENCE_ADD_URL?.trim()
        : method === "PUT"
          ? process.env.NEXT_PUBLIC_API_TUTOR_WORK_EXPERIENCE_UPDATE_URL?.trim()
          : process.env.NEXT_PUBLIC_API_TUTOR_WORK_EXPERIENCE_DELETE_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPath =
    method === "PUT" || method === "DELETE"
      ? `/tutor/profile/work-experience/${workExperienceId ?? ""}`
      : "/tutor/profile/work-experience";

  const baseUrls = baseUrl ? [`${baseUrl}${normalizePath(fallbackPath)}`] : [];

  return uniqueUrls([
    directUrl ? applyWorkExperienceIdTemplate(directUrl, workExperienceId) : "",
    ...baseUrls,
  ]);
}

function buildTutorSubjectsGradesUrls(method: TutorSubjectsGradesMethod) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_SUBJECTS_GRADES_GET_URL?.trim()
      : process.env.NEXT_PUBLIC_API_TUTOR_SUBJECTS_GRADES_UPDATE_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPath = "/tutor/profile/subjects-grades";
  const baseUrls = baseUrl ? [`${baseUrl}${normalizePath(fallbackPath)}`] : [];

  return uniqueUrls([directUrl ?? "", ...baseUrls]);
}

function buildTutorRatesUrls(method: TutorRatesMethod) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_RATES_GET_URL?.trim()
      : process.env.NEXT_PUBLIC_API_TUTOR_RATES_UPDATE_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPath = "/tutor/profile/rates";
  const baseUrls = baseUrl ? [`${baseUrl}${normalizePath(fallbackPath)}`] : [];

  return uniqueUrls([directUrl ?? "", ...baseUrls]);
}

function buildTutorPreferencesUrls(method: TutorPreferencesMethod) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_PREFERENCES_GET_URL?.trim()
      : process.env.NEXT_PUBLIC_API_TUTOR_PREFERENCES_UPDATE_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPath = "/tutor/profile/preferences";
  const baseUrls = baseUrl ? [`${baseUrl}${normalizePath(fallbackPath)}`] : [];

  return uniqueUrls([directUrl ?? "", ...baseUrls]);
}

function applyLocationIdTemplate(url: string, locationId?: string) {
  if (!locationId) return url;
  return url.replace("{location_id}", locationId).replace(":location_id", locationId);
}

function buildTutorLocationUrls(method: TutorLocationMethod, locationId?: string) {
  const directUrl =
    method === "GET"
      ? process.env.NEXT_PUBLIC_API_TUTOR_LOCATION_GET_URL?.trim()
      : method === "POST"
        ? process.env.NEXT_PUBLIC_API_TUTOR_LOCATION_ADD_URL?.trim()
        : method === "PUT"
          ? process.env.NEXT_PUBLIC_API_TUTOR_LOCATION_UPDATE_URL?.trim()
          : method === "DELETE"
            ? process.env.NEXT_PUBLIC_API_TUTOR_LOCATION_DELETE_URL?.trim()
            : process.env.NEXT_PUBLIC_API_TUTOR_LOCATION_PREFERRED_URL?.trim();

  const baseUrl = resolveApiBaseUrl();
  const fallbackPath =
    method === "PUT" || method === "DELETE"
      ? `/tutor/profile/location/${locationId ?? ""}`
      : method === "PREFER"
        ? `/tutor/profile/location/${locationId ?? ""}/preferred`
        : "/tutor/profile/location";

  const baseUrls = baseUrl ? [`${baseUrl}${normalizePath(fallbackPath)}`] : [];

  return uniqueUrls([directUrl ? applyLocationIdTemplate(directUrl, locationId) : "", ...baseUrls]);
}

export function resolveTutorProfileUrl(method: TutorProfileMethod) {
  const urls = buildTutorProfileUrls(method);
  return urls.length > 0 ? urls[0] : null;
}

async function requestWithFallback({
  urls,
  method,
  token,
  body,
  extraInit,
}: {
  urls: string[];
  method: string;
  token?: string;
  body?: string;
  extraInit?: RequestInit;
}) {
  if (urls.length === 0) return null;

  let lastResponse: ResponseLike | null = null;
  for (const url of urls) {
    const parsedBody = body ? JSON.parse(body) : undefined;
    const response = await browserApiRequestRaw({
      url,
      method,
      data: parsedBody,
      headers: {
        ...(method === "POST" || method === "PUT" ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(extraInit?.headers as Record<string, string> | undefined),
      },
      includeAuth: !token,
    });

    if (response.ok) return response;
    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) return response;
  }

  return lastResponse;
}

export async function requestTutorProfileWithFallback({ method, token, body, extraInit }: { method: TutorProfileMethod; token?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({ urls: buildTutorProfileUrls(method), method, token, body, extraInit });
}

export async function requestTutorBioSchoolDistrictWithFallback({ method, token, body, extraInit }: { method: TutorBioSchoolDistrictMethod; token?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({ urls: buildTutorBioSchoolDistrictUrls(method), method, token, body, extraInit });
}

export async function requestTutorEducationWithFallback({ method, token, educationId, body, extraInit }: { method: TutorEducationMethod; token?: string; educationId?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({ urls: buildTutorEducationUrls(method, educationId), method, token, body, extraInit });
}

export async function requestTutorWorkExperienceWithFallback({ method, token, workExperienceId, body, extraInit }: { method: TutorWorkExperienceMethod; token?: string; workExperienceId?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({ urls: buildTutorWorkExperienceUrls(method, workExperienceId), method, token, body, extraInit });
}

export async function requestTutorSubjectsGradesWithFallback({ method, token, body, extraInit }: { method: TutorSubjectsGradesMethod; token?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({ urls: buildTutorSubjectsGradesUrls(method), method, token, body, extraInit });
}

export async function requestTutorRatesWithFallback({ method, token, body, extraInit }: { method: TutorRatesMethod; token?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({ urls: buildTutorRatesUrls(method), method, token, body, extraInit });
}

export async function requestTutorPreferencesWithFallback({ method, token, body, extraInit }: { method: TutorPreferencesMethod; token?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({ urls: buildTutorPreferencesUrls(method), method, token, body, extraInit });
}

export async function requestTutorLocationWithFallback({ method, token, locationId, body, extraInit }: { method: TutorLocationMethod; token?: string; locationId?: string; body?: string; extraInit?: RequestInit; }) {
  return requestWithFallback({
    urls: buildTutorLocationUrls(method, locationId),
    method: method === "PREFER" ? "PUT" : method,
    token,
    body,
    extraInit,
  });
}
