type TutorProfileMethod = "GET" | "PUT";
type TutorBioSchoolDistrictMethod = "GET" | "PUT";
type TutorEducationMethod = "GET" | "POST" | "PUT" | "DELETE";
type TutorWorkExperienceMethod = "GET" | "POST" | "PUT" | "DELETE";
type TutorSubjectsGradesMethod = "GET" | "PUT";

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

export function resolveTutorProfileUrl(method: TutorProfileMethod) {
  const urls = buildTutorProfileUrls(method);
  return urls.length > 0 ? urls[0] : null;
}

export async function requestTutorProfileWithFallback({
  method,
  token,
  body,
  extraInit,
}: {
  method: TutorProfileMethod;
  token: string;
  body?: string;
  extraInit?: RequestInit;
}) {
  const urls = buildTutorProfileUrls(method);
  if (urls.length === 0) return null;

  let lastResponse: Response | null = null;
  for (const url of urls) {
    const response = await fetch(url, {
      method,
      headers: {
        ...(method === "PUT" ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...(extraInit?.headers ?? {}),
      },
      ...(body ? { body } : {}),
      ...extraInit,
    });

    if (response.ok) return response;
    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) return response;
  }

  return lastResponse;
}

export async function requestTutorBioSchoolDistrictWithFallback({
  method,
  token,
  body,
  extraInit,
}: {
  method: TutorBioSchoolDistrictMethod;
  token: string;
  body?: string;
  extraInit?: RequestInit;
}) {
  const urls = buildTutorBioSchoolDistrictUrls(method);
  if (urls.length === 0) return null;

  let lastResponse: Response | null = null;
  for (const url of urls) {
    const response = await fetch(url, {
      method,
      headers: {
        ...(method === "PUT" ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...(extraInit?.headers ?? {}),
      },
      ...(body ? { body } : {}),
      ...extraInit,
    });

    if (response.ok) return response;
    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) return response;
  }

  return lastResponse;
}

export async function requestTutorEducationWithFallback({
  method,
  token,
  educationId,
  body,
  extraInit,
}: {
  method: TutorEducationMethod;
  token: string;
  educationId?: string;
  body?: string;
  extraInit?: RequestInit;
}) {
  const urls = buildTutorEducationUrls(method, educationId);
  if (urls.length === 0) return null;

  let lastResponse: Response | null = null;
  for (const url of urls) {
    const response = await fetch(url, {
      method,
      headers: {
        ...(method === "POST" || method === "PUT" ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...(extraInit?.headers ?? {}),
      },
      ...(body ? { body } : {}),
      ...extraInit,
    });

    if (response.ok) return response;
    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) return response;
  }

  return lastResponse;
}

export async function requestTutorWorkExperienceWithFallback({
  method,
  token,
  workExperienceId,
  body,
  extraInit,
}: {
  method: TutorWorkExperienceMethod;
  token: string;
  workExperienceId?: string;
  body?: string;
  extraInit?: RequestInit;
}) {
  const urls = buildTutorWorkExperienceUrls(method, workExperienceId);
  if (urls.length === 0) return null;

  let lastResponse: Response | null = null;
  for (const url of urls) {
    const response = await fetch(url, {
      method,
      headers: {
        ...(method === "POST" || method === "PUT" ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...(extraInit?.headers ?? {}),
      },
      ...(body ? { body } : {}),
      ...extraInit,
    });

    if (response.ok) return response;
    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) return response;
  }

  return lastResponse;
}

export async function requestTutorSubjectsGradesWithFallback({
  method,
  token,
  body,
  extraInit,
}: {
  method: TutorSubjectsGradesMethod;
  token: string;
  body?: string;
  extraInit?: RequestInit;
}) {
  const urls = buildTutorSubjectsGradesUrls(method);
  if (urls.length === 0) return null;

  let lastResponse: Response | null = null;
  for (const url of urls) {
    const response = await fetch(url, {
      method,
      headers: {
        ...(method === "PUT" ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...(extraInit?.headers ?? {}),
      },
      ...(body ? { body } : {}),
      ...extraInit,
    });

    if (response.ok) return response;
    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) return response;
  }

  return lastResponse;
}
