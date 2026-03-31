type TutorProfileMethod = "GET" | "PUT";

type TutorBioSchoolDistrictMethod = "GET" | "PUT";

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
  const fallbackPaths =
    method === "GET"
      ? ["/tutor/profile/personal-info", "/tutor/profile"]
      : ["/tutor/profile/personal-info", "/tutor/profile"];

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
  const fallbackPaths =
    method === "GET"
      ? ["/tutor/profile/bio-school-district", "/tutor/profile"]
      : ["/tutor/profile/bio-school-district", "/tutor/profile"];

  const baseUrls = baseUrl
    ? fallbackPaths.map((path) => `${baseUrl}${normalizePath(path)}`)
    : [];

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
  if (urls.length === 0) {
    return null;
  }

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

    if (response.ok) {
      return response;
    }

    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) {
      return response;
    }
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
  if (urls.length === 0) {
    return null;
  }

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

    if (response.ok) {
      return response;
    }

    lastResponse = response;
    if (![404, 405, 422, 501].includes(response.status)) {
      return response;
    }
  }

  return lastResponse;
}
