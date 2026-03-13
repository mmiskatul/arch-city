type PublicApiEndpointKey = "login" | "signup" | "contact";

type PublicApiRequest = {
  endpoint: PublicApiEndpointKey;
  payload: unknown;
};

type PublicApiResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string;
};

const endpointEnvMap: Record<PublicApiEndpointKey, string | undefined> = {
  login: process.env.NEXT_PUBLIC_API_LOGIN_URL,
  signup: process.env.NEXT_PUBLIC_API_SIGNUP_URL,
  contact: process.env.NEXT_PUBLIC_API_CONTACT_URL,
};

const endpointPathMap: Record<PublicApiEndpointKey, string> = {
  login: "/auth/login",
  signup: "/auth/signup",
  contact: "/contact",
};

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function resolvePublicApiUrl(endpoint: PublicApiEndpointKey) {
  const directUrl = endpointEnvMap[endpoint]?.trim();

  if (directUrl) {
    return directUrl;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!baseUrl) {
    return null;
  }

  return `${normalizeBaseUrl(baseUrl)}${normalizePath(endpointPathMap[endpoint])}`;
}

export async function submitPublicApi<T = unknown>({
  endpoint,
  payload,
}: PublicApiRequest): Promise<PublicApiResponse<T>> {
  const url = resolvePublicApiUrl(endpoint);

  if (!url) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: `Missing API configuration for ${endpoint}. Set NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_${endpoint.toUpperCase()}_URL.`,
    };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? ((await response.json()) as T)
      : null;

    if (!response.ok) {
      const message =
        (data &&
          typeof data === "object" &&
          "message" in data &&
          typeof data.message === "string" &&
          data.message) ||
        `Request failed with status ${response.status}.`;

      return {
        ok: false,
        status: response.status,
        data,
        error: message,
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
      error: "",
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      error: "Network error. Check the API URL and server availability.",
    };
  }
}
